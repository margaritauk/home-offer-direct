"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { CheckCircle, FileText, Mail, BarChart2, LayoutDashboard, Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* ─────────────────────────────────────────────────
   NEXT STEP CARDS
───────────────────────────────────────────────── */
type NextStep = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: (offerId: string | null) => string;
  label: string;
  download?: boolean;
};

const NEXT_STEPS_STATIC: NextStep[] = [
  {
    icon: FileText,
    title: "Download your offer PDF",
    description: "Get a professionally formatted PDF of your complete offer package.",
    href: (offerId) => offerId ? `/api/offers/${offerId}/pdf` : "/dashboard",
    label: "Download PDF",
    download: true,
  },
  {
    icon: BarChart2,
    title: "Track your offer",
    description: "Monitor the status of your offer and receive updates in real time.",
    href: () => "/dashboard",
    label: "Go to dashboard",
  },
];

/* ─────────────────────────────────────────────────
   SEND-TO-AGENT CARD STATE
───────────────────────────────────────────────── */
type SendState =
  | { type: "idle" }
  | { type: "sending" }
  | { type: "success"; sentTo: string; sentAt: string }
  | { type: "no_agent_email" }
  | { type: "error"; message: string };

/* ─────────────────────────────────────────────────
   INNER (reads search params)
───────────────────────────────────────────────── */
function OfferSubmittedInner() {
  const searchParams = useSearchParams();
  const offerId = searchParams.get("offerId");

  const [sendState, setSendState] = useState<SendState>({ type: "idle" });

  async function handleSendToAgent() {
    if (!offerId) return;
    setSendState({ type: "sending" });

    try {
      const res = await fetch(`/api/offers/${offerId}/send-to-agent`, {
        method: "POST",
      });

      if (res.status === 422) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        const msg = body.error ?? "";
        if (msg.toLowerCase().includes("agent") && msg.toLowerCase().includes("email")) {
          setSendState({ type: "no_agent_email" });
        } else {
          setSendState({ type: "error", message: msg || "Validation error." });
        }
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        setSendState({ type: "error", message: body.error ?? "Failed to send. Please try again." });
        return;
      }

      const data = await res.json() as { success: boolean; sentTo: string };
      setSendState({ type: "success", sentTo: data.sentTo, sentAt: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) });
    } catch {
      setSendState({ type: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-2xl">
          {/* Success card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col items-center text-center px-5 sm:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8 border-b border-slate-100">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={1.75} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                Your offer is submitted!
              </h1>
              <p className="text-base text-slate-500 leading-relaxed max-w-md">
                Your offer has been saved and is ready to send to the listing agent.
              </p>
              {offerId && (
                <p className="mt-3 text-xs text-slate-400 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  Offer ID: {offerId}
                </p>
              )}
            </div>

            {/* Next steps */}
            <div className="px-4 sm:px-8 py-6 sm:py-8">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-5">
                Next steps
              </h2>
              <div className="space-y-3">
                {/* ── Email offer to listing agent — interactive card ── */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 mb-0.5">
                      Email offer to listing agent
                    </p>
                    {sendState.type === "idle" && (
                      <>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">
                          Send your offer directly to the listing agent with your signed PDF attached.
                        </p>
                        <button
                          onClick={handleSendToAgent}
                          disabled={!offerId}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Send to agent
                        </button>
                      </>
                    )}

                    {sendState.type === "sending" && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Sending offer to agent…
                      </div>
                    )}

                    {sendState.type === "success" && (
                      <div className="flex items-start gap-2 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-green-700">
                            Sent to {sendState.sentTo}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Delivered at {sendState.sentAt} · PDF attached
                          </p>
                        </div>
                      </div>
                    )}

                    {sendState.type === "no_agent_email" && (
                      <div className="flex items-start gap-2 mt-1">
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-amber-700 leading-relaxed">
                            Add the listing agent&apos;s email in your offer to send directly.
                          </p>
                          {offerId && (
                            <Link
                              href={`/offer-builder?id=${offerId}&step=15`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline mt-1"
                            >
                              Update offer &rarr;
                            </Link>
                          )}
                        </div>
                      </div>
                    )}

                    {sendState.type === "error" && (
                      <div className="flex items-start gap-2 mt-1">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-red-600 leading-relaxed">
                            {sendState.message}
                          </p>
                          <button
                            onClick={handleSendToAgent}
                            className="text-xs font-semibold text-blue-600 hover:underline mt-1"
                          >
                            Try again
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Static next-step cards ── */}
                {NEXT_STEPS_STATIC.map((step) => {
                  const Icon = step.icon;
                  const href = step.href(offerId);
                  return (
                    <Link
                      key={step.title}
                      href={href}
                      {...(step.download ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                        <Icon className="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 mb-0.5">
                          {step.title}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-blue-600 self-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {step.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Primary CTA */}
            <div className="px-4 sm:px-8 pb-8 sm:pb-10 flex justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-200 transition-all w-full sm:w-auto justify-center"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to dashboard
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="mt-6 text-center text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
            HomeOfferDirect is not a law firm. We strongly recommend having a licensed real estate attorney review your offer before submitting to the listing agent.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────────
   PAGE EXPORT
───────────────────────────────────────────────── */
export default function OfferSubmittedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-sm text-slate-400">Loading...</div>
      </div>
    }>
      <OfferSubmittedInner />
    </Suspense>
  );
}
