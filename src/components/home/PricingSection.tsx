import Link from "next/link";
import { CheckCircle, Zap, ArrowRight, Star } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: 29,
    period: "one-time",
    description: "Perfect for buyers ready to make a single, well-prepared offer.",
    badge: null,
    featured: false,
    features: [
      "State-specific purchase agreement",
      "AI offer wizard (8 steps)",
      "Offer price guidance",
      "Standard contingencies",
      "Earnest money calculator",
      "PDF offer package download",
      "Professional cover letter",
      "Listing agent email template",
    ],
    notIncluded: [
      "AI negotiation copilot",
      "Escalation clause builder",
      "Market analysis report",
      "Repair request builder",
    ],
  },
  {
    name: "Premium",
    price: 99,
    period: "one-time",
    description: "The complete offer toolkit with AI guidance and advanced features.",
    badge: "Most Popular",
    featured: true,
    features: [
      "Everything in Basic",
      "AI negotiation copilot",
      "Escalation clause builder",
      "Market analysis report",
      "Repair request builder",
      "Offer competitiveness scoring",
      "Seller psychology insights",
      "Closing cost calculator",
      "Unlimited offer revisions",
      "Priority email support",
    ],
    notIncluded: [],
  },
  {
    name: "Pro Subscription",
    price: 49,
    period: "/month",
    description: "For investors and active buyers making multiple offers.",
    badge: "Best Value",
    featured: false,
    features: [
      "Everything in Premium",
      "Unlimited offers",
      "Saved buyer profiles",
      "Multiple property tracking",
      "Offer history & analytics",
      "Bulk document templates",
      "Attorney review network",
      "Concierge support chat",
      "Team access (up to 3)",
      "API access",
    ],
    notIncluded: [],
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
            Simple Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5">
            Transparent pricing,{" "}
            <span className="gradient-text">massive savings</span>
          </h2>
          <p className="text-xl text-slate-500 leading-relaxed">
            Pay a fraction of agent commission. No hidden fees. No subscription required.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl border-2 p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.featured
                  ? "border-blue-500 shadow-2xl shadow-blue-100 scale-105"
                  : "border-slate-200"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-blue-600 flex items-center gap-1">
                  {plan.featured && <Star className="w-3 h-3" />}
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-slate-900">${plan.price}</span>
                  <span className="text-slate-500 text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </div>

              <Link
                href="/signup"
                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold transition-all mb-8 ${
                  plan.featured
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>

              <ul className="space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-400 line-through">
                    <div className="w-4 h-4 rounded-full border border-slate-200 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Free trial note */}
        <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-900">Try Before You Buy</h3>
          </div>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            Start the offer builder for free. Preview your complete offer and documents before
            paying. Only pay when you&apos;re ready to download or send.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg"
          >
            Start Free Preview
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
