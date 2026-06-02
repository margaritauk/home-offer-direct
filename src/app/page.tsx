import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, CheckCircle, Search, FileText, Send } from "lucide-react";

const STEPS = [
  { icon: Search,   n: "1", title: "Find your home",        desc: "Search any address or paste a Zillow / Redfin URL." },
  { icon: FileText, n: "2", title: "Build your offer",      desc: "Answer simple questions. AI explains every clause in plain English." },
  { icon: Send,     n: "3", title: "Submit with confidence",desc: "Send a professional offer directly to the listing agent." },
];

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
        <section id="how-it-works" className="py-16 px-4 sm:px-6 bg-gray-50" data-testid="how-it-works">
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-sm font-semibold text-blue-600 uppercase tracking-wide mb-10">How it works</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex flex-col items-center text-center" data-testid={`step-${s.n}`}>
                    <div className="w-12 h-12 rounded-xl brand-gradient flex items-center justify-center mb-3 shadow-sm">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-xs font-bold text-gray-300 mb-1">STEP {s.n}</div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{s.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/offer-builder"
                className="inline-flex items-center gap-2 text-white brand-gradient font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
              >
                Get started free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
