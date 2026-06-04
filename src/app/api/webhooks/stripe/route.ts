export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const VALID_PAID_TIERS = ["basic", "premium", "pro"] as const;
type PaidTier = (typeof VALID_PAID_TIERS)[number];
type UserTier = "free" | PaidTier;
type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          tier: UserTier;
          stripe_customer_id: string | null;
          updated_at: string;
        };
        Insert: never;
        Update: {
          tier?: UserTier;
          stripe_customer_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          stripe_payment_intent_id: string | null;
          stripe_session_id: string | null;
          amount: number;
          tier_granted: UserTier;
          status: "pending" | "completed" | "failed" | "refunded";
        };
        Insert: {
          user_id: string;
          stripe_payment_intent_id?: string | null;
          stripe_session_id?: string | null;
          amount: number;
          tier_granted: UserTier;
          status?: "pending" | "completed" | "failed" | "refunded";
        };
        Update: never;
        Relationships: [];
      };
      processed_webhooks: {
        Row: {
          id: string;
          processed_at: string;
        };
        Insert: {
          id: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
type ServiceClient = SupabaseClient<Database>;

let stripeClient: Stripe | null = null;

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  stripeClient ??= new Stripe(secretKey, {
    apiVersion: "2026-05-27.dahlia",
  });
  return stripeClient;
}

function getServiceClient(): ServiceClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient<Database>(supabaseUrl, serviceRoleKey);
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function parsePaidTier(value: unknown): PaidTier | null {
  const tier = asString(value);
  if (!tier) return null;
  return VALID_PAID_TIERS.includes(tier as PaidTier) ? (tier as PaidTier) : null;
}

function stripeId(value: string | { id: string } | null): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

async function handleCheckoutCompleted(
  supabase: ServiceClient,
  session: Stripe.Checkout.Session
) {
  const userId = asString(session.client_reference_id);
  const tier = parsePaidTier(session.metadata?.tier ?? session.metadata?.plan);
  const customerId = stripeId(session.customer);

  if (!userId) {
    throw new Error(`checkout.session.completed ${session.id} missing client_reference_id`);
  }
  if (!tier) {
    throw new Error(`checkout.session.completed ${session.id} missing valid paid tier metadata`);
  }

  const updatePayload: Database["public"]["Tables"]["users"]["Update"] = {
    tier,
    updated_at: new Date().toISOString(),
  };
  if (customerId) {
    updatePayload.stripe_customer_id = customerId;
  }

  const { error: userError } = await supabase
    .from("users")
    .update(updatePayload)
    .eq("id", userId)
    .select("id")
    .single();

  if (userError) {
    throw new Error(`Failed to grant ${tier} tier to user ${userId}: ${userError.message}`);
  }

  const amount = session.amount_total;
  if (typeof amount === "number") {
    const paymentIntentId = stripeId(session.payment_intent);
    const { error: transactionError } = await supabase.from("transactions").insert({
      user_id: userId,
      stripe_payment_intent_id: paymentIntentId,
      stripe_session_id: session.id,
      amount,
      tier_granted: tier,
      status: "completed",
    });

    if (transactionError) {
      throw new Error(`Failed to record transaction for ${session.id}: ${transactionError.message}`);
    }
  }
}

async function handleSubscriptionDeleted(
  supabase: ServiceClient,
  subscription: Stripe.Subscription
) {
  const customerId = stripeId(subscription.customer);
  if (!customerId) {
    throw new Error(`customer.subscription.deleted ${subscription.id} missing customer`);
  }

  const { error } = await supabase
    .from("users")
    .update({ tier: "free", updated_at: new Date().toISOString() })
    .eq("stripe_customer_id", customerId);

  if (error) {
    throw new Error(`Failed to downgrade Stripe customer ${customerId}: ${error.message}`);
  }
}

async function processStripeEvent(
  supabase: ServiceClient,
  event: Stripe.Event
) {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(
        supabase,
        event.data.object as Stripe.Checkout.Session
      );
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(
        supabase,
        event.data.object as Stripe.Subscription
      );
      break;
    default:
      break;
  }
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabase = getServiceClient();

  if (!stripe || !webhookSecret || !supabase) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe-webhook] Invalid signature", error);
    return NextResponse.json({ error: "Invalid Stripe signature" }, { status: 400 });
  }

  const { error: insertError } = await supabase
    .from("processed_webhooks")
    .insert({ id: event.id });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json({ received: true, duplicate: true });
    }

    console.error("[stripe-webhook] Failed to claim event", insertError);
    return NextResponse.json({ error: "Failed to claim webhook event" }, { status: 500 });
  }

  try {
    await processStripeEvent(supabase, event);
  } catch (error) {
    await supabase.from("processed_webhooks").delete().eq("id", event.id);
    console.error("[stripe-webhook] Processing failed", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
