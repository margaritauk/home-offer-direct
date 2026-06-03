import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendOfferConfirmation } from "@/lib/email/sendOfferConfirmation";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing offer ID" }, { status: 400 });
  }

  const supabase = await createClient();

  // Verify the calling user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch the offer — restrict to this user to verify ownership
  const { data: offer, error: fetchError } = await supabase
    .from("offers")
    .select("id, user_id, offer_price, address, property_address, terms, created_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !offer) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  }

  // Update status to submitted
  const { error: updateError } = await supabase
    .from("offers")
    .update({ status: "submitted", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (updateError) {
    console.error("[submit] Failed to update offer status", updateError);
    return NextResponse.json({ error: "Failed to submit offer" }, { status: 500 });
  }

  // Send confirmation email — failure here must not fail the response
  try {
    await sendOfferConfirmation(offer, user.email!);
  } catch (emailErr) {
    console.error("[submit] Offer confirmation email failed", emailErr);
  }

  return NextResponse.json({ success: true });
}
