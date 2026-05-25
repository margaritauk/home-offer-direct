"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ChevronDown, ChevronUp, Search, ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Getting Started",
    faqs: [
      {
        q: "What is HomeOfferDirect?",
        a: "HomeOfferDirect is an AI-powered platform that guides home buyers through creating, customizing, and submitting professional real estate purchase offers — without needing a buyer's agent. Think of it as TurboTax, but for home offers.",
      },
      {
        q: "Do I need a realtor to use HomeOfferDirect?",
        a: "No! That's the entire point. HomeOfferDirect is designed specifically for buyers who want to purchase a home without a buyer's agent. You can search properties, build your offer, generate all required documents, and submit directly to the listing agent — all without a realtor.",
      },
      {
        q: "How much does it cost?",
        a: "You can start completely free and preview your offer before paying. The Basic plan is $29 for a single offer (includes all documents). The Premium plan is $99 and includes AI negotiation features, direct agent delivery, and advanced tools. Pro subscription is $49/month for unlimited offers.",
      },
      {
        q: "How long does it take to make an offer?",
        a: "Most buyers complete their offer in 15-30 minutes. The step-by-step wizard guides you through each decision, and AI explanations mean you never get stuck on confusing legal terms.",
      },
    ],
  },
  {
    name: "Legal & Documents",
    faqs: [
      {
        q: "Are the documents legally valid?",
        a: "Yes. Our documents are based on state-approved real estate forms recognized by all agents and brokerages in each supported state. They are the same types of forms a buyer's agent would use. However, HomeOfferDirect is not a law firm, and we strongly encourage you to have a real estate attorney review all documents before submission.",
      },
      {
        q: "What states do you support?",
        a: "We currently support Illinois, Texas, New York, California, and Florida — the five largest real estate markets in the US. We are actively adding more states every month. Each state uses forms compliant with that state's real estate regulations.",
      },
      {
        q: "Do I need an attorney?",
        a: "We strongly recommend it, especially in states like Illinois and New York where attorney review is standard practice. HomeOfferDirect provides document automation — not legal advice. For complex transactions, please consult a licensed real estate attorney. Our Premium plan includes access to our discounted attorney review network.",
      },
      {
        q: "What documents does HomeOfferDirect generate?",
        a: "We generate a complete offer package including: the state-specific purchase and sale agreement, any required addendums (financing, inspection, etc.), an escalation clause addendum (if selected), a professional cover letter to the listing agent, and an offer summary sheet.",
      },
    ],
  },
  {
    name: "Offers & Strategy",
    faqs: [
      {
        q: "How does the AI negotiation advice work?",
        a: "Our AI analyzes recent comparable sales, days on market, price reduction history, and local inventory data to give you evidence-based offer recommendations. It suggests offer price ranges, contingency decisions, escalation strategies, and seller credit requests based on what's working in your specific neighborhood right now.",
      },
      {
        q: "What is an escalation clause?",
        a: "An escalation clause automatically increases your offer price if another buyer makes a higher offer. For example, you might offer $490K but include an escalation that says 'I'll beat any other offer by $2,500, up to a maximum of $510K.' It lets you stay competitive without showing your full hand upfront.",
      },
      {
        q: "What contingencies should I include?",
        a: "We recommend including an inspection contingency (protects you from costly surprises), financing contingency (protects you if your mortgage falls through), and appraisal contingency (protects you if the home appraises below your offer). Our AI will explain the risk of waiving each and recommend based on your local market.",
      },
      {
        q: "Can I make offers on multiple properties?",
        a: "Yes! With the Pro subscription ($49/month), you can make unlimited offers. Each offer uses the correct state-specific forms and is tracked in your dashboard. You can have multiple active offers, drafts, and submitted offers visible at once.",
      },
    ],
  },
  {
    name: "Submission & Process",
    faqs: [
      {
        q: "How do I submit the offer to the listing agent?",
        a: "You have two options: (1) Download your offer package as a professional PDF and deliver it yourself via email or DocuSign. (2) Use our Premium 'Direct Send' feature to email your offer directly from HomeOfferDirect with automatic delivery tracking and read receipts.",
      },
      {
        q: "What happens after my offer is accepted?",
        a: "Congratulations! HomeOfferDirect will guide you through the next steps: opening escrow, scheduling an inspection, coordinating with your mortgage lender, working with a title company, and preparing for closing. Our buyer's checklist keeps you organized through the entire process.",
      },
      {
        q: "What if my offer is rejected or I want to revise it?",
        a: "With Premium, you can revise your offer unlimited times. Our AI can help you understand why offers are typically rejected and suggest counter-strategies. You can also submit a completely new offer on the same property or move on to a different home.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<string | null>("Getting Started-0");
  const [search, setSearch] = useState("");

  const toggleFAQ = (key: string) => {
    setOpenFAQ(openFAQ === key ? null : key);
  };

  const filteredCategories = search
    ? categories
        .map((cat) => ({
          ...cat,
          faqs: cat.faqs.filter(
            (faq) =>
              faq.q.toLowerCase().includes(search.toLowerCase()) ||
              faq.a.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((cat) => cat.faqs.length > 0)
    : categories;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 gradient-bg-soft">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-xl text-slate-500 mb-8">
            Everything you need to know about making a home offer without a realtor.
          </p>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm"
            />
          </div>
        </div>
      </section>

      {/* FAQ content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 mb-4">No questions found matching &quot;{search}&quot;</p>
              <button
                onClick={() => setSearch("")}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCategories.map((category) => (
                <div key={category.name}>
                  <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-3">
                    <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full font-semibold">
                      {category.name}
                    </span>
                  </h2>

                  <div className="space-y-3">
                    {category.faqs.map((faq, i) => {
                      const key = `${category.name}-${i}`;
                      const isOpen = openFAQ === key;
                      return (
                        <div
                          key={key}
                          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                        >
                          <button
                            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                            onClick={() => toggleFAQ(key)}
                          >
                            <span className="font-semibold text-slate-900 pr-4 text-sm sm:text-base">
                              {faq.q}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-5 border-t border-slate-100 pt-4">
                              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                                {faq.a}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 text-center border border-blue-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Still have questions?</h3>
            <p className="text-slate-600 mb-6">
              Our team of real estate experts is here to help. Reach out anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/about#contact"
                className="flex items-center gap-2 px-6 py-3 gradient-bg text-white font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/search"
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
              >
                Try HomeOfferDirect Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
