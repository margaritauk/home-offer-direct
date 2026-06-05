import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { Client } from "@upstash/qstash";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { label, price_min, price_max, min_beds, property_types } = body;

  const { data, error } = await supabase
    .from("saved_searches")
    .insert({ user_id: user.id, label, price_min, price_max, min_beds, property_types })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Immediately enqueue a scrape job so the new search gets results right away.
  // Fails silently when QStash is not configured (local dev).
  const qstashToken = process.env.QSTASH_TOKEN;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (qstashToken && appUrl) {
    const qstash = new Client({ token: qstashToken });
    const workerUrl = `${appUrl}/api/queue/scrape-worker`;
    await qstash.publishJSON({
      url: workerUrl,
      body: {
        priceMin: data.price_min ?? undefined,
        priceMax: data.price_max ?? undefined,
        minBeds: data.min_beds ?? undefined,
        propertyTypes: data.property_types?.length ? data.property_types : undefined,
      },
    }).catch(err => console.error("QStash publish failed:", err));
  }

  return Response.json(data, { status: 201 });
}

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("saved_searches")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
