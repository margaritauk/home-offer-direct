"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "Is HomeOfferDirect legal? Do I need a realtor?",
    a: "Yes, it's completely legal to purchase a home without a buyer's agent in all 50 states. Buyers are never required by law to use a realtor. HomeOfferDirect helps you generate the same legally-recognized documents a buyer's agent would prepare. We strongly recommend having a real estate attorney review your documents before submission.",
  },
  {
    q: "Will sellers and listing agents take my offer seriously?",
    a: "Absolutely. Our offer packages are generated from state-approved forms and look completely professional — identical to what a buyer's agent would produce. Many listing agents actually appreciate the clarity and organization of HomeOfferDirect offers. The cover letter and professional presentation make a strong impression.",
  },
  {
    q: "What states does HomeOfferDirect support?",
    a: "We currently support Illinois, Texas, New York, California, and Florida — covering the five largest real estate markets in the US. We're actively adding more states monthly. Our forms are sourced directly from each state's real estate commission to ensure compliance.",
  },
  {
    q: "How is this different from downloading a form online?",
    a: "Generic forms online leave you on your own to understand and fill out every field. HomeOfferDirect's AI wizard guides you through each decision, explains what it means, recommends best practices based on your local market, flags potential risks, and auto-populates the forms from your answers. It's the difference between a blank tax form and TurboTax.",
  },
  {
    q: "What if my offer is rejected? Can I revise it?",
    a: "Yes! With Premium and Pro plans, you can revise and resubmit your offer unlimited times. Our AI will help you understand why offers are typically rejected and suggest stronger counter-strategies. You can also submit additional offers on different properties.",
  },
  {
    q: "Do I need an attorney to use HomeOfferDirect?",
    a: "We strongly recommend attorney review, especially for large transactions or complex deals. HomeOfferDirect is a document automation tool, not a law firm. We encourage all users to consult a licensed real estate attorney in their state. Our Premium plan includes access to our attorney review network for discounted consultations.",
  },
  {
    q: "How does the AI negotiation advice work?",
    a: "Our AI analyzes public market data including recent comparable sales, days on market, price reductions, and local inventory levels to give you data-backed negotiation recommendations. It suggests offer price ranges, escalation strategies, contingency decisions, and seller credit requests based on what's working in your specific market right now.",
  },
  {
    q: "Can I send the offer directly to the listing agent through the platform?",
    a: "Yes! With any paid plan, you can use our Listing Agent Lookup to find the agent's contact information and send your professional offer package directly from the platform. We provide a pre-written professional email template that you can customize.",
  },
  {
    q: "What happens after my offer is accepted?",
    a: "Congratulations! We guide you through the next steps: opening escrow, scheduling inspections, coordinating with your lender, reviewing title, and preparing for closing. Our buying checklist feature keeps you on track through the entire process to the keys.",
  },
  {
    q: "Is my personal and financial information secure?",
    a: "Yes, security is our top priority. We use bank-level 256-bit SSL encryption, never store payment card information (handled by Stripe), and never share your offer details with third parties without your consent. Your data belongs to you.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
            Common Questions
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5">
            Everything you need to{" "}
            <span className="gradient-text">know</span>
          </h2>
          <p className="text-xl text-slate-500">
            Have more questions? We&apos;re here to help.
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-slate-900 text-sm sm:text-base pr-4">
                  {faq.q}
                </span>
                {open === i ? (
                  <ChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {open === i && (
                <div className="px-6 pb-5 animate-fade-in">
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-slate-500 mb-4">Still have questions?</p>
          <a
            href="/about#contact"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors border border-blue-200 px-6 py-3 rounded-xl hover:bg-blue-50"
          >
            Contact Our Team →
          </a>
        </div>
      </div>
    </section>
  );
}
