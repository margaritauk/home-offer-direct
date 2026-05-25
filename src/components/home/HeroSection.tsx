"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, CheckCircle, Star, Sparkles, Shield, Zap } from "lucide-react";

const trustBadges = [
  "State-Compliant Documents",
  "No Realtor Needed",
  "Attorney-Grade Forms",
  "Secure & Private",
];

export default function HeroSection() {
  const [url, setUrl] = useState("");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 gradient-bg-soft" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyNTYzZWIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoLTZ2LTZoNnptMC0zMHY2aC02di02aDZ6bTAtMTJ2Nmgtdi02aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />

      {/* Floating elements */}
      <div className="absolute top-32 left-8 lg:left-24 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-24 right-8 lg:right-24 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-blue-200 rounded-full px-4 py-2 mb-8 shadow-sm animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-slate-700">
            AI-Powered · State-Compliant · No Agent Required
          </span>
          <span className="ml-1 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            NEW
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6 animate-fade-in-up delay-100">
          Create a Professional{" "}
          <span className="gradient-text">Home Offer</span>
          <br />
          in Minutes —<span className="text-slate-500"> Without a Realtor</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl sm:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-10 animate-fade-in-up delay-200">
          HomeOfferDirect guides you step-by-step through the entire offer process, explains every
          decision in plain English, and generates professional state-compliant offer documents{" "}
          <strong className="text-slate-800">instantly</strong>.
        </p>

        {/* URL Input */}
        <div className="max-w-2xl mx-auto mb-6 animate-fade-in-up delay-300">
          <div className="flex flex-col sm:flex-row gap-3 bg-white/90 backdrop-blur p-2 rounded-2xl shadow-lg border border-slate-200/80">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a Zillow or Redfin listing URL, or search below..."
              className="flex-1 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 bg-transparent outline-none"
            />
            <Link
              href={url ? `/offer-builder?url=${encodeURIComponent(url)}` : "/search"}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md whitespace-nowrap"
            >
              Start Your Offer
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Supports Zillow, Redfin, and Realtor.com URLs · Or search any property
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up delay-300">
          <Link
            href="/search"
            className="flex items-center gap-2 gradient-bg text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all text-lg"
          >
            <Zap className="w-5 h-5" />
            Start Your Offer Free
          </Link>
          <Link
            href="/#how-it-works"
            className="flex items-center gap-2 bg-white text-slate-700 font-semibold px-8 py-4 rounded-xl shadow-sm hover:shadow-md border border-slate-200 transition-all text-lg hover:border-blue-300"
          >
            <Play className="w-5 h-5 text-blue-500" />
            See How It Works
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16 animate-fade-in-up delay-400">
          {trustBadges.map((badge) => (
            <div key={badge} className="flex items-center gap-1.5 text-sm text-slate-600">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              {badge}
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-500">
          <div className="flex -space-x-2">
            {["bg-blue-400", "bg-purple-400", "bg-green-400", "bg-orange-400", "bg-pink-400"].map(
              (color, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
                >
                  {["JM", "SR", "TK", "AL", "PW"][i]}
                </div>
              )
            )}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1 mb-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm font-semibold text-slate-700 ml-1">4.9/5</span>
            </div>
            <p className="text-sm text-slate-500">
              Trusted by <strong className="text-slate-700">2,400+</strong> home buyers
            </p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-slate-200" />
          <div className="text-center sm:text-left">
            <p className="text-2xl font-bold text-slate-900">$12,400</p>
            <p className="text-sm text-slate-500">Average commission saved</p>
          </div>
        </div>

        {/* Hero image / mockup */}
        <div className="mt-20 relative animate-fade-in-up delay-500">
          <div className="absolute inset-0 gradient-bg rounded-3xl blur-2xl opacity-10 scale-105" />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/60 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-lg px-4 py-1.5 text-sm text-slate-500 border border-slate-200 text-center">
                homeofferdirect.org/offer-builder
              </div>
            </div>
            <div className="p-8">
              <div className="max-w-2xl mx-auto">
                {/* Progress bar */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-semibold text-slate-700">
                      Offer Builder — Step 3 of 8
                    </span>
                  </div>
                  <span className="text-sm text-slate-500">38% complete</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full mb-8">
                  <div className="w-[38%] h-2 gradient-bg rounded-full" />
                </div>

                {/* Question */}
                <div className="bg-blue-50 rounded-2xl p-5 mb-6 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-800 mb-1">AI Advisor</p>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        Based on the asking price of <strong>$485,000</strong> and current market
                        data, homes in this area are selling for <strong>2-4% above asking</strong>.
                        I recommend starting your offer at <strong>$492,000</strong> to be
                        competitive while leaving room to negotiate.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  What&apos;s your offer price?
                </h3>
                <p className="text-slate-500 mb-6">
                  Enter the amount you want to offer for this property.
                </p>

                <div className="flex gap-3 mb-4">
                  {["$485,000", "$490,000", "$492,000", "$500,000"].map((price) => (
                    <button
                      key={price}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
                        price === "$492,000"
                          ? "gradient-bg text-white border-transparent shadow-md"
                          : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      {price}
                      {price === "$492,000" && (
                        <span className="block text-xs font-normal opacity-80 mt-0.5">
                          AI Recommended
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Strength meter */}
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Offer Strength</span>
                    <span className="text-sm font-bold text-emerald-600">Strong ↑</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-4/5 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-slate-400">
                    <span>Weak</span>
                    <span>Competitive</span>
                    <span>Strong</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
