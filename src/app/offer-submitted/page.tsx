"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, FileText, Mail, BarChart2, LayoutDashboard } from "lucide-react";
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

const NEXT_STEPS: NextStep[] = [
  {
    icon: FileText,
    title: "Download your offer PDF",
    description: "Get a professionally formatted PDF of your complete offer package.",
    href: (offerId) => offerId ? `/api/offers/${offerId}/pdf` : "/dashboard",
    label: "Download PDF",
    download: true,
  },
  {
    icon: Mail,
    title: "Email offer to listing agent",
    description: "Send your offer directly to the listing agent with read receipt tracking.",
    href: () => "/dashboard",
    label: "Go to dashboard",
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
   INNER (reads search params)
───────────────────────────────────────────────── */
function OfferSubmittedInner() {
  const searchParams = useSearchParams();
  const offerId = searchParams.get("offerId");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-2xl">
          {/* Success card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col items-center text-center px-8 pt-12 pb-8 border-b border-slate-100">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={1.75} />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3">
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
            <div className="px-8 py-8">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-5">
                Next steps
              </h2>
              <div className="space-y-3">
                {NEXT_STEPS.map((step) => {
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
            <div className="px-8 pb-10 flex justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-200 transition-all"
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
