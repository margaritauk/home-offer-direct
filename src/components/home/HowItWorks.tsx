import Link from "next/link";
import { Search, FileText, Send, ArrowRight, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Find your property",
    description:
      "Search any property or paste a Zillow, Redfin, or Realtor.com URL. We pull in price, photos, taxes, and real-time market data automatically.",
    details: ["Zillow & Redfin import", "Auto-fill property data", "AI market analysis"],
  },
  {
    icon: FileText,
    step: "02",
    title: "Build your offer",
    description:
      "Our AI wizard walks you through every offer term in plain English — price, contingencies, earnest money, closing timeline. No legal experience needed.",
    details: ["Plain-English explanations", "AI-powered suggestions", "State-specific forms"],
  },
  {
    icon: Send,
    step: "03",
    title: "Submit with confidence",
    description:
      "Download a professional offer package or send it directly to the listing agent. Your documents are indistinguishable from agent-submitted offers.",
    details: ["PDF download in seconds", "Direct agent email delivery", "Offer tracking dashboard"],
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
            <span className="gradient-text">in 3 steps.</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            No real estate experience required. We guide every decision like a knowledgeable friend.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connector line desktop */}
          <div className="hidden lg:block absolute top-16 left-[calc(33.33%+32px)] right-[calc(33.33%+32px)] h-px bg-slate-100 z-0" />

          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 h-full">
                {/* Icon + Step number */}
                <div className="flex items-start justify-between mb-7">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 group-hover:shadow-lg group-hover:shadow-blue-300 transition-shadow">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <span className="text-5xl font-black text-slate-100 leading-none select-none tabular-nums">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-7 text-[15px]">{step.description}</p>

                <ul className="space-y-2.5">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
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
