import Link from "next/link";
import { Search, ClipboardList, FileText, Send, ArrowRight, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Find your property",
    description:
      "Search any listing or paste a Zillow, Redfin, or Realtor.com URL. We pull price, photos, taxes, and real-time market data automatically.",
    details: ["Zillow & Redfin import", "Auto-fill property data", "AI market analysis"],
    href: "/search",
    cta: "Search listings",
  },
  {
    icon: ClipboardList,
    step: "02",
    title: "Prepare to buy",
    description:
      "Contact the listing agent, schedule a home tour, and lock in your mortgage pre-approval — all with guided templates and checklists.",
    details: ["Contact listing agent", "Schedule home tour", "Mortgage pre-approval"],
    href: "/prepare-to-buy",
    cta: "Get prep checklist",
    highlight: true,
  },
  {
    icon: FileText,
    step: "03",
    title: "Build your offer",
    description:
      "Our AI wizard walks you through every offer term in plain English — price, contingencies, earnest money, closing timeline. No legal experience needed.",
    details: ["Plain-English explanations", "AI-powered suggestions", "State-specific forms"],
    href: null,
    cta: null,
  },
  {
    icon: Send,
    step: "04",
    title: "Submit with confidence",
    description:
      "Download a professional offer package or send directly to the listing agent. Your documents are indistinguishable from agent-submitted offers.",
    details: ["PDF download in seconds", "Direct agent email delivery", "Offer tracking dashboard"],
    href: null,
    cta: null,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <p className="section-label">Simple process</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-5">
            From listing to offer
            <br />
            <span className="gradient-text">in 4 steps.</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            No real estate experience required. We guide every decision like a knowledgeable friend.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div
                className={`bg-white rounded-2xl p-7 border-2 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 h-full flex flex-col ${
                  step.highlight ? "border-blue-200 bg-blue-50/30" : "border-slate-100"
                }`}
              >
                {/* Icon + Step number */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-shadow group-hover:shadow-lg ${
                      step.highlight
                        ? "bg-blue-600 shadow-blue-200 group-hover:shadow-blue-300"
                        : "bg-blue-600 shadow-blue-100 group-hover:shadow-blue-200"
                    }`}
                  >
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-5xl font-black text-slate-100 leading-none select-none tabular-nums">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2.5">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-5 text-sm flex-1">{step.description}</p>

                <ul className="space-y-2 mb-5">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${step.highlight ? "text-blue-500" : "text-blue-400"}`} />
                      {detail}
                    </li>
                  ))}
                </ul>

                {step.href && step.cta && (
                  <Link
                    href={step.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 group/link mt-auto"
                  >
                    {step.cta}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-md shadow-blue-200 hover:shadow-lg transition-all text-[15px]"
          >
            Start Your Offer Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-sm text-slate-400 mt-4">
            No credit card required · Preview free · Pay only when you&apos;re ready to submit
          </p>
        </div>
      </div>
    </section>
  );
}
