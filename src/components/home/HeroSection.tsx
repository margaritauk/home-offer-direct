"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Star, Sparkles, Shield, TrendingDown } from "lucide-react";

const trustItems = [
  "No realtor needed",
  "State-compliant documents",
  "Attorney-grade forms",
  "5-minute setup",
];

const stats = [
  { value: "2,400+", label: "Offers submitted" },
  { value: "$28M+",  label: "Commissions saved" },
  { value: "4.9",    label: "Average rating" },
  { value: "5",      label: "States covered" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-0">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Blue glow */}
      <div className="absolute top-0 right-0 w-[640px] h-[640px] bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center py-20 lg:py-28">

          {/* Left — Text */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-slate-200 bg-white rounded-full px-3.5 py-1.5 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-600 tracking-wide">AI-Powered Home Offers</span>
            </div>

            <h1 className="text-[3.25rem] lg:text-[3.75rem] font-bold text-slate-900 leading-[1.08] tracking-tight mb-7">
              Make a professional
              <br />
              home offer.
              <br />
              <span className="text-blue-600">Without an agent.</span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-[480px]">
              HomeOfferDirect walks you through every step — offer strategy, state-compliant documents, and direct agent delivery — in under 30 minutes.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-4 rounded-xl transition-all text-[15px] shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300"
              >
                Start Your Offer Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center justify-center gap-2 text-slate-700 font-semibold px-7 py-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-[15px]"
              >
                See how it works
              </Link>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap gap-x-6 gap-y-2.5">
              {trustItems.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Product preview cards */}
          <div className="relative hidden lg:block animate-fade-in-up delay-200">
            {/* Background plate */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl -m-6" />

            <div className="relative space-y-4 p-6">
              {/* AI Advisor card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1.5">AI Advisor</p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      Based on current market data, this home is selling <strong>2–4% above asking</strong>. Starting at{" "}
                      <strong className="text-blue-600">$492,000</strong> keeps you competitive.
                    </p>
                  </div>
                </div>
              </div>

              {/* Offer strength */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-semibold text-slate-900">Offer Strength</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">Strong</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-4/5 h-2 bg-blue-500 rounded-full" />
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-400">
                  <span>Weak</span>
                  <span>Competitive</span>
                  <span>Strong</span>
                </div>
              </div>

              {/* Savings comparison */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Cost comparison</p>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Traditional agent (3%)</span>
                    <span className="text-sm font-semibold text-red-500 line-through">$14,760</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">HomeOfferDirect</span>
                    <span className="text-sm font-bold text-blue-600">$99</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">You save</span>
                    <span className="text-lg font-black text-slate-900">$14,661</span>
                  </div>
                </div>
              </div>

              {/* Social proof */}
              <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200/80 shadow-sm px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["JM", "SR", "TK"].map((init, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ opacity: 1 - i * 0.15 }}
                      >
                        {init}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">2,400+ buyers trust us</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-semibold text-slate-700 ml-1">4.9</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-slate-100 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="h-12 bg-gradient-to-b from-white to-slate-50" />
    </section>
  );
}
