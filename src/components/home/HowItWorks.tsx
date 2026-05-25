import { Search, FileText, Send, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Find Your Property",
    description:
      "Search any property or paste a Zillow/Redfin/Realtor.com URL. We'll pull in all the details automatically — price, photos, taxes, and market data.",
    color: "bg-blue-50 text-blue-600",
    iconBg: "bg-blue-600",
    details: ["Zillow & Redfin import", "Auto-fill property data", "AI market analysis"],
  },
  {
    icon: FileText,
    step: "02",
    title: "Build Your Offer",
    description:
      "Our AI wizard walks you through every offer term in plain English — from price and contingencies to closing timeline and earnest money. No legal experience needed.",
    color: "bg-purple-50 text-purple-600",
    iconBg: "bg-purple-600",
    details: ["Plain-English explanations", "AI-powered suggestions", "State-specific forms"],
  },
  {
    icon: Send,
    step: "03",
    title: "Submit with Confidence",
    description:
      "Download a professional offer package, or send it directly to the listing agent via email. Your documents look as professional as any agent-submitted offer.",
    color: "bg-emerald-50 text-emerald-600",
    iconBg: "bg-emerald-600",
    details: ["PDF generation", "Direct email delivery", "Offer tracking dashboard"],
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5">
            From listing to offer in{" "}
            <span className="gradient-text">3 simple steps</span>
          </h2>
          <p className="text-xl text-slate-500 leading-relaxed">
            No real estate knowledge required. We guide you through every decision like a smart
            friend who happens to know everything about real estate.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Step number + Icon */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 ${step.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-6xl font-black text-slate-100 leading-none select-none">
                      {step.step}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-6">{step.description}</p>

                  {/* Details */}
                  <ul className="space-y-2">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className={`w-5 h-5 ${step.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <a
            href="/search"
            className="inline-flex items-center gap-2 gradient-bg text-white font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all text-lg"
          >
            Start Your Offer Now — It&apos;s Free
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-sm text-slate-500 mt-3">No credit card required · Preview free · Pay only when you&apos;re ready to submit</p>
        </div>
      </div>
    </section>
  );
}
