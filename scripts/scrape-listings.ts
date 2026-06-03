// @ts-nocheck
/**
 * Scrape Chicago, IL property listings from Redfin's CSV endpoint
 * and upsert them into the Supabase `properties` table.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/scrape-listings.ts
 */

import { createClient } from "@supabase/supabase-js";

const REDFIN_BASE_URL =
  "https://www.redfin.com/stingray/api/gis-csv?al=1&market=chicago&num_homes=350&ord=redfin-recommended-asc&page_number=1&region_id=17420&region_type=6&sf=1,2,3,5,6,10,11&status=9&v=8";

// Property type name → Redfin uipt code
const PROPERTY_TYPE_CODES: Record<string, string> = {
  "Single Family": "1",
  "Condo": "2",
  "Townhouse": "3",
  "Multi-Family": "4",
};

export interface ScrapeFilters {
  priceMin?: number;
  priceMax?: number;
  minBeds?: number;
  propertyTypes?: string[]; // "Single Family" | "Condo" | "Townhouse" | "Multi-Family"
}

function buildRedfinUrl(filters: ScrapeFilters = {}): string {
  const params = new URLSearchParams();

  // property types — default to all four if not specified
  const types =
    filters.propertyTypes && filters.propertyTypes.length > 0
      ? filters.propertyTypes
          .map((t) => PROPERTY_TYPE_CODES[t])
          .filter(Boolean)
      : ["1", "2", "3", "4"];
  params.set("uipt", types.join(","));

  if (filters.priceMin !== undefined) {
    params.set("min_listing_price", String(filters.priceMin));
  }
  if (filters.priceMax !== undefined) {
    params.set("max_listing_price", String(filters.priceMax));
  }
  if (filters.minBeds !== undefined) {
    params.set("min_beds", String(filters.minBeds));
  }

  return `${REDFIN_BASE_URL}&${params.toString()}`;
}

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const MAX_ROWS = 100;

// ---------------------------------------------------------------------------
// Simple quoted-CSV parser
// Handles fields wrapped in double-quotes (including commas and escaped ""
// inside quoted fields). Returns an array of string values for one line.
// ---------------------------------------------------------------------------
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let i = 0;

  while (i <= line.length) {
    if (i === line.length) {
      // trailing comma produced an empty field
      fields.push("");
      break;
    }

    if (line[i] === '"') {
      // Quoted field
      i++; // skip opening quote
      let value = "";
      while (i < line.length) {
        if (line[i] === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            // Escaped quote ""
            value += '"';
            i += 2;
          } else {
            i++; // skip closing quote
            break;
          }
        } else {
          value += line[i];
          i++;
        }
      }
      fields.push(value);
      // skip the comma separator (or end of string)
      if (i < line.length && line[i] === ",") i++;
    } else {
      // Unquoted field — read until comma or end
      const start = i;
      while (i < line.length && line[i] !== ",") i++;
      fields.push(line.slice(start, i));
      if (i < line.length && line[i] === ",") i++;
    }
  }

  return fields;
}

// Parse full CSV text into an array of row objects keyed by header names.
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");

  if (lines.length === 0) {
    throw new Error("Empty CSV response");
  }

  // Redfin CSV first line is literally `"url"` — skip it.
  // Second line is the header row.
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

// Strip $ signs and commas, return an integer (or fallback).
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
// Shared scraping logic — also used by the API route
// ---------------------------------------------------------------------------
export interface ScrapeResult {
  inserted: number;
  errors: string[];
}

export async function scrapeAndUpsert(
  supabaseUrl: string,
  supabaseKey: string,
  filters: ScrapeFilters = {}
): Promise<ScrapeResult> {
  const errors: string[] = [];

  const redfinUrl = buildRedfinUrl(filters);

  // Fetch CSV
  const response = await fetch(redfinUrl, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Redfin CSV fetch failed: HTTP ${response.status} ${response.statusText}`
    );
  }

  const text = await response.text();

  // Parse CSV
  let rows: Record<string, string>[];
  try {
    rows = parseCSV(text);
  } catch (err) {
    throw new Error(`CSV parse error: ${(err as Error).message}`);
  }

  // Filter and transform
  const filtered = rows
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

  // Upsert to Supabase
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("properties")
    .upsert(filtered, {
      onConflict: "address,city,state",
      ignoreDuplicates: false,
    })
    .select("id");

  if (error) {
    throw new Error(`Supabase upsert error: ${error.message}`);
  }

  const inserted = data?.length ?? filtered.length;
  return { inserted, errors };
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------
async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error(
      "Error: SUPABASE_URL environment variable is not set.\n" +
        "  Export it before running: export SUPABASE_URL=https://<project>.supabase.co"
    );
    process.exit(1);
  }

  if (!supabaseKey) {
    console.error(
      "Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set.\n" +
        "  Find it in your Supabase dashboard → Project Settings → API → service_role key."
    );
    process.exit(1);
  }

  console.log("Fetching Redfin listings for Chicago, IL...");

  const redfinUrl = buildRedfinUrl();

  let rows: Record<string, string>[];
  try {
    const response = await fetch(redfinUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} ${response.statusText}`
      );
    }

    const text = await response.text();
    rows = parseCSV(text);
  } catch (err) {
    console.error(`Error fetching/parsing Redfin CSV: ${(err as Error).message}`);
    process.exit(1);
  }

  const filtered = rows
    .filter((row) => {
      const state = (row["STATE OR PROVINCE"] ?? "").trim();
      const price = row["PRICE"] ?? "";
      return state === "IL" && price !== "" && parseIntField(price) > 0;
    })
    .slice(0, MAX_ROWS);

  console.log(`Parsed ${filtered.length} rows`);

  const properties = filtered
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

  console.log("Upserting to Supabase...");

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("properties")
    .upsert(properties, {
      onConflict: "address,city,state",
      ignoreDuplicates: false,
    })
    .select("id");

  if (error) {
    console.error(`Supabase upsert error: ${error.message}`);
    process.exit(1);
  }

  const count = data?.length ?? properties.length;
  console.log(`Done. Inserted/updated ${count} properties.`);
}

// Only run when executed directly as a script (not when imported as a module).
// tsx sets process.argv[1] to the script path.
const _isMain =
  typeof process !== "undefined" &&
  process.argv[1] != null &&
  (process.argv[1].endsWith("scrape-listings.ts") ||
    process.argv[1].endsWith("scrape-listings.js"));

if (_isMain) {
  main();
}
