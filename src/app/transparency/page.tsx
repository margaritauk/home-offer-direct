import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Sparkles, Database, Edit3 } from "lucide-react";

export default function TransparencyPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12" style={{ paddingTop: "max(6rem, calc(56px + 2.5rem))" }}>
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-4">
            Last updated: June 2026
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Transparency & Labeling Policy</h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            HomeOfferDirect uses AI to help buyers make better offers. We believe you have a right to know when content is AI-generated, what data it used, and how confident you should be in it.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Content Types on This Platform</h2>
          <div className="space-y-4">
            {[
              {
                icon: <Sparkles className="w-5 h-5 text-blue-600" />,
                bg: "#dbeafe", border: "#93c5fd", label: "AI-generated",
                desc: "Content produced or significantly shaped by an AI model. This includes offer price recommendations, offer confidence scores, and market analysis summaries.",
                how: "Powered by our scoring model trained on offer outcomes and market data.",
              },
              {
                icon: <Database className="w-5 h-5 text-green-700" />,
                bg: "#dcfce7", border: "#86efac", label: "Data-derived",
                desc: "Content calculated directly from data sources without a generative AI model. Examples: sold-to-list ratios from MLS data, days on market, property tax records.",
                how: "Pulled from MLS, Cook County Assessor, and public records.",
              },
              {
                icon: <Edit3 className="w-5 h-5 text-gray-600" />,
                bg: "#f3f4f6", border: "#d1d5db", label: "Your input",
                desc: "Exactly what you typed or selected. We do not modify your inputs.",
                how: "Stored exactly as entered.",
              },
            ].map(item => (
              <div key={item.label} style={{ background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: 12, padding: "16px 20px" }}>
                <div className="flex items-center gap-3 mb-2">
                  {item.icon}
                  <span className="font-bold text-gray-900">{item.label}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{item.desc}</p>
                <p className="text-xs text-gray-500">{item.how}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What We Use AI For</h2>
          <ul className="space-y-3 text-sm text-gray-700 leading-relaxed">
            {[
              "Offer price recommendations (based on comparable sales, DOM, and market temperature)",
              "Offer confidence scoring (0–100 score based on competitiveness factors)",
              "Market temperature labels (Buyer's Market / Balanced / Seller's Market)",
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What We Do NOT Use AI For</h2>
          <ul className="space-y-3 text-sm text-gray-700">
            {[
              "Required legal clauses (Illinois law mandates the exact language — we do not let AI modify these)",
              "Property tax figures (sourced from Cook County Assessor records)",
              "Days on market (sourced directly from MLS)",
              "Your personal inputs (your offer price, name, signature — untouched)",
            ].map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">AI Audit Schedule</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Our AI labeling system is audited quarterly. Any new AI-assisted feature must include labeling as a launch requirement — no unlabeled AI content may be shipped. Last audit: Q2 2026.
          </p>
        </section>

        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 text-sm text-gray-600 leading-relaxed">
          Questions about our AI use? Email <a href="mailto:transparency@homeofferdirect.org" className="text-blue-600 underline">transparency@homeofferdirect.org</a>
        </div>
      </main>
      <Footer />
    </>
  );
}
