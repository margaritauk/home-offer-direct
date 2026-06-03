export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createElement } from "react";
import { OfferSummaryPdf } from "@/components/pdf/OfferSummaryPdf";
import type { OfferRow, PropertyRow } from "@/components/pdf/OfferSummaryPdf";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  /* ── Fetch offer (RLS ensures user can only see their own rows) ── */
  const { data: offerData, error: offerError } = await supabase
    .from("offers")
    .select("*")
    .eq("id", id)
    .single();

  if (offerError || !offerData) {
    return new Response(JSON.stringify({ error: "Offer not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const offer = offerData as OfferRow;

  /* ── Fetch property row (for beds/baths/sqft) if property_id is set ── */
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

  /* ── Render PDF ── */
  // Cast needed: createElement returns FunctionComponentElement but renderToBuffer
  // expects ReactElement<DocumentProps>. The runtime shape is compatible.
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
  const { renderToBuffer } = require("@react-pdf/renderer") as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = createElement(OfferSummaryPdf, { offer, property }) as any;
  const pdfBuffer: Buffer = await renderToBuffer(element);

  /* ── Upload to Supabase Storage ── */
  const storagePath = `offer-pdfs/${user.id}/${id}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (!uploadError) {
    /* ── Persist pdf_url back to the offers row ── */
    const { data: urlData } = supabase.storage
      .from("documents")
      .getPublicUrl(storagePath);

    if (urlData?.publicUrl) {
      await supabase
        .from("offers")
        .update({ pdf_url: urlData.publicUrl })
        .eq("id", id);
    }
  }
  // Non-fatal: return PDF even if storage upload fails

  /* ── Stream PDF to client ── */
  return new Response(pdfBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="offer-summary.pdf"`,
      "Content-Length": String(pdfBuffer.length),
    },
  });
}
