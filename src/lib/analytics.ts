type AnalyticsEvent =
  | { event: "offer_builder_started"; property_id: string }
  | { event: "offer_builder_step_completed"; step: number; step_name: string }
  | { event: "offer_builder_submitted" }
  | { event: "pdf_download_clicked"; tier: string };

export function track(payload: AnalyticsEvent): void {
  // Store in sessionStorage for debugging
  try {
    const key = "hod_analytics";
    const existing = JSON.parse(sessionStorage.getItem(key) ?? "[]");
    existing.push({ ...payload, ts: Date.now() });
    sessionStorage.setItem(key, JSON.stringify(existing.slice(-50)));
  } catch {}

  // Console log in development
  if (process.env.NODE_ENV === "development") {
    console.log("[analytics]", payload);
  }

  // PostHog / analytics provider hook (configure via NEXT_PUBLIC_ANALYTICS_KEY env var)
  // When ready: posthog.capture(payload.event, payload)
}
