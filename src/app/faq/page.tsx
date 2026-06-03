"use client";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  { q:"Do I need a realtor to use this?", a:"No — that's the point. It's completely legal to buy a home without a buyer's agent in all 50 states. HomeOfferDirect gives you the same documents and guidance an agent would provide." },
  { q:"Will the listing agent take my offer seriously?", a:"Yes. Your offer package uses the same state-approved forms any agent would use. Many listing agents appreciate the clarity and professionalism of our packages." },
  { q:"What states do you support?", a:"Currently Illinois, Texas, New York, California, and Florida. We add more states monthly." },
  { q:"How is this different from just downloading a form online?", a:"A blank form leaves you on your own. Our AI wizard explains every field, recommends smart defaults, flags risks, and fills the form based on your answers — like TurboTax vs. a blank tax form." },
  { q:"What documents do I get?", a:"A complete offer package: state-specific purchase agreement, all required addendums, escalation clause (if selected), professional cover letter, and an offer summary." },
  { q:"Do I need a lawyer?", a:"We strongly recommend attorney review, especially for large purchases or in states like Illinois and New York where it's standard practice. HomeOfferDirect is a document tool, not a law firm." },
  { q:"What if my offer is rejected?", a:"With Premium you can revise and resubmit unlimited times. Our AI will help you understand what to adjust for the next attempt." },
  { q:"How does the AI negotiation advice work?", a:"It analyzes recent comparable sales, days on market, price reductions, and local inventory to recommend a competitive strategy — all based on publicly available data." },
  { q:"Is my data secure?", a:"Yes. We use 256-bit SSL encryption. Payment is handled by Stripe — we never store card numbers. Your offer details are encrypted and never shared with third parties." },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number|null>(0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">FAQ</p>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Common questions</h1>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpen(open === i ? null : i)}>
                  <span className="font-medium text-gray-900 text-sm pr-4">{faq.q}</span>
                  {open === i
                    ? <ChevronUp className="w-4 h-4 text-blue-500 flex-shrink-0"/>
                    : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0"/>}
                </button>
                <div className={`overflow-hidden transition-all duration-200 ease-out ${open === i ? "max-h-96" : "max-h-0"}`}>
                  <div className="px-5 pb-4 pt-1 border-t border-gray-50">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-sm text-gray-500">Still have questions?{" "}
              <a href="mailto:hello@homeofferdirect.org" className="text-blue-600 hover:underline">Email us →</a>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
