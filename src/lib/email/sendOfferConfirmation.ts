import { Resend } from "resend";

export interface OfferForEmail {
  id: string;
  user_id: string;
  offer_price: number | null;
  address: string | null;
  property_address?: string | null;
  terms: Record<string, unknown> | null;
  created_at: string;
}

const fmt = (n: number) => "$" + n.toLocaleString();

function computeClosingDate(createdAt: string, closingDays: number): string {
  const base = new Date(createdAt);
  base.setDate(base.getDate() + closingDays);
  return base.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function sendOfferConfirmation(
  offer: OfferForEmail,
  userEmail: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "[email] RESEND_API_KEY is not set — skipping offer confirmation email to",
      userEmail
    );
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from =
    process.env.RESEND_FROM_EMAIL ?? "offers@homeofferdirect.com";

  const terms = (offer.terms ?? {}) as Record<string, unknown>;
  const address = offer.property_address ?? offer.address ?? "the property";
  const offerPrice = offer.offer_price ?? 0;
  const isCash = terms.financeType === "cash";
  const closingDays = typeof terms.closingDays === "number" ? terms.closingDays : 0;
  const closingDate = closingDays > 0 ? computeClosingDate(offer.created_at, closingDays) : "TBD";
  const hasInspection = terms.inspectionContingency === true;
  const hasFinancing = !isCash && terms.financingContingency === true;
  const sellerCredits = typeof terms.sellerCredits === "number" ? terms.sellerCredits : -1;
  const sellerCreditsDisplay = sellerCredits <= 0 ? "None" : fmt(sellerCredits);

  const dashboardUrl = "https://homeofferdirect.com/dashboard";

  const contingencyRows = [
    `<tr>
      <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Inspection contingency</td>
      <td style="padding: 10px 16px; font-size: 13px; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9; text-align: right;">${hasInspection ? `Yes (${terms.inspectionDays ?? 10} days)` : "Waived"}</td>
    </tr>`,
    isCash
      ? ""
      : `<tr>
      <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Financing contingency</td>
      <td style="padding: 10px 16px; font-size: 13px; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9; text-align: right;">${hasFinancing ? "Yes" : "Waived"}</td>
    </tr>`,
    `<tr>
      <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Seller credits</td>
      <td style="padding: 10px 16px; font-size: 13px; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9; text-align: right;">${sellerCreditsDisplay}</td>
    </tr>`,
    `<tr>
      <td style="padding: 10px 16px; font-size: 13px; color: #64748b;">Estimated closing date</td>
      <td style="padding: 10px 16px; font-size: 13px; font-weight: 600; color: #0f172a; text-align: right;">${closingDate}</td>
    </tr>`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your offer has been submitted</title>
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
      <div style="height: 4px; background: linear-gradient(90deg, #2563eb, #7c3aed);"></div>

      <!-- Body -->
      <div style="padding: 32px 32px 24px;">
        <div style="font-size: 28px; margin-bottom: 12px;">🎉</div>
        <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">
          Your offer has been submitted
        </h1>
        <p style="font-size: 15px; color: #64748b; line-height: 1.6; margin: 0 0 24px;">
          Your offer on <strong style="color: #0f172a;">${address}</strong> is now in the hands of the listing side.
          Here's a summary of what you submitted.
        </p>

        <!-- Offer price highlight -->
        <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px; text-align: center;">
          <p style="font-size: 13px; color: #2563eb; font-weight: 600; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.05em;">
            ${isCash ? "All-Cash Offer" : "Offer Price"}
          </p>
          <p style="font-size: 36px; font-weight: 800; color: #1e40af; margin: 0;">
            ${offerPrice > 0 ? fmt(offerPrice) : "—"}
          </p>
          ${isCash ? '<p style="font-size: 12px; color: #2563eb; margin: 4px 0 0; font-weight: 500;">No financing contingency</p>' : ""}
        </div>

        <!-- Summary table -->
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 24px;">
          <thead>
            <tr style="background: #f8fafc;">
              <th style="padding: 10px 16px; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; text-align: left; border-bottom: 1px solid #e2e8f0;">Term</th>
              <th style="padding: 10px 16px; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; text-align: right; border-bottom: 1px solid #e2e8f0;">Detail</th>
            </tr>
          </thead>
          <tbody>
            ${contingencyRows}
          </tbody>
        </table>

        <!-- Next steps -->
        <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px;">
          <p style="font-size: 13px; font-weight: 700; color: #065f46; margin: 0 0 6px;">What happens next?</p>
          <p style="font-size: 13px; color: #065f46; line-height: 1.6; margin: 0;">
            We'll notify you as soon as the seller responds — typically within 24–72 hours.
            In the meantime, you can track your offer status on your dashboard.
          </p>
        </div>

        <!-- CTA -->
        <a href="${dashboardUrl}"
           style="display: block; text-align: center; background: #2563eb; color: #fff; font-weight: 600; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 15px;">
          View offer on dashboard →
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
    subject: `Your offer on ${address} has been submitted`,
    html,
  });
}
