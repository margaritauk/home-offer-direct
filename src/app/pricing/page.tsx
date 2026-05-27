import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { CheckCircle, X, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: 0,
    note: "Always free",
    cta: "Start free",
    href: "/signup",
    highlight: false,
    features: ["Property search", "AI offer preview", "Market guidance", "Save up to 3 homes"],
    missing: ["Download PDF", "Send to agent", "State-compliant docs", "AI negotiation copilot"],
  },
  {
    name: "Basic",
    price: 29,
    note: "per offer",
    cta: "Get Basic",
    href: "/signup?plan=basic",
    highlight: false,
    features: ["Everything free", "Download offer PDF", "State-compliant contract", "Cover letter", "Agent email template"],
    missing: ["Send directly to agent", "AI negotiation copilot", "Escalation clause builder"],
  },
  {
    name: "Premium",
    price: 99,
    note: "per offer · most popular",
    cta: "Get Premium",
    href: "/signup?plan=premium",
    highlight: true,
    features: ["Everything in Basic", "Send directly to agent", "AI negotiation copilot", "Escalation clause builder", "Market analysis report", "Offer strength score", "Unlimited revisions", "Priority support"],
    missing: [],
  },
  {
    name: "Pro",
    price: 49,
    note: "/ month · unlimited offers",
    cta: "Start Pro",
    href: "/signup?plan=pro",
    highlight: false,
    features: ["Everything in Premium", "Unlimited offers", "Multiple property tracking", "Offer analytics", "Attorney review network", "Team access (3 seats)"],
    missing: [],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-28 pb-16 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">Pricing</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Simple, honest pricing
          </h1>
          <p className="text-lg text-gray-500">
            Pay once. No subscriptions required. Compare vs. a buyer&apos;s agent at 2–3% of your home price.
          </p>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map(plan => (
            <div key={plan.name}
              className={`rounded-2xl border p-6 flex flex-col transition-all ${
                plan.highlight
                  ? "border-blue-500 shadow-lg shadow-blue-50 scale-[1.02]"
                  : "border-gray-200 hover:border-gray-300"
              }`}>
              {plan.highlight && (
                <div className="text-xs font-bold text-blue-600 bg-blue-50 rounded-full px-3 py-1 w-fit mb-3">
                  Most popular
                </div>
              )}
              <h3 className="font-bold text-gray-900 mb-1">{plan.name}</h3>
              <div className="mb-1">
                <span className="text-3xl font-bold text-gray-900">{plan.price===0?"Free":`$${plan.price}`}</span>
              </div>
              <p className="text-xs text-gray-400 mb-5">{plan.note}</p>

              <Link href={plan.href}
                className={`w-full text-center py-2.5 rounded-lg text-sm font-semibold mb-6 transition-all ${
                  plan.highlight
                    ? "brand-gradient text-white hover:opacity-90"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}>
                {plan.cta} <ArrowRight className="inline w-3.5 h-3.5 ml-1"/>
              </Link>

              <ul className="space-y-2 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex gap-2 text-xs text-gray-700">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5"/>
                    {f}
                  </li>
                ))}
                {plan.missing.map(f => (
                  <li key={f} className="flex gap-2 text-xs text-gray-400 line-through">
                    <X className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"/>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-xl mx-auto text-center mt-12">
          <p className="text-sm text-gray-500 mb-2">
            🔒 Preview your full offer for free — pay only when you&apos;re ready to download or send.
          </p>
          <p className="text-sm text-gray-400">
            100% refund within 24 hours if you haven&apos;t downloaded your documents.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
