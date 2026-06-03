/**
 * POST /api/queue/scrape-worker
 *
 * QStash worker endpoint — QStash delivers jobs by POSTing here.
 * Verifies the QStash signature, parses the message body as ScrapeFilters,
 * then calls scrapeAndUpsert to fetch Redfin listings and upsert to Supabase.
 *
 * Required environment variables:
 *   QSTASH_TOKEN=                  # from Upstash QStash dashboard
 *   QSTASH_CURRENT_SIGNING_KEY=    # from Upstash QStash dashboard
 *   QSTASH_NEXT_SIGNING_KEY=       # from Upstash QStash dashboard
 *   NEXT_PUBLIC_APP_URL=           # e.g. https://your-app.vercel.app
 */

import { Receiver } from "@upstash/qstash";
import { scrapeAndUpsert } from "../../../../scripts/scrape-listings";
import type { ScrapeFilters } from "../../../../scripts/scrape-listings";

export async function POST(request: Request) {
  const receiver = new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
  });

  const body = await request.text();
  const signature = request.headers.get("upstash-signature") ?? "";

  const isValid = await receiver.verify({ body, signature }).catch(() => false);
  if (!isValid) return Response.json({ error: "Invalid signature" }, { status: 401 });

  try {
    const filters: ScrapeFilters = JSON.parse(body);

    const result = await scrapeAndUpsert(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      filters
    );

    return Response.json(result);
  } catch (err) {
    console.error("scrape-worker error:", err);
    return Response.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
