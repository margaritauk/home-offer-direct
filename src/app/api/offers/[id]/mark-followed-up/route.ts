/**
 * GET /api/offers/[id]/mark-followed-up?token=<token>
 *
 * One-click link from the follow-up reminder email.
 * Validates the HMAC-style token, marks the offer as followed up,
 * and redirects to /dashboard?followed_up=1.
 *
 * Token = first 16 hex chars of sha256(offerId + CRON_SECRET).
 */

import { timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { generateFollowUpToken } from "@/lib/email/sendFollowUpReminder";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://homeofferdirect.com";

  if (!id || !token) {
    return NextResponse.redirect(`${appUrl}/dashboard?error=invalid_link`);
  }

  // Validate token using timing-safe comparison
  const expected = generateFollowUpToken(id, secret);
  const tokenBuf = Buffer.from(token);
  const expectedBuf = Buffer.from(expected);
  if (tokenBuf.length !== expectedBuf.length || !timingSafeEqual(tokenBuf, expectedBuf)) {
    return NextResponse.redirect(`${appUrl}/dashboard?error=invalid_token`);
  }

  // Use service role client to update offer without RLS restrictions
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from("offers")
    .update({
      followed_up_at: new Date().toISOString(),
      status: "pending_response",
    })
    .eq("id", id)
    .in("status", ["submitted"]);

  if (error) {
    console.error("[mark-followed-up] DB update error:", error.message);
    // Still redirect — don't expose internal errors to the browser
  }

  return NextResponse.redirect(`${appUrl}/dashboard?followed_up=1`);
}
