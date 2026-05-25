import Link from "next/link";
import { ArrowRight, Home, Shield, Zap } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-bg p-12 sm:p-16 text-center text-white">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10">
            {/* Icon */}
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Home className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold mb-5 leading-tight">
              Ready to make your dream offer?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of buyers who skipped the agent, saved thousands, and still got the
              home they wanted. Start free — no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                href="/search"
                className="flex items-center gap-2 bg-white text-blue-700 font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all text-lg w-full sm:w-auto justify-center"
              >
                <Zap className="w-5 h-5" />
                Start Your Offer Free
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all text-lg w-full sm:w-auto justify-center"
              >
                View Pricing
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
              {[
                { icon: Shield, text: "Attorney-grade documents" },
                { icon: Zap, text: "5-minute setup" },
                { icon: Home, text: "No realtor needed" },
              ].map(({ icon: Icon, text }) => (
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
