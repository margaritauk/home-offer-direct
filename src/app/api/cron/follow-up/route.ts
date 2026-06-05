/**
 * GET /api/cron/follow-up
 *
 * Hourly cron handler (triggered via vercel.json).
 * Finds all submitted offers with no status update in 48+ hours and no
 * prior follow-up email, sends a reminder, and stamps followed_up_at.
 *
 * Requires Authorization: Bearer <CRON_SECRET> header.
 */

import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { sendFollowUpReminder } from "@/lib/email/sendFollowUpReminder";

export async function GET(request: NextRequest) {
  // 1. Auth check
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Supabase service role client (bypasses RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 3. Find submitted offers older than 48h with no follow-up sent yet
  const { data: offers, error: offersError } = await supabase
    .from("offers")
    .select(
      "id, user_id, offer_price, address, property_address, terms, updated_at"
    )
    .eq("status", "submitted")
    .lt("updated_at", new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())
    .is("followed_up_at", null);

  if (offersError) {
    return Response.json(
      { error: `Failed to fetch offers: ${offersError.message}` },
      { status: 500 }
    );
  }

  const pendingOffers = offers ?? [];

  if (pendingOffers.length === 0) {
    return Response.json({
      sent: 0,
      timestamp: new Date().toISOString(),
    });
  }

  // 4. Fetch user emails for all matching offers
  const userIds = [...new Set(pendingOffers.map((o) => o.user_id as string))];
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, email")
    .in("id", userIds);

  if (usersError) {
    return Response.json(
      { error: `Failed to fetch users: ${usersError.message}` },
      { status: 500 }
    );
  }

  const emailByUserId = new Map<string, string>(
    (users ?? []).map((u) => [u.id as string, u.email as string])
  );

  // 5. Send follow-up email for each offer and stamp followed_up_at
  let sent = 0;
  const errors: string[] = [];

  for (const offer of pendingOffers) {
    const userEmail = emailByUserId.get(offer.user_id as string);
    if (!userEmail) {
      errors.push(`No email found for user ${offer.user_id}`);
      continue;
    }

    try {
      await sendFollowUpReminder(
        {
          id: offer.id,
          offer_price: offer.offer_price,
          address: offer.address,
          property_address: offer.property_address,
          terms: offer.terms,
        },
        userEmail
      );

      // Stamp followed_up_at so we don't send again
      const { error: updateError } = await supabase
        .from("offers")
        .update({ followed_up_at: new Date().toISOString() })
        .eq("id", offer.id);

      if (updateError) {
        errors.push(
          `Failed to stamp followed_up_at for offer ${offer.id}: ${updateError.message}`
        );
      } else {
        sent++;
      }
    } catch (err) {
      errors.push(
        `Failed to send follow-up for offer ${offer.id}: ${(err as Error).message}`
      );
    }
  }

  return Response.json({
    sent,
    errors: errors.length > 0 ? errors : undefined,
    timestamp: new Date().toISOString(),
  });
}
