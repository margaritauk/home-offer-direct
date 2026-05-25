import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Privacy Policy</h1>
        <p className="text-slate-500 mb-10">Last updated: May 25, 2026</p>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-10 text-sm text-blue-800">
          <strong>Summary:</strong> We collect only what we need, never sell your data, and give you full control over your information. Your offer details are private and secure.
        </div>

        <div className="prose max-w-none">
          {[
            {
              title: "1. Information We Collect",
              content: "We collect information you provide directly: name, email address, password, state of purchase, property information, and offer details you enter. We also automatically collect usage data, device information, and IP addresses to improve the Platform.",
            },
            {
              title: "2. How We Use Your Information",
              content: "We use your information to: provide and improve our services; generate your offer documents; communicate with you about your account and offers; process payments; send service notifications; and comply with legal obligations. We do NOT sell your personal information to third parties.",
            },
            {
              title: "3. Data Security",
              content: "We use industry-standard 256-bit SSL encryption for all data transmission. Passwords are hashed using bcrypt. Payment information is processed exclusively by Stripe — we never store credit card numbers. Your offer documents are encrypted at rest and only accessible by you.",
            },
            {
              title: "4. Data Sharing",
              content: "We share data only with: payment processors (Stripe); infrastructure providers (Vercel, AWS); analytics tools (anonymized only); and when required by law. We do not share your offer details, property information, or personal data with real estate agents, brokers, or listing services.",
            },
            {
              title: "5. Your Rights",
              content: "You have the right to: access your personal data; correct inaccurate data; delete your account and associated data; export your data in a portable format; opt out of marketing communications; and lodge a complaint with relevant authorities.",
            },
            {
              title: "6. Cookies",
              content: "We use essential cookies for authentication and security, performance cookies to understand Platform usage, and preference cookies to remember your settings. We do not use third-party advertising cookies.",
            },
            {
              title: "7. Data Retention",
              content: "We retain your account data for as long as your account is active. Offer documents are retained for 3 years by default and can be deleted upon request. Anonymous usage data may be retained indefinitely.",
            },
            {
              title: "8. Contact",
              content: "For privacy questions or to exercise your rights, contact us at privacy@homeofferdirect.org.",
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
