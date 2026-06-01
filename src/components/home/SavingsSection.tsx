"use client";

import { useState } from "react";
import { DollarSign, TrendingDown, ArrowRight, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const savings = [
  {
    homePrice: 350000,
    commission: 10500,
    platform: 29,
    saved: 10471,
  },
  {
    homePrice: 500000,
    commission: 15000,
    platform: 99,
    saved: 14901,
  },
  {
    homePrice: 750000,
    commission: 22500,
    platform: 99,
    saved: 22401,
  },
  {
    homePrice: 1000000,
    commission: 30000,
    platform: 99,
    saved: 29901,
  },
];

const included = [
  "State-specific purchase agreement",
  "Earnest money guidance",
  "AI offer strategy",
  "Escalation clause builder",
  "Professional cover letter",
  "Listing agent contact",
  "Offer package PDF",
  "Email delivery to agent",
];

export default function SavingsSection() {
  const [homePrice, setHomePrice] = useState(500000);
  const commission = Math.round(homePrice * 0.03);
  const platformCost = 99;
  const saved = commission - platformCost;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: calculator */}
          <div>
            <p className="section-label">Real savings</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-5 leading-tight">
              Stop handing over{" "}
              <span className="line-through text-slate-300">$15,000</span>
              <br />
              <span className="gradient-text">in agent commission.</span>
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              The traditional buyer&apos;s agent commission is 2-3% of the purchase price. On a
              $500K home, that&apos;s up to $15,000 — money that could be your down payment.
            </p>

            {/* Savings calculator */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6">
                Savings Calculator
              </h3>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-slate-700">Home Purchase Price</label>
                  <span className="text-xl font-bold text-slate-900">{formatCurrency(homePrice)}</span>
                </div>
                <input
                  type="range"
                  min={200000}
                  max={2000000}
                  step={25000}
                  value={homePrice}
                  onChange={(e) => setHomePrice(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #2563eb ${((homePrice - 200000) / 1800000) * 100}%, #e2e8f0 ${((homePrice - 200000) / 1800000) * 100}%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>$200K</span>
                  <span>$2M</span>
                </div>
              </div>

              {/* Comparison */}
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-red-50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Traditional Agent (3%)</p>
                      <p className="text-xs text-slate-500">Buyer&apos;s agent commission</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-red-600">{formatCurrency(commission)}</span>
                </div>

                <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">HomeOfferDirect</p>
                      <p className="text-xs text-slate-500">Full offer package</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{formatCurrency(platformCost)}</span>
                </div>

                <div className="flex items-center justify-between bg-green-50 rounded-xl px-5 py-4 border-2 border-green-200">
                  <div>
                    <p className="text-base font-bold text-slate-900">You Save</p>
                    <p className="text-xs text-slate-500">By using HomeOfferDirect</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-green-600">{formatCurrency(saved)}</span>
                    <p className="text-xs text-green-600 font-semibold">
                      {((saved / commission) * 100).toFixed(0)}% savings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: what's included */}
          <div>
            <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg">What&apos;s Included</p>
                  <p className="text-blue-100 text-sm">With every offer package</p>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-sm text-blue-100">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-white/10 rounded-2xl p-5 mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-black">$29</span>
                  <span className="text-blue-100 text-sm">one-time</span>
                </div>
                <p className="text-blue-100 text-sm">Single offer · No subscription required</p>
              </div>

              <a
                href="/pricing"
                className="flex items-center justify-center gap-2 bg-white text-blue-700 font-bold py-4 rounded-xl hover:bg-blue-50 transition-all w-full"
              >
                View All Plans
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { value: "$12.4K", label: "Avg. savings" },
                { value: "2,400+", label: "Offers made" },
                { value: "4.9★", label: "User rating" },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                  <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
