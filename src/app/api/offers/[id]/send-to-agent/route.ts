export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createElement } from "react";
import { Resend } from "resend";
import { OfferSummaryPdf } from "@/components/pdf/OfferSummaryPdf";
import type { OfferRow, PropertyRow } from "@/components/pdf/OfferSummaryPdf";

/* ─────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────── */
function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

function computeClosingDate(createdAt: string, closingDays: number): string {
  const base = new Date(createdAt);
  base.setDate(base.getDate() + closingDays);
  return base.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function fmtFinanceType(ft: string): string {
  switch (ft) {
    case "conventional": return "Conventional Loan";
    case "fha":          return "FHA Loan";
    case "va":           return "VA Loan";
    case "cash":         return "All Cash";
    default:             return ft;
  }
}

/* ─────────────────────────────────────────────────
   AGENT-FACING HTML EMAIL
───────────────────────────────────────────────── */
function buildAgentEmailHtml(params: {
  address: string;
  offerPrice: number;
  buyerName: string;
  buyerEmail: string;
  agentName: string | null;
  terms: Record<string, unknown>;
  createdAt: string;
}): string {
  const { address, offerPrice, buyerName, buyerEmail, agentName, terms, createdAt } = params;

  const isCash = terms.financeType === "cash";
  const financeLabel = typeof terms.financeType === "string" ? fmtFinanceType(terms.financeType) : "—";
  const closingDays = typeof terms.closingDays === "number" ? terms.closingDays : 0;
  const closingDate = closingDays > 0 ? computeClosingDate(createdAt, closingDays) : "TBD";
  const hasInspection = terms.inspectionContingency === true;
  const hasAppraisal = terms.appraisalContingency === true;
  const hasFinancing = !isCash && terms.financingContingency === true;
  const sellerCredits = typeof terms.sellerCredits === "number" && terms.sellerCredits > 0
    ? fmt(terms.sellerCredits)
    : "None";
  const earnestPct = typeof terms.earnestPct === "number" ? terms.earnestPct : 0;
  const earnestAmt = offerPrice > 0 && earnestPct > 0
    ? Math.round(offerPrice * earnestPct / 100)
    : 0;

  const agentFirstName = agentName ? agentName.split(" ")[0] : "Agent";

  const termsRows = [
    `<tr>
      <td style="padding:10px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Offer price</td>
      <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;text-align:right;">${offerPrice > 0 ? fmt(offerPrice) : "—"}</td>
    </tr>`,
    `<tr>
      <td style="padding:10px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Financing type</td>
      <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;text-align:right;">${financeLabel}</td>
    </tr>`,
    earnestAmt > 0
      ? `<tr>
          <td style="padding:10px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Earnest money deposit</td>
          <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;text-align:right;">${fmt(earnestAmt)} (${earnestPct}%)</td>
        </tr>`
      : "",
    `<tr>
      <td style="padding:10px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Inspection contingency</td>
      <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;text-align:right;">${hasInspection ? `Yes (${terms.inspectionDays ?? 10} days)` : "Waived"}</td>
    </tr>`,
    `<tr>
      <td style="padding:10px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Appraisal contingency</td>
      <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;text-align:right;">${hasAppraisal ? "Yes" : "Waived"}</td>
    </tr>`,
    !isCash
      ? `<tr>
          <td style="padding:10px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Financing contingency</td>
          <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;text-align:right;">${hasFinancing ? `Yes (${terms.financingDays ?? 21} days)` : "Waived"}</td>
        </tr>`
      : "",
    `<tr>
      <td style="padding:10px 16px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;">Seller credits</td>
      <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;text-align:right;">${sellerCredits}</td>
    </tr>`,
    `<tr>
      <td style="padding:10px 16px;font-size:13px;color:#64748b;">Target closing date</td>
      <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#0f172a;text-align:right;">${closingDate}</td>
    </tr>`,
  ]
    .filter(Boolean)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Offer received: ${address}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:40px auto;padding:0 16px 40px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:8px;">
        <div style="width:32px;height:32px;border-radius:8px;background:#2563eb;display:inline-block;"></div>
        <span style="font-size:18px;font-weight:700;color:#0f172a;">HomeOffer<span style="color:#2563eb;">Direct</span></span>
      </div>
    </div>

    <!-- Card -->
    <div style="background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">

      <!-- Accent bar -->
      <div style="height:4px;background:linear-gradient(90deg,#2563eb,#7c3aed);"></div>

      <!-- Body -->
      <div style="padding:32px 32px 24px;">
        <h1 style="font-size:22px;font-weight:700;color:#0f172a;margin:0 0 8px;">
          You received an offer
        </h1>
        <p style="font-size:15px;color:#64748b;line-height:1.6;margin:0 0 6px;">
          Hi ${agentFirstName},
        </p>
        <p style="font-size:15px;color:#64748b;line-height:1.6;margin:0 0 24px;">
          A buyer has submitted a purchase offer for <strong style="color:#0f172a;">${address}</strong> via HomeOfferDirect.
          The full offer package is attached as a PDF to this email.
        </p>

        <!-- Offer price highlight -->
        <div style="background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:12px;padding:20px 24px;margin-bottom:24px;text-align:center;">
          <p style="font-size:13px;color:#2563eb;font-weight:600;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.05em;">
            ${isCash ? "All-Cash Offer" : "Offer Price"}
          </p>
          <p style="font-size:36px;font-weight:800;color:#1e40af;margin:0;">
            ${offerPrice > 0 ? fmt(offerPrice) : "—"}
          </p>
          ${isCash ? '<p style="font-size:12px;color:#2563eb;margin:4px 0 0;font-weight:500;">No financing contingency</p>' : ""}
        </div>

        <!-- Key terms table -->
        <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;text-align:left;border-bottom:1px solid #e2e8f0;">Term</th>
              <th style="padding:10px 16px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;text-align:right;border-bottom:1px solid #e2e8f0;">Detail</th>
            </tr>
          </thead>
          <tbody>
            ${termsRows}
          </tbody>
        </table>

        <!-- Buyer contact -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
          <p style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 10px;">Buyer Contact</p>
          <p style="font-size:14px;color:#0f172a;margin:0 0 4px;font-weight:600;">${buyerName}</p>
          <a href="mailto:${buyerEmail}" style="font-size:13px;color:#2563eb;text-decoration:none;">${buyerEmail}</a>
        </div>

        <p style="font-size:13px;color:#64748b;line-height:1.6;margin:0;">
          The complete offer package — including all contingency addenda, earnest money terms, and the buyer&apos;s electronic signature — is attached to this email as <strong>offer-summary.pdf</strong>.
        </p>
      </div>

      <!-- Footer -->
      <div style="padding:16px 32px;border-top:1px solid #f1f5f9;background:#f8fafc;">
        <p style="font-size:12px;color:#94a3b8;margin:0;line-height:1.6;">
          This offer was generated via <strong>HomeOfferDirect</strong>. HomeOfferDirect is not a law firm and does not provide legal advice.
          Parties are encouraged to consult a licensed real estate attorney before accepting or countering.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/* ─────────────────────────────────────────────────
   POST /api/offers/[id]/send-to-agent
───────────────────────────────────────────────── */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  /* ── Check Resend config early ── */
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 }
    );
  }

  /* ── Auth ── */
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* ── Fetch offer (RLS enforces ownership) ── */
  const { data: offerData, error: fetchError } = await supabase
    .from("offers")
    .select("id, user_id, offer_price, address, property_address, terms, status, pdf_url, created_at, sent_to_agent_at")
    .eq("id", id)
    .single();

  if (fetchError || !offerData) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  }

  const offer = offerData as OfferRow & { status: string; pdf_url?: string | null; created_at: string; sent_to_agent_at?: string | null };
  const terms = (offer.terms ?? {}) as Record<string, unknown>;

  /* ── Validate: must be submitted and signed ── */
  if (offer.status !== "submitted") {
    return NextResponse.json(
      { error: "Offer must be submitted before sending to agent" },
      { status: 422 }
    );
  }

  /* ── Idempotency: don't email the agent twice (retry / double-click) ── */
  if (offer.sent_to_agent_at) {
    return NextResponse.json(
      { error: "This offer has already been sent to the agent", alreadySent: true },
      { status: 409 }
    );
  }

  if (!terms.signatureDataUrl || typeof terms.signatureDataUrl !== "string" || !terms.signatureDataUrl.trim()) {
    return NextResponse.json(
      { error: "Offer must be signed before sending to agent" },
      { status: 422 }
    );
  }

  /* ── Extract agent contact ── */
  const agentEmail = typeof terms.agentEmail === "string" ? terms.agentEmail.trim() : "";
  const agentName  = typeof terms.agentName  === "string" ? terms.agentName.trim()  : null;

  if (!agentEmail) {
    return NextResponse.json(
      { error: "Add the listing agent's email in your offer to send directly" },
      { status: 422 }
    );
  }

  /* ── Validate the agent email format before handing it to the provider ── */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_RE.test(agentEmail)) {
    return NextResponse.json(
      { error: "The listing agent's email address doesn't look valid — please correct it in your offer" },
      { status: 422 }
    );
  }

  /* ── Get buyer display name ── */
  const buyerName =
    (typeof terms.buyerName === "string" && terms.buyerName.trim())
      ? terms.buyerName.trim()
      : (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "Buyer";
  const buyerEmail = user.email ?? "";

  /* ── Resolve offer address ── */
  const address = offer.property_address ?? offer.address ?? "the property";
  const offerPrice = offer.offer_price ?? 0;

  /* ── Fetch or render PDF (any render failure → clean 500, not an unhandled crash) ── */
  let pdfBuffer: Buffer;

  try {
    if (offer.pdf_url) {
      /* Try to download existing PDF from Storage */
      try {
        const serviceClient = createServiceClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        /* Extract storage path from the public URL */
        const urlObj = new URL(offer.pdf_url);
        // Public URL format: .../storage/v1/object/public/<bucket>/<path>
        const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
        if (pathMatch) {
          const bucket = pathMatch[1];
          const storagePath = pathMatch[2];
          const { data: fileData, error: downloadError } = await serviceClient.storage
            .from(bucket)
            .download(storagePath);

          if (!downloadError && fileData) {
            const arrayBuf = await fileData.arrayBuffer();
            pdfBuffer = Buffer.from(arrayBuf);
          } else {
            throw new Error("Storage download failed");
          }
        } else {
          throw new Error("Could not parse storage path from pdf_url");
        }
      } catch {
        /* Fall through to inline render */
        pdfBuffer = await renderPdfInline(offer as OfferRow, supabase);
      }
    } else {
      /* No cached PDF — render inline */
      pdfBuffer = await renderPdfInline(offer as OfferRow, supabase);
    }
  } catch (err) {
    console.error("[send-to-agent] PDF generation failed:", err);
    return NextResponse.json(
      { error: "Could not generate the offer PDF. Please try again." },
      { status: 500 }
    );
  }

  /* ── Atomically claim the send BEFORE emailing, so a retry / double-click
        can't send twice. Only the request that flips sent_to_agent_at from
        NULL proceeds; a concurrent one gets 0 rows back and bails. ── */
  const serviceClient = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: claimed, error: claimError } = await serviceClient
    .from("offers")
    .update({ sent_to_agent_at: new Date().toISOString() })
    .eq("id", id)
    .is("sent_to_agent_at", null)
    .select("id");

  if (claimError) {
    console.error("[send-to-agent] claim error:", claimError.message);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }
  if (!claimed || claimed.length === 0) {
    return NextResponse.json(
      { error: "This offer has already been sent to the agent", alreadySent: true },
      { status: 409 }
    );
  }

  /* ── Build and send email via Resend ── */
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL ?? "offers@homeofferdirect.com";
  const subject = `Offer received: ${address} — ${offerPrice > 0 ? fmt(offerPrice) : "offer price TBD"}`;

  const html = buildAgentEmailHtml({
    address,
    offerPrice,
    buyerName,
    buyerEmail,
    agentName,
    terms,
    createdAt: offer.created_at,
  });

  const { error: sendError } = await resend.emails.send({
    from,
    to: agentEmail,
    subject,
    html,
    attachments: [
      {
        filename: "offer-summary.pdf",
        content: pdfBuffer,
      },
    ],
  });

  if (sendError) {
    console.error("[send-to-agent] Resend error", sendError);
    /* Roll back the claim so the user can retry the send. */
    await serviceClient
      .from("offers")
      .update({ sent_to_agent_at: null })
      .eq("id", id);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, sentTo: agentEmail });
}

/* ─────────────────────────────────────────────────
   INLINE PDF RENDER HELPER
───────────────────────────────────────────────── */
async function renderPdfInline(
  offer: OfferRow,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
): Promise<Buffer> {
  /* Fetch property row if property_id is set */
  let property: PropertyRow | null = null;
  if (offer.property_id) {
    const { data: propData } = await supabase
      .from("properties")
      .select("id, address, city, state, zip, price, beds, baths, sqft, dom, agent_name, agent_email, brokerage")
      .eq("id", offer.property_id)
      .single();
    if (propData) {
      property = propData as PropertyRow;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
  const { renderToBuffer } = require("@react-pdf/renderer") as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = createElement(OfferSummaryPdf, { offer, property, isVerified: false }) as any;
  return await renderToBuffer(element);
}
