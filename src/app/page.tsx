import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HowItWorks from "@/components/home/HowItWorks";
import Link from "next/link";
import { ArrowRight, CheckCircle, Search } from "lucide-react";
import NoAgentBadge from "@/components/NoAgentBadge";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section
          className="px-4 sm:px-6 bg-white text-center"
          style={{ paddingTop: "max(7rem, calc(56px + env(safe-area-inset-top) + 40px))", paddingBottom: "4.5rem" }}
          data-testid="hero"
        >
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-6">
              No realtor needed · State-compliant forms · AI-guided
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
              Find a home and make an offer<br />
              <span className="text-gradient">without an agent</span>
            </h1>

            <p className="text-lg text-gray-500 mb-8 max-w-lg mx-auto">
              Search listings, tour homes, then build a legally valid offer with AI guidance — in plain English. Buyers save an average of <strong className="text-gray-700">$12,400</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-5">
              <Link
                href="/search"
                data-testid="cta-start"
                className="flex items-center justify-center gap-2 text-white brand-gradient font-semibold px-8 py-4 rounded-xl text-base hover:opacity-90 transition-opacity shadow-sm"
              >
                <Search className="w-4 h-4" /> Search homes — it&apos;s free
              </Link>
              <Link
                href="/dashboard"
                data-testid="cta-dashboard"
                className="flex items-center justify-center gap-2 text-gray-700 bg-gray-50 border border-gray-200 font-medium px-8 py-4 rounded-xl text-base hover:bg-gray-100 transition-colors"
              >
                Go to my dashboard
              </Link>
            </div>

            {/* Escape hatch for users who already have a home in mind */}
            <p className="text-sm text-gray-400 mb-7">
              Already have a home in mind?{" "}
              <Link href="/offer-builder" className="text-blue-600 hover:text-blue-700 font-medium">
                Skip to offer builder <ArrowRight className="w-3 h-3 inline" />
              </Link>
            </p>

            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-gray-400">
              {["No credit card required", "Preview free before paying", "2,400+ buyers saved"].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" /> {t}
                </span>
              ))}
            </div>
            <div className="flex justify-center mt-5">
              <NoAgentBadge size="md" />
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
