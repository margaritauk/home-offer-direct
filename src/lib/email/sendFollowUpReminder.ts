import { createHash } from "crypto";
import { Resend } from "resend";

export interface OfferForFollowUp {
  id: string;
  offer_price: number | null;
  address: string | null;
  property_address?: string | null;
  terms: Record<string, unknown> | null;
}

const fmt = (n: number) => "$" + n.toLocaleString();

/**
 * Generates a short HMAC-style token for the mark-followed-up link.
 * Token = first 16 hex chars of sha256(offerId + CRON_SECRET).
 */
export function generateFollowUpToken(offerId: string): string {
  const secret = process.env.CRON_SECRET ?? "";
  return createHash("sha256")
    .update(offerId + secret)
    .digest("hex")
    .slice(0, 16);
}

export async function sendFollowUpReminder(
  offer: OfferForFollowUp,
  userEmail: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "[email] RESEND_API_KEY is not set — skipping follow-up reminder email to",
      userEmail
    );
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from =
    process.env.RESEND_FROM_EMAIL ?? "offers@homeofferdirect.com";

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://homeofferdirect.com";

  const terms = (offer.terms ?? {}) as Record<string, unknown>;
  const address =
    offer.property_address ?? offer.address ?? "the property";
  const offerPrice = offer.offer_price ?? 0;

  const agentName =
    typeof terms.agentName === "string" ? terms.agentName : null;
  const agentEmail =
    typeof terms.agentEmail === "string" ? terms.agentEmail : null;
  const agentPhone =
    typeof terms.agentPhone === "string" ? terms.agentPhone : null;

  const token = generateFollowUpToken(offer.id);
  const markFollowedUpUrl = `${appUrl}/api/offers/${offer.id}/mark-followed-up?token=${token}`;
  const dashboardUrl = `${appUrl}/dashboard`;

  const agentSection =
    agentName || agentEmail || agentPhone
      ? `
        <!-- Agent contact info -->
        <div style="background: #f0f9ff; border: 1.5px solid #bae6fd; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px;">
          <p style="font-size: 13px; font-weight: 700; color: #0369a1; margin: 0 0 8px;">Listing agent contact</p>
          ${agentName ? `<p style="font-size: 14px; color: #0f172a; margin: 0 0 4px;"><strong>${agentName}</strong></p>` : ""}
          ${agentEmail ? `<p style="font-size: 13px; color: #0369a1; margin: 0 0 4px;"><a href="mailto:${agentEmail}" style="color: #0369a1;">${agentEmail}</a></p>` : ""}
          ${agentPhone ? `<p style="font-size: 13px; color: #0369a1; margin: 0;">${agentPhone}</p>` : ""}
        </div>`
      : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Have you heard back on your offer?</title>
</head>
<body style="margin: 0; padding: 0; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width: 560px; margin: 40px auto; padding: 0 16px 40px;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
        <div style="width: 32px; height: 32px; border-radius: 8px; background: #2563eb; display: inline-block;"></div>
        <span style="font-size: 18px; font-weight: 700; color: #0f172a;">HomeOffer<span style="color: #2563eb;">Direct</span></span>
      </div>
    </div>

    <!-- Card -->
    <div style="background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">

      <!-- Top accent bar -->
      <div style="height: 4px; background: linear-gradient(90deg, #f59e0b, #ef4444);"></div>

      <!-- Body -->
      <div style="padding: 32px 32px 24px;">
        <div style="font-size: 28px; margin-bottom: 12px;">⏰</div>
        <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">
          Have you heard back on your offer?
        </h1>
        <p style="font-size: 15px; color: #64748b; line-height: 1.6; margin: 0 0 24px;">
          It's been 48 hours since you submitted your offer on
          <strong style="color: #0f172a;">${address}</strong>.
          Now is a great time to follow up with the listing agent to check on the status.
        </p>

        <!-- Offer price highlight -->
        <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px; text-align: center;">
          <p style="font-size: 13px; color: #2563eb; font-weight: 600; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.05em;">Your offer</p>
          <p style="font-size: 36px; font-weight: 800; color: #1e40af; margin: 0;">
            ${offerPrice > 0 ? fmt(offerPrice) : "—"}
          </p>
          <p style="font-size: 13px; color: #64748b; margin: 6px 0 0;">${address}</p>
        </div>

        ${agentSection}

        <!-- Tip -->
        <div style="background: #fefce8; border: 1.5px solid #fde68a; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px;">
          <p style="font-size: 13px; font-weight: 700; color: #92400e; margin: 0 0 6px;">Pro tip</p>
          <p style="font-size: 13px; color: #78350f; line-height: 1.6; margin: 0;">
            A brief, professional check-in shows the seller you're serious. Reach out via email
            or phone to ask if they have any questions about your offer.
          </p>
        </div>

        <!-- Mark as followed up CTA -->
        <a href="${markFollowedUpUrl}"
           style="display: block; text-align: center; background: #2563eb; color: #fff; font-weight: 600; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 15px; margin-bottom: 12px;">
          Mark as followed up ✓
        </a>

        <!-- Dashboard link -->
        <a href="${dashboardUrl}"
           style="display: block; text-align: center; background: #f1f5f9; color: #475569; font-weight: 600; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-size: 14px;">
          View dashboard
        </a>
      </div>

      <!-- Footer -->
      <div style="padding: 16px 32px; border-top: 1px solid #f1f5f9; background: #f8fafc;">
        <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.6;">
          HomeOfferDirect is not a law firm and does not provide legal advice.
          We strongly recommend having a licensed real estate attorney review your offer before it is accepted.
          <a href="https://homeofferdirect.com/legal/disclaimer" style="color: #94a3b8;">Legal disclaimer</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;

  await resend.emails.send({
    from,
    to: userEmail,
    subject: `Have you heard back on your offer for ${address}?`,
    html,
  });
}
