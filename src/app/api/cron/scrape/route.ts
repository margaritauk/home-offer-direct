/**
 * GET /api/cron/scrape
 *
 * Scheduled cron handler (triggered daily at 06:00 UTC via vercel.json).
 * Reads all active saved_searches, computes a union envelope across filters,
 * fetches Redfin CSV, upserts into `properties`, and stamps last_scraped_at.
 *
 * Requires Authorization: Bearer <CRON_SECRET> header.
 */

import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { Client } from "@upstash/qstash";

// ---------------------------------------------------------------------------
// Redfin base URL (Chicago area — same params as existing scraper)
// ---------------------------------------------------------------------------
const REDFIN_BASE_URL =
  "https://www.redfin.com/stingray/api/gis-csv?al=1&market=chicago&num_homes=350&ord=redfin-recommended-asc&page_number=1&region_id=17420&region_type=6&sf=1,2,3,5,6,10,11&status=9&v=8";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const MAX_ROWS = 100;

// ---------------------------------------------------------------------------
// Property type string -> Redfin uipt code mapping
// ---------------------------------------------------------------------------
const PROPERTY_TYPE_CODES: Record<string, number> = {
  house: 1,
  "single family": 1,
  "single-family": 1,
  condo: 2,
  townhouse: 3,
  townhome: 3,
  "multi-family": 4,
  multifamily: 4,
};

function buildRedfinUrl(params: {
  priceMin?: number;
  priceMax?: number;
  minBeds?: number;
  propertyTypes?: string[];
}): string {
  const parts: string[] = [REDFIN_BASE_URL];

  if (params.priceMin !== undefined) {
    parts.push(`min_listing_price=${params.priceMin}`);
  }
  if (params.priceMax !== undefined) {
    parts.push(`max_listing_price=${params.priceMax}`);
  }
  if (params.minBeds !== undefined) {
    parts.push(`min_beds=${params.minBeds}`);
  }

  // Build uipt codes from property_types union
  const codes = new Set<number>();
  if (params.propertyTypes && params.propertyTypes.length > 0) {
    for (const t of params.propertyTypes) {
      const code = PROPERTY_TYPE_CODES[t.toLowerCase().trim()];
      if (code !== undefined) {
        codes.add(code);
      }
    }
  }
  // If no recognisable codes (or no types), include all four main types
  const uiptStr =
    codes.size > 0
      ? Array.from(codes).sort().join(",")
      : "1,2,3,4";

  parts.push(`uipt=${uiptStr}`);

  return parts.join("&");
}

// ---------------------------------------------------------------------------
// CSV parsing (mirrors scripts/scrape-listings.ts)
// ---------------------------------------------------------------------------
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let i = 0;

  while (i <= line.length) {
    if (i === line.length) {
      fields.push("");
      break;
    }

    if (line[i] === '"') {
      i++;
      let value = "";
      while (i < line.length) {
        if (line[i] === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            value += '"';
            i += 2;
          } else {
            i++;
            break;
          }
        } else {
          value += line[i];
          i++;
        }
      }
      fields.push(value);
      if (i < line.length && line[i] === ",") i++;
    } else {
      const start = i;
      while (i < line.length && line[i] !== ",") i++;
      fields.push(line.slice(start, i));
      if (i < line.length && line[i] === ",") i++;
    }
  }

  return fields;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");

  if (lines.length === 0) {
    throw new Error("Empty CSV response");
  }

  let headerLineIndex = 0;
  if (lines[0].trim().replace(/^"|"$/g, "").toLowerCase() === "url") {
    headerLineIndex = 1;
  }

  if (headerLineIndex >= lines.length) {
    throw new Error("CSV has no header row after skipping url line");
  }

  const headers = parseCSVLine(lines[headerLineIndex]);
  const rows: Record<string, string>[] = [];

  for (let i = headerLineIndex + 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = (values[idx] ?? "").trim();
    });
    rows.push(row);
  }

  return rows;
}

function parseIntField(value: string, fallback = 0): number {
  const cleaned = value.replace(/[$,]/g, "").trim();
  const n = parseInt(cleaned, 10);
  return isNaN(n) ? fallback : n;
}

function parseFloatField(value: string, fallback = 0): number {
  const cleaned = value.replace(/[$,]/g, "").trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? fallback : n;
}

// ---------------------------------------------------------------------------
// Saved search row type
// ---------------------------------------------------------------------------
interface SavedSearch {
  id: string;
  price_min: number | null;
  price_max: number | null;
  min_beds: number | null;
  property_types: string[];
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  // 1. Auth check
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Supabase service role client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 3. Fetch all active saved searches
  const { data: searches, error: searchesError } = await supabase
    .from("saved_searches")
    .select("id, price_min, price_max, min_beds, property_types")
    .eq("is_active", true);

