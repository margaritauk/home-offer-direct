export const runtime = "nodejs";

const CACHE: Map<string, { buf: ArrayBuffer; ct: string; ts: number }> = new Map();
const TTL = 24 * 60 * 60 * 1000; // 24 h in-process cache

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") ?? "10";
  const w = url.searchParams.get("w") ?? "600";
  const h = url.searchParams.get("h") ?? "400";
  if (!/^\d+$/.test(id) || !/^\d+$/.test(w) || !/^\d+$/.test(h)) {
    return new Response("Bad params", { status: 400 });
  }

  const cacheKey = `${id}-${w}-${h}`;
  const cached = CACHE.get(cacheKey);
  if (cached && Date.now() - cached.ts < TTL) {
    return new Response(cached.buf, {
      headers: { "Content-Type": cached.ct, "Cache-Control": "public, max-age=86400" },
    });
  }

  const upstream = await fetch(`https://picsum.photos/id/${id}/${w}/${h}`, { redirect: "follow" });
  if (!upstream.ok) return new Response("Not found", { status: 404 });

  const buf = await upstream.arrayBuffer();
  const ct = upstream.headers.get("Content-Type") ?? "image/jpeg";
  CACHE.set(cacheKey, { buf, ct, ts: Date.now() });

  return new Response(buf, {
    headers: { "Content-Type": ct, "Cache-Control": "public, max-age=86400" },
  });
}
