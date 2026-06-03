import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HowItWorks from "@/components/home/HowItWorks";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

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
              Make a home offer<br />
              <span className="text-gradient">without an agent</span>
            </h1>

            <p className="text-lg text-gray-500 mb-8 max-w-lg mx-auto">
              We guide you step-by-step through the entire offer process — in plain English. Buyers save an average of <strong className="text-gray-700">$12,400</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-7">
              <Link
                href="/offer-builder"
                data-testid="cta-start"
                className="flex items-center justify-center gap-2 text-white brand-gradient font-semibold px-8 py-4 rounded-xl text-base hover:opacity-90 transition-opacity shadow-sm"
              >
                Start my offer — it&apos;s free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                data-testid="cta-dashboard"
                className="flex items-center justify-center gap-2 text-gray-700 bg-gray-50 border border-gray-200 font-medium px-8 py-4 rounded-xl text-base hover:bg-gray-100 transition-colors"
              >
                Go to my dashboard
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-gray-400">
              {["No credit card required", "Preview free before paying", "2,400+ buyers saved"].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" /> {t}
                </span>
              ))}
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
