export const runtime = "nodejs";

const CACHE: Map<string, { buf: ArrayBuffer; ct: string; ts: number }> = new Map();
const TTL = 24 * 60 * 60 * 1000; // 24 h in-process cache

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") ?? "10";
  if (!/^\d+$/.test(id)) return new Response("Bad id", { status: 400 });

  const cached = CACHE.get(id);
  if (cached && Date.now() - cached.ts < TTL) {
    return new Response(cached.buf, {
      headers: { "Content-Type": cached.ct, "Cache-Control": "public, max-age=86400" },
    });
  }

  const upstream = await fetch(`https://picsum.photos/id/${id}/600/400`, { redirect: "follow" });
  if (!upstream.ok) return new Response("Not found", { status: 404 });

  const buf = await upstream.arrayBuffer();
  const ct = upstream.headers.get("Content-Type") ?? "image/jpeg";
  CACHE.set(id, { buf, ct, ts: Date.now() });

  return new Response(buf, {
    headers: { "Content-Type": ct, "Cache-Control": "public, max-age=86400" },
  });
}
