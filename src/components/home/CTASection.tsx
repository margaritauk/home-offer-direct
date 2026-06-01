import Link from "next/link";
import { ArrowRight, Shield, Zap, Home } from "lucide-react";

const proof = [
  { icon: Shield, text: "Attorney-grade documents" },
  { icon: Zap,    text: "Ready in 30 minutes" },
  { icon: Home,   text: "No realtor required" },
];

export default function CTASection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-blue-600 px-10 py-16 sm:px-16 sm:py-20 text-center text-white">
          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-white/5 rounded-full" />
          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-bold mb-5 leading-tight tracking-tight">
              Ready to make your dream offer?
            </h2>
            <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of buyers who skipped the agent, saved tens of thousands, and still got the home they wanted.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all text-[15px] shadow-lg w-full sm:w-auto justify-center"
              >
                <Zap className="w-5 h-5" />
                Start Free — No Credit Card
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-xl border border-white/25 hover:bg-white/10 transition-all text-[15px] w-full sm:w-auto justify-center"
              >
                View pricing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-blue-200">
              {proof.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
