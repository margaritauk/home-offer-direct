/**
 * POST /api/admin/scrape
 *
 * Admin-only endpoint (no auth) that triggers a Redfin CSV scrape and upserts
 * the results into the Supabase `properties` table.
 *
 * Usage:
 *   curl -X POST http://localhost:3000/api/admin/scrape
 */

import { createClient } from "@supabase/supabase-js";

const REDFIN_CSV_URL =
  "https://www.redfin.com/stingray/api/gis-csv?al=1&market=chicago&num_homes=350&ord=redfin-recommended-asc&page_number=1&region_id=17420&region_type=6&sf=1,2,3,5,6,10,11&status=9&uipt=1,2,3,4,5,6,7,8&v=8";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const MAX_ROWS = 100;

// ---------------------------------------------------------------------------
// Simple quoted-CSV parser
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
// Route handler
// ---------------------------------------------------------------------------
export async function POST() {
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

  // Fetch CSV from Redfin
  let csvText: string;
  try {
    const response = await fetch(REDFIN_CSV_URL, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      return Response.json(
        {
          error: `Redfin CSV fetch failed: HTTP ${response.status} ${response.statusText}`,
        },
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

  // Parse CSV
  let rows: Record<string, string>[];
  try {
    rows = parseCSV(csvText);
  } catch (err) {
    return Response.json(
      { error: `CSV parse error: ${(err as Error).message}` },
      { status: 500 }
    );
  }

  // Filter and transform
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

  // Upsert to Supabase using service role key (bypasses RLS)
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("properties")
    .upsert(properties, {
      onConflict: "address,city,state",
      ignoreDuplicates: false,
    })
    .select("id");

  if (error) {
    return Response.json(
      { error: `Supabase upsert error: ${error.message}` },
      { status: 500 }
    );
  }

  const inserted = data?.length ?? properties.length;
  return Response.json({ inserted, errors: [] });
}
