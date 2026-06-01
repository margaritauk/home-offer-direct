import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  CheckCircle,
  X,
  ArrowRight,
  Zap,
  Shield,
  MessageSquare,
  Star,
  HelpCircle,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    tagline: "For buyers exploring their options",
    price: 0,
    period: "",
    priceNote: "Always free",
    cta: "Start Free",
    ctaHref: "/signup",
    color: "border-slate-200",
    ctaColor: "bg-slate-900 hover:bg-slate-800 text-white",
    popular: false,
    features: [
      { text: "Property search & import", included: true },
      { text: "AI offer wizard preview", included: true },
      { text: "Offer price guidance", included: true },
      { text: "Market analysis preview", included: true },
      { text: "Save up to 3 properties", included: true },
      { text: "Download offer PDF", included: false },
      { text: "Send to listing agent", included: false },
      { text: "State-compliant documents", included: false },
      { text: "AI negotiation copilot", included: false },
      { text: "Escalation clause builder", included: false },
    ],
  },
  {
    name: "Basic",
    tagline: "Everything you need to submit one offer",
    price: 29,
    period: "one-time",
    priceNote: "Per offer",
    cta: "Get Basic",
    ctaHref: "/signup?plan=basic",
    color: "border-slate-200",
    ctaColor: "bg-slate-900 hover:bg-slate-800 text-white",
    popular: false,
    features: [
      { text: "Everything in Starter", included: true },
      { text: "Download complete offer PDF", included: true },
      { text: "State-compliant purchase contract", included: true },
      { text: "Earnest money guidance", included: true },
      { text: "Professional cover letter", included: true },
      { text: "Listing agent email template", included: true },
      { text: "Send to listing agent", included: false },
      { text: "AI negotiation copilot", included: false },
      { text: "Escalation clause builder", included: false },
      { text: "Repair request builder", included: false },
    ],
  },
  {
    name: "Premium",
    tagline: "The complete offer toolkit — our most popular plan",
    price: 99,
    period: "one-time",
    priceNote: "Per offer, full features",
    cta: "Get Premium",
    ctaHref: "/signup?plan=premium",
    color: "border-blue-500 shadow-2xl shadow-blue-100",
    ctaColor: "gradient-bg text-white hover:opacity-90",
    popular: true,
    features: [
      { text: "Everything in Basic", included: true },
      { text: "Direct send to listing agent", included: true },
      { text: "AI negotiation copilot", included: true },
      { text: "Escalation clause builder", included: true },
      { text: "Repair request builder", included: true },
      { text: "Market analysis report", included: true },
      { text: "Offer competitiveness score", included: true },
      { text: "Seller psychology insights", included: true },
      { text: "Unlimited offer revisions", included: true },
      { text: "Priority support", included: true },
    ],
  },
  {
    name: "Pro",
    tagline: "For investors and active buyers making multiple offers",
    price: 49,
    period: "/month",
    priceNote: "Billed monthly · Cancel anytime",
    cta: "Start Pro",
    ctaHref: "/signup?plan=pro",
    color: "border-slate-200",
    ctaColor: "bg-slate-800 hover:bg-slate-900 text-white",
    popular: false,
    features: [
      { text: "Everything in Premium", included: true },
      { text: "Unlimited offers per month", included: true },
      { text: "Saved buyer profiles", included: true },
      { text: "Multi-property tracking", included: true },
      { text: "Offer history & analytics", included: true },
      { text: "Attorney review network access", included: true },
      { text: "Bulk document templates", included: true },
      { text: "Team access (up to 3 users)", included: true },
      { text: "Concierge support chat", included: true },
      { text: "API access", included: true },
    ],
  },
];

const faqs = [
  {
    q: "Can I upgrade after purchasing?",
    a: "Yes! You can upgrade from Basic to Premium at any time — you'll only pay the difference.",
  },
  {
    q: "What if my offer is rejected?",
    a: "With Premium you can revise and resubmit unlimited times. Basic offers can be revised once.",
  },
  {
    q: "Is there a refund policy?",
    a: "We offer a 100% refund within 24 hours of purchase if you haven't downloaded your documents.",
  },
  {
    q: "Are the documents legally valid?",
    a: "Our documents use state-approved forms. We strongly recommend attorney review before submission.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 gradient-bg-soft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center text-sm font-semibold text-blue-600 bg-white/80 px-4 py-1.5 rounded-full mb-4 border border-blue-200">
            Simple, Transparent Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5">
            One small fee.{" "}
            <span className="gradient-text">Thousands saved.</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Compare what you pay us to what you&apos;d pay a buyer&apos;s agent (2-3% of purchase price).
            On a $500K home, that&apos;s $15,000 vs. $99.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-3xl border-2 ${plan.color} p-7 flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-lg ${plan.popular ? "scale-105" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-bg text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mb-5 leading-relaxed">{plan.tagline}</p>

                  <div className="flex items-baseline gap-1">
                    {plan.price === 0 ? (
                      <span className="text-3xl font-black text-slate-900">Free</span>
                    ) : (
                      <>
                        <span className="text-3xl font-black text-slate-900">${plan.price}</span>
                        <span className="text-sm text-slate-500">{plan.period}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{plan.priceNote}</p>
                </div>

                <Link
                  href={plan.ctaHref}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all mb-7 text-sm ${plan.ctaColor}`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-2 text-xs">
                      {feature.included ? (
                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "text-slate-700" : "text-slate-400"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise / Compare savings */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: Zap,
                color: "text-blue-600 bg-blue-50",
                title: "Pay when you're ready",
                desc: "Start the wizard free. Only pay when you want to download or submit your offer.",
              },
              {
                icon: Shield,
                color: "text-blue-600 bg-blue-50",
                title: "100% Satisfaction Guarantee",
                desc: "Full refund within 24 hours if you haven't downloaded your documents.",
              },
              {
                icon: MessageSquare,
                color: "text-blue-600 bg-blue-50",
                title: "Human Support Available",
                desc: "Our team of real estate experts is available via email and chat for all paid plans.",
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Pricing FAQ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">{faq.q}</h4>
                    <p className="text-sm text-slate-500">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
