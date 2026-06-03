/**
 * POST /api/admin/scrape
 *
 * Admin-only endpoint (no auth) that triggers a Redfin CSV scrape and upserts
 * the results into the Supabase `properties` table.
 *
 * Accepts an optional JSON body with filter parameters:
 *   { priceMin, priceMax, minBeds, propertyTypes }
 *
 * Usage:
 *   curl -X POST http://localhost:3000/api/admin/scrape
 *   curl -X POST http://localhost:3000/api/admin/scrape \
 *     -H "Content-Type: application/json" \
 *     -d '{"priceMin":300000,"priceMax":600000,"minBeds":2,"propertyTypes":["Single Family","Condo"]}'
 */

import { scrapeAndUpsert } from "../../../../../scripts/scrape-listings";

export async function POST(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return Response.json(
      {
        error:
          "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables.",
      },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const { priceMin, priceMax, minBeds, propertyTypes } = body as {
    priceMin?: number;
    priceMax?: number;
    minBeds?: number;
    propertyTypes?: string[];
  };

  try {
    const result = await scrapeAndUpsert(supabaseUrl, supabaseKey, {
      priceMin,
      priceMax,
      minBeds,
      propertyTypes,
    });
    return Response.json(result);
  } catch (err) {
    return Response.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
