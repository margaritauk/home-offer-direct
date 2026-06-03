type AnalyticsEvent =
  | { event: "offer_builder_started"; property_id: string }
  | { event: "offer_builder_step_completed"; step: number; step_name: string }
  | { event: "offer_builder_submitted" }
  | { event: "pdf_download_clicked"; tier: string };

export function track(payload: AnalyticsEvent): void {
  // Console log in development
  if (process.env.NODE_ENV === "development") {
    console.log("[analytics]", payload);
  }

  // PostHog — only when configured and in a browser context
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    // Dynamic import to avoid loading posthog-js on the server
    import("posthog-js").then(({ default: posthog }) => {
      posthog.capture(payload.event, payload);
    }).catch(() => { /* ignore if posthog is unavailable */ });
  }
}
