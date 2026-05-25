import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10 text-sm text-amber-800">
          <strong>Not Legal Advice:</strong> HomeOfferDirect is not a law firm. These terms govern your use of our platform. Please consult an attorney for legal advice specific to your situation.
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Terms of Service</h1>
        <p className="text-slate-500 mb-10">Last updated: May 25, 2026</p>

        <div className="prose max-w-none">
          {[
            {
              title: "1. Acceptance of Terms",
              content: "By accessing or using HomeOfferDirect.org (\"the Platform\"), you agree to be bound by these Terms of Service. If you do not agree, you may not use the Platform. HomeOfferDirect reserves the right to update these terms at any time.",
            },
            {
              title: "2. Description of Service",
              content: "HomeOfferDirect provides document automation software that helps home buyers create real estate purchase offer documents. The Platform is NOT a law firm, does NOT provide legal advice, and does NOT act as a real estate agent or broker. All documents are generated for informational and automation purposes only.",
            },
            {
              title: "3. Not Legal Advice",
              content: "The information provided by HomeOfferDirect, including AI-generated suggestions and document templates, does not constitute legal advice. HomeOfferDirect strongly recommends that all users consult with a licensed real estate attorney in their state before submitting any offer documents. The Platform is not a substitute for professional legal counsel.",
            },
            {
              title: "4. Not a Real Estate Agency",
              content: "HomeOfferDirect does not represent buyers or sellers as a licensed real estate agent or broker. Using our Platform does not create an agency relationship. HomeOfferDirect does not act as a fiduciary to users and does not have duties typically associated with real estate representation.",
            },
            {
              title: "5. User Responsibilities",
              content: "Users are solely responsible for: (a) the accuracy of information entered into the Platform; (b) reviewing all generated documents before submission; (c) understanding the legal implications of offer terms; (d) consulting appropriate legal professionals; (e) compliance with all applicable laws and regulations.",
            },
            {
              title: "6. Document Accuracy & Compliance",
              content: "While HomeOfferDirect makes reasonable efforts to provide accurate, state-compliant document templates, we make no warranty that documents are appropriate for any specific transaction, free from errors, or current with the latest state regulations. Forms change, and HomeOfferDirect cannot guarantee documents are always up-to-date.",
            },
            {
              title: "7. Limitation of Liability",
              content: "To the maximum extent permitted by law, HomeOfferDirect shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, including but not limited to lost deals, failed transactions, incorrect documents, or financial losses.",
            },
            {
              title: "8. Payment Terms",
              content: "Certain features require payment. All payments are non-refundable except as specified in our refund policy. Subscriptions automatically renew unless cancelled before the renewal date. HomeOfferDirect uses Stripe for payment processing.",
            },
            {
              title: "9. Intellectual Property",
              content: "All content, technology, and materials on HomeOfferDirect are protected by intellectual property laws. Users may not reproduce, distribute, or create derivative works without express written permission.",
            },
            {
              title: "10. Governing Law",
              content: "These terms are governed by the laws of the State of Illinois. Any disputes shall be resolved in the courts of Cook County, Illinois.",
            },
          ].map(({ title, content }) => (
            <div key={title} className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
              <p className="text-slate-600 leading-relaxed">{content}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
