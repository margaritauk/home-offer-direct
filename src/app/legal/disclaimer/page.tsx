import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AlertCircle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">Legal Disclaimer</h1>
            <p className="text-slate-500">Last updated: May 25, 2026</p>
          </div>
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-bold text-amber-900 mb-2">IMPORTANT NOTICE</h2>
          <p className="text-amber-800 leading-relaxed">
            HomeOfferDirect.org is a technology platform providing document automation services.
            HomeOfferDirect is NOT a law firm, is NOT a real estate brokerage, and does NOT provide
            legal, financial, or real estate advice. Use of this Platform does not create an
            attorney-client relationship or an agency relationship.
          </p>
        </div>

        <div className="space-y-8">
          {[
            {
              title: "Not a Law Firm",
              content: "HomeOfferDirect.org is not licensed to practice law and does not provide legal advice. The documents, guidance, and AI recommendations provided by HomeOfferDirect are for informational and automation purposes only. Nothing on this Platform should be construed as legal advice. You should always consult with a qualified real estate attorney licensed in your state before signing or submitting any real estate documents.",
            },
            {
              title: "Not a Real Estate Agency",
              content: "HomeOfferDirect does not hold a real estate broker or agent license and does not act as a real estate agent on your behalf. HomeOfferDirect does not represent buyers or sellers, does not owe fiduciary duties to users, and does not participate in real estate transactions as an agent. The Platform is a technology tool only.",
            },
            {
              title: "Document Accuracy",
              content: "While HomeOfferDirect strives to provide accurate, current state-compliant document templates, we make no representation or warranty that the documents are legally sufficient, appropriate for your specific transaction, or current with the latest state laws and regulations. Real estate laws change frequently. HomeOfferDirect strongly recommends independent verification of all document terms and requirements.",
            },
            {
              title: "AI Recommendations",
              content: "AI-generated suggestions, offer price recommendations, negotiation advice, and market analysis provided by HomeOfferDirect are generated using algorithms and publicly available data. These recommendations are not personalized legal or financial advice. They are informational tools only and should not be relied upon as the sole basis for any financial or legal decision.",
            },
            {
              title: "Attorney Review Strongly Recommended",
              content: "HomeOfferDirect STRONGLY RECOMMENDS that all users have their offer documents reviewed by a licensed real estate attorney before submission. This is especially important in states like Illinois and New York where attorney review periods are standard practice. An attorney can identify issues specific to your transaction that automated tools cannot.",
            },
            {
              title: "No Guarantee of Transaction Success",
              content: "HomeOfferDirect makes no guarantee that using the Platform will result in an accepted offer, a completed transaction, or savings of any specific amount. Real estate transactions involve many factors outside HomeOfferDirect's control, including seller decisions, financing approval, inspection results, and market conditions.",
            },
            {
              title: "State-Specific Requirements",
              content: "Real estate laws vary significantly by state and sometimes by county or municipality. While HomeOfferDirect attempts to provide state-specific forms, users are responsible for ensuring compliance with all applicable local laws and regulations. HomeOfferDirect does not guarantee compliance for all jurisdictions.",
            },
          ].map(({ title, content }) => (
            <div key={title}>
              <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
              <p className="text-slate-600 leading-relaxed">{content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <p className="text-sm text-slate-500 leading-relaxed">
            For questions about this disclaimer, please contact{" "}
            <a href="mailto:legal@homeofferdirect.org" className="text-blue-600 hover:underline">
              legal@homeofferdirect.org
            </a>
            . If you are involved in a complex real estate transaction, we encourage you to seek
            qualified legal counsel before proceeding.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