  if (searchesError) {
    return Response.json(
      { error: `Failed to fetch saved searches: ${searchesError.message}` },
      { status: 500 }
    );
  }

  const activeSearches = (searches ?? []) as SavedSearch[];

  // 4. Compute union envelope
  let priceMin: number | undefined;
  let priceMax: number | undefined;
  let minBeds: number | undefined;
  const allPropertyTypes: string[] = [];

  if (activeSearches.length > 0) {
    const priceMinValues = activeSearches
      .map((s) => s.price_min)
      .filter((v): v is number => v !== null);
    const priceMaxValues = activeSearches
      .map((s) => s.price_max)
      .filter((v): v is number => v !== null);
    const minBedsValues = activeSearches
      .map((s) => s.min_beds)
      .filter((v): v is number => v !== null);

    if (priceMinValues.length > 0) {
      priceMin = Math.min(...priceMinValues);
    }
    if (priceMaxValues.length > 0) {
      priceMax = Math.max(...priceMaxValues);
    }
    if (minBedsValues.length > 0) {
      minBeds = Math.min(...minBedsValues);
    }

    for (const s of activeSearches) {
      if (Array.isArray(s.property_types)) {
        allPropertyTypes.push(...s.property_types);
      }
    }
  }
  // If no active searches: fall through with all params undefined → broad scrape

  // 5. Compute envelope filters for the job payload
  const envelopeFilters = {
    priceMin,
    priceMax,
    minBeds,
    propertyTypes: allPropertyTypes.length > 0 ? allPropertyTypes : undefined,
  };

  // 6. Dispatch to QStash worker if configured; otherwise scrape inline.
  const qstashToken = process.env.QSTASH_TOKEN;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (qstashToken && appUrl) {
    const qstash = new Client({ token: qstashToken });
    await qstash.publishJSON({
      url: `${appUrl}/api/queue/scrape-worker`,
      body: envelopeFilters,
    });
    return Response.json({ queued: true, timestamp: new Date().toISOString() });
  }

  // --- Inline scrape fallback (no QStash configured) ---

  // 6a. Build Redfin URL
  const redfinUrl = buildRedfinUrl(envelopeFilters);

  // 6b. Fetch and parse CSV
  let csvText: string;
  try {
    const response = await fetch(redfinUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      return Response.json(
        { error: `Redfin CSV fetch failed: HTTP ${response.status} ${response.statusText}` },
        { status: 502 }
      );
    }

    csvText = await response.text();
  } catch (err) {
    return Response.json(
      { error: `Network error fetching Redfin CSV: ${(err as Error).message}` },
      { status: 502 }
    );
  }

  let rows: Record<string, string>[];
  try {
    rows = parseCSV(csvText);
  } catch (err) {
    return Response.json(
      { error: `CSV parse error: ${(err as Error).message}` },
      { status: 500 }
    );
  }

  // 6c. Filter and transform
  const properties = rows
    .filter((row) => {
      const state = (row["STATE OR PROVINCE"] ?? "").trim();
      const price = row["PRICE"] ?? "";
      return state === "IL" && price !== "" && parseIntField(price) > 0;
    })
    .slice(0, MAX_ROWS)
    .map((row) => ({
      address: row["ADDRESS"] ?? "",
      city: row["CITY"] ?? "",
      state: row["STATE OR PROVINCE"] ?? "",
      zip: row["ZIP OR POSTAL CODE"] ?? "",
      price: parseIntField(row["PRICE"] ?? ""),
      beds: parseFloatField(row["BEDS"] ?? ""),
      baths: parseFloatField(row["BATHS"] ?? ""),
      sqft: parseIntField(row["SQUARE FEET"] ?? "") || null,
      dom: parseIntField(row["DAYS ON MARKET"] ?? "", 0),
      agent_name: null as string | null,
      agent_email: null as string | null,
      brokerage: null as string | null,
      img: null as string | null,
    }))
    .filter((p) => p.address !== "" && p.city !== "");

  // 6d. Upsert into properties table
  const { data: upserted, error: upsertError } = await supabase
    .from("properties")
    .upsert(properties, {
      onConflict: "address,city,state",
      ignoreDuplicates: false,
    })
    .select("id");

  if (upsertError) {
    return Response.json(
      { error: `Supabase upsert error: ${upsertError.message}` },
      { status: 500 }
    );
  }

  const inserted = upserted?.length ?? properties.length;

  // 6e. Stamp last_scraped_at on all active saved_searches
  if (activeSearches.length > 0) {
    const searchIds = activeSearches.map((s) => s.id);
    const { error: updateError } = await supabase
      .from("saved_searches")
      .update({ last_scraped_at: new Date().toISOString() })
      .in("id", searchIds);

    if (updateError) {
      // Non-fatal: log but still return success with inserted count
      console.error("Failed to update last_scraped_at:", updateError.message);
    }
  }

  return Response.json({ inserted, timestamp: new Date().toISOString() });
}
