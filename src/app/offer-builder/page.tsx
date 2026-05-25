"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Info,
  AlertCircle,
  Home,
  DollarSign,
  Calendar,
  Shield,
  FileText,
  Send,
  TrendingUp,
  ChevronDown,
  Lock,
  Download,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Property", icon: Home },
  { id: 2, label: "Offer Price", icon: DollarSign },
  { id: 3, label: "Financing", icon: TrendingUp },
  { id: 4, label: "Timeline", icon: Calendar },
  { id: 5, label: "Contingencies", icon: Shield },
  { id: 6, label: "Terms", icon: FileText },
  { id: 7, label: "Review", icon: CheckCircle },
  { id: 8, label: "Submit", icon: Send },
];

const property = {
  address: "2847 N Clark St",
  city: "Chicago",
  state: "IL",
  zip: "60657",
  price: 485000,
  beds: 3,
  baths: 2,
  sqft: 1850,
  listingAgent: "Sarah Johnson",
  brokerage: "Coldwell Banker",
  dom: 12,
};

export default function OfferBuilderPage() {
  const [step, setStep] = useState(1);
  const [offerData, setOfferData] = useState({
    offerPrice: 492000,
    financeType: "conventional",
    downPayment: 20,
    loanAmount: 0,
    preApproved: true,
    closingDate: "",
    possessionDate: "closing",
    earnestMoney: 9840,
    inspectionContingency: true,
    inspectionDays: 10,
    appraisalContingency: true,
    financingContingency: true,
    financingDays: 21,
    saleContingency: false,
    escalationClause: false,
    escalationIncrement: 2500,
    escalationMax: 510000,
    sellerCredits: 0,
    includedItems: [] as string[],
    repairRequests: "",
    attorneyReviewDays: 5,
    closingCostCredit: 0,
    personalLetter: false,
    additionalTerms: "",
  });
  const [aiExpanded, setAiExpanded] = useState(true);
  const [strengthScore, setStrengthScore] = useState(82);

  const updateOffer = (key: string, value: unknown) => {
    setOfferData((prev) => ({ ...prev, [key]: value }));
    const scores: Record<string, number> = {
      offerPrice: value && (value as number) >= 490000 ? 88 : 75,
      inspectionContingency: value ? 80 : 90,
      escalationClause: value ? 92 : 80,
    };
    if (key in scores) setStrengthScore(scores[key]);
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/search" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </Link>

            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-slate-700">HomeOffer</span>
              <span className="text-sm font-bold text-blue-600">Direct</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Offer strength */}
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-1.5">
                <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all"
                    style={{ width: `${strengthScore}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-emerald-600">{strengthScore}% Strong</span>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700">
                <Lock className="w-3 h-3" />
                Auto-saved
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-slate-100">
            <div
              className="h-full gradient-bg transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left: Steps sidebar */}
          <div className="lg:col-span-1">
            {/* Property card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
              <div className="bg-slate-100 rounded-xl h-32 mb-3 overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: "url(https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400)" }}
                />
              </div>
              <p className="font-semibold text-slate-900 text-sm">{property.address}</p>
              <p className="text-xs text-slate-500">{property.city}, {property.state} {property.zip}</p>
              <p className="text-xl font-black text-slate-900 mt-2">{formatCurrency(property.price)}</p>
              <p className="text-xs text-slate-500">{property.beds}bd · {property.baths}ba · {property.sqft.toLocaleString()} sqft</p>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">Listed by <span className="font-medium text-slate-700">{property.listingAgent}</span></p>
                <p className="text-xs text-slate-400">{property.brokerage}</p>
              </div>
            </div>

            {/* Steps list */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 px-1">Progress</p>
              <div className="space-y-1">
                {STEPS.map((s) => {
                  const Icon = s.icon;
                  const isComplete = step > s.id;
                  const isCurrent = step === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => step > s.id && setStep(s.id)}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all ${
                        isCurrent
                          ? "gradient-bg text-white font-semibold"
                          : isComplete
                          ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 cursor-pointer font-medium"
                          : "text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCurrent ? "bg-white/20" : isComplete ? "bg-emerald-200" : "bg-slate-100"
                      }`}>
                        {isComplete ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Icon className={`w-3.5 h-3.5 ${isCurrent ? "text-white" : "text-slate-400"}`} />
                        )}
                      </div>
                      <span>{s.label}</span>
                      {isCurrent && (
                        <span className="ml-auto text-xs bg-white/20 px-1.5 py-0.5 rounded">
                          Now
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Step content */}
          <div className="lg:col-span-2">
            {/* AI Advisor */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 mb-6">
              <button
                className="flex items-center justify-between w-full px-5 py-4"
                onClick={() => setAiExpanded(!aiExpanded)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900">AI Advisor</p>
                    <p className="text-xs text-slate-500">Personalized guidance for this step</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${aiExpanded ? "rotate-180" : ""}`} />
              </button>
              {aiExpanded && (
                <div className="px-5 pb-4 text-sm text-slate-700 leading-relaxed border-t border-blue-100 pt-4">
                  {getAiAdvice(step, offerData, property)}
                </div>
              )}
            </div>

            {/* Step content */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
              <StepContent
                step={step}
                offerData={offerData}
                updateOffer={updateOffer}
                property={property}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div className="text-sm text-slate-500">
                Step {step} of {STEPS.length}
              </div>

              {step < STEPS.length ? (
                <button
                  onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
                  className="flex items-center gap-2 gradient-bg text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-all shadow-sm"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href="/pricing"
                  className="flex items-center gap-2 gradient-bg text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Generate Offer
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getAiAdvice(
  step: number,
  offerData: Record<string, unknown>,
  property: { price: number; dom: number; state: string }
): React.ReactNode {
  const adviceMap: Record<number, React.ReactNode> = {
    1: (
      <p>
        I found this property at <strong>{formatCurrency(property.price)}</strong>. It&apos;s been on the
        market for <strong>{property.dom} days</strong>. In Lincoln Park, similar homes are selling
        in 8-14 days at an average of 101% of list price. This suggests the market is{" "}
        <strong>competitive but not frenzied</strong> — giving you some room to negotiate.
      </p>
    ),
    2: (
      <p>
        Based on recent comparable sales in this ZIP code, I recommend offering between{" "}
        <strong>{formatCurrency(490000)}</strong> and <strong>{formatCurrency(498000)}</strong>. At{" "}
        {property.dom} days on market, the seller may accept slightly under asking.
        Starting at <strong>{formatCurrency(492000)}</strong> (1.4% above list) should be
        competitive while leaving room if there are other offers.
      </p>
    ),
    3: (
      <p>
        Getting <strong>pre-approved</strong> (not just pre-qualified) strengthens your offer
        significantly. Sellers prefer conventional financing over FHA/VA when possible, as it
        typically closes faster. If you can do <strong>20%+ down</strong>, mention it prominently
        — it signals financial strength and eliminates PMI.
      </p>
    ),
    4: (
      <p>
        A <strong>30-45 day closing</strong> is standard in Illinois. If the seller needs
        flexibility, offering a <strong>flexible possession date</strong> (like letting them stay
        up to 7 days after closing) can make your offer stand out without costing you money.
      </p>
    ),
    5: (
      <p>
        I recommend keeping the <strong>inspection contingency</strong> — it protects you from
        costly surprises. In this market, waiving inspections is risky. However, you can shorten
        the period to <strong>7-10 days</strong> to show good faith. The{" "}
        <strong>appraisal contingency</strong> protects you if the home doesn&apos;t appraise — important
        when offering above asking price.
      </p>
    ),
    6: (
      <p>
        Consider adding an <strong>escalation clause</strong> if you expect multiple offers. This
        automatically increases your offer by increments up to your max — without revealing your
        true ceiling upfront. Also consider a <strong>personal letter</strong> to the sellers;
        in Illinois, this can sometimes tip a decision in your favor.
      </p>
    ),
    7: (
      <p>
        Your offer looks <strong>strong</strong>! Review each section carefully before generating
        your documents. Make sure your earnest money amount is correct — it will need to be
        deposited within 24-48 hours of acceptance. Your documents will be formatted to{" "}
        <strong>Illinois standards</strong> using the CAR-approved purchase contract.
      </p>
    ),
    8: (
      <p>
        Your offer package is ready! You can <strong>download a PDF</strong> to deliver yourself,
        or use our <strong>direct email delivery</strong> to send it to Sarah Johnson at Coldwell
        Banker with a professional cover letter. I&apos;ll also provide suggested follow-up timing and
        negotiation scripts if needed.
      </p>
    ),
  };
  return adviceMap[step] || <p>I&apos;m here to help with any questions about this step.</p>;
}

function StepContent({
  step,
  offerData,
  updateOffer,
  property,
}: {
  step: number;
  offerData: Record<string, unknown>;
  updateOffer: (key: string, value: unknown) => void;
  property: { address: string; city: string; state: string; zip: string; price: number; beds: number; baths: number; sqft: number; listingAgent: string; brokerage: string; dom: number };
}) {
  if (step === 1) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Confirm Property Details</h2>
        <p className="text-slate-500 mb-8">Review the property you want to make an offer on.</p>

        <div className="space-y-4">
          {[
            { label: "Property Address", value: `${property.address}, ${property.city}, ${property.state} ${property.zip}` },
            { label: "Asking Price", value: formatCurrency(property.price) },
            { label: "Bedrooms / Bathrooms", value: `${property.beds} bd / ${property.baths} ba` },
            { label: "Square Footage", value: `${property.sqft.toLocaleString()} sqft` },
            { label: "State", value: "Illinois (IL)" },
            { label: "Listing Agent", value: `${property.listingAgent}, ${property.brokerage}` },
            { label: "Days on Market", value: `${property.dom} days` },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between py-3 border-b border-slate-100">
              <span className="text-sm text-slate-500">{label}</span>
              <span className="text-sm font-semibold text-slate-900 text-right max-w-xs">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-amber-50 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Illinois State Forms</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Your offer will use the Illinois REALTORS® Residential Real Estate Purchase and Sale
              Contract, the standard form recognized by all agents in IL.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    const prices = [property.price - 10000, property.price, property.price + 5000, property.price + 15000];
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">What&apos;s your offer price?</h2>
        <p className="text-slate-500 mb-8">
          Enter the amount you want to offer. List price is{" "}
          <strong className="text-slate-700">{formatCurrency(property.price)}</strong>.
        </p>

        {/* Quick select */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {prices.map((price, i) => {
            const diff = price - property.price;
            const diffStr = diff === 0 ? "List price" : diff > 0 ? `+${formatCurrency(diff)}` : formatCurrency(diff);
            const isSelected = (offerData.offerPrice as number) === price;
            return (
              <button
                key={price}
                onClick={() => updateOffer("offerPrice", price)}
                className={`p-3 rounded-xl text-left border-2 transition-all ${
                  isSelected ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <p className={`text-sm font-bold ${isSelected ? "text-blue-700" : "text-slate-900"}`}>
                  {formatCurrency(price)}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{diffStr}</p>
                {i === 2 && (
                  <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">
                    AI Pick
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom input */}
        <div className="relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
          <input
            type="number"
            value={offerData.offerPrice as number}
            onChange={(e) => updateOffer("offerPrice", Number(e.target.value))}
            className="w-full pl-8 pr-4 py-4 border-2 border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        {/* Strength meter */}
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Offer Competitiveness</span>
            <span className={`text-sm font-bold ${(offerData.offerPrice as number) >= property.price ? "text-emerald-600" : "text-orange-500"}`}>
              {(offerData.offerPrice as number) >= property.price ? "Strong ↑" : "Below Asking ↓"}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(10, ((offerData.offerPrice as number) / property.price - 0.9) * 1000))}%`,
                background: (offerData.offerPrice as number) >= property.price
                  ? "linear-gradient(to right, #34d399, #10b981)"
                  : "linear-gradient(to right, #fbbf24, #f59e0b)",
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Low</span>
            <span>Asking</span>
            <span>Above Market</span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Financing Details</h2>
        <p className="text-slate-500 mb-8">Tell us how you plan to finance the purchase.</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Loan Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: "conventional", label: "Conventional", desc: "Most common, fastest close" },
                { value: "fha", label: "FHA", desc: "Low down payment (3.5%)" },
                { value: "va", label: "VA Loan", desc: "Veterans, no down payment" },
                { value: "cash", label: "All Cash", desc: "Strongest offer type" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateOffer("financeType", option.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    offerData.financeType === option.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-blue-300"
                  }`}
                >
                  <p className={`text-sm font-bold ${offerData.financeType === option.value ? "text-blue-700" : "text-slate-900"}`}>
                    {option.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{option.desc}</p>
                  {option.value === "cash" && (
                    <span className="inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">
                      Strongest
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {offerData.financeType !== "cash" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Down Payment Percentage
                </label>
                <div className="flex gap-3 flex-wrap">
                  {[3.5, 5, 10, 20, 25].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => updateOffer("downPayment", pct)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        offerData.downPayment === pct
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:border-blue-300"
                      }`}
                    >
                      {pct}%
                      {pct === 20 && <span className="block text-xs">Ideal</span>}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Down payment amount: <strong className="text-slate-700">
                    {formatCurrency((offerData.offerPrice as number) * ((offerData.downPayment as number) / 100))}
                  </strong>
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <input
                  type="checkbox"
                  id="preapproved"
                  checked={offerData.preApproved as boolean}
                  onChange={(e) => updateOffer("preApproved", e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <label htmlFor="preapproved" className="text-sm font-semibold text-slate-700 cursor-pointer">
                    I have a pre-approval letter
                  </label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Attaching your pre-approval significantly strengthens your offer.
                  </p>
                </div>
                <CheckCircle className={`w-5 h-5 ml-auto flex-shrink-0 ${offerData.preApproved ? "text-emerald-500" : "text-slate-300"}`} />
              </div>
            </>
          )}

          {offerData.financeType === "cash" && (
            <div className="bg-emerald-50 rounded-xl p-4 flex gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Cash offer — your strongest move</p>
                <p className="text-sm text-emerald-700 mt-0.5">
                  Cash offers close faster, eliminate financing risk, and sellers almost always
                  prefer them. You&apos;ll need to provide proof of funds with your offer.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Closing Timeline</h2>
        <p className="text-slate-500 mb-8">When do you want to close on the property?</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Target Closing Date
            </label>
            <input
              type="date"
              value={offerData.closingDate as string}
              onChange={(e) => updateOffer("closingDate", e.target.value)}
              min={new Date(Date.now() + 20 * 86400000).toISOString().split("T")[0]}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
            />
            <div className="flex gap-2 mt-3">
              {[21, 30, 45, 60].map((days) => {
                const date = new Date(Date.now() + days * 86400000);
                const dateStr = date.toISOString().split("T")[0];
                return (
                  <button
                    key={days}
                    onClick={() => updateOffer("closingDate", dateStr)}
                    className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    {days} days
                    {days === 30 && <span className="block text-blue-500">Typical</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Earnest Money Deposit
            </label>
            <div className="relative mb-3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                value={offerData.earnestMoney as number}
                onChange={(e) => updateOffer("earnestMoney", Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((pct) => (
                <button
                  key={pct}
                  onClick={() => updateOffer("earnestMoney", Math.round((offerData.offerPrice as number) * (pct / 100)))}
                  className="text-sm px-3 py-2 border border-slate-200 rounded-xl text-slate-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  {pct}% ({formatCurrency(Math.round((offerData.offerPrice as number) * (pct / 100)))})
                  {pct === 2 && <span className="block text-xs text-blue-500">Standard in IL</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">About Earnest Money</p>
              <p className="text-sm text-blue-700 mt-0.5">
                Earnest money is a good-faith deposit that shows you&apos;re serious. In Illinois,
                2% is standard. It&apos;s held in escrow and applied to your down payment at closing
                — or returned to you if the deal falls through under certain contingencies.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Contingencies</h2>
        <p className="text-slate-500 mb-8">
          Contingencies protect you if something goes wrong. Tap each to learn more.
        </p>

        <div className="space-y-4">
          {[
            {
              key: "inspectionContingency",
              title: "Inspection Contingency",
              desc: "Allows you to back out or renegotiate if the inspection reveals serious issues.",
              recommended: true,
              riskIfWaived: "High — you could buy a home with hidden defects",
              daysKey: "inspectionDays",
              defaultDays: 10,
            },
            {
              key: "appraisalContingency",
              title: "Appraisal Contingency",
              desc: "Protects you if the home appraises below your offer price. You can renegotiate or back out.",
              recommended: true,
              riskIfWaived: "Medium-High — you'd need to cover the gap in cash",
              daysKey: null,
              defaultDays: null,
            },
            {
              key: "financingContingency",
              title: "Financing Contingency",
              desc: "Lets you exit the contract if your mortgage falls through.",
              recommended: true,
              riskIfWaived: "High — you could lose your earnest money",
              daysKey: "financingDays",
              defaultDays: 21,
            },
            {
              key: "saleContingency",
              title: "Sale Contingency",
              desc: "Makes your offer contingent on selling your current home first.",
              recommended: false,
              riskIfWaived: "Low — only relevant if you own another home",
              daysKey: null,
              defaultDays: null,
            },
          ].map((contingency) => (
            <div
              key={contingency.key}
              className={`rounded-2xl border-2 p-5 transition-all ${
                offerData[contingency.key] ? "border-blue-200 bg-blue-50/50" : "border-slate-100 bg-white"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer flex-shrink-0 mt-0.5 transition-all ${
                    offerData[contingency.key]
                      ? "border-blue-500 bg-blue-500"
                      : "border-slate-300 hover:border-blue-400"
                  }`}
                  onClick={() => updateOffer(contingency.key, !offerData[contingency.key])}
                >
                  {!!offerData[contingency.key] && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-slate-900">{contingency.title}</h3>
                    {contingency.recommended && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{contingency.desc}</p>
                  <p className={`text-xs ${offerData[contingency.key] ? "text-emerald-600" : "text-orange-600"}`}>
                    {offerData[contingency.key] ? "✓ Protected" : `⚠ Risk: ${contingency.riskIfWaived}`}
                  </p>

                  {contingency.daysKey && !!offerData[contingency.key] && (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-xs text-slate-500">Period:</span>
                      {[7, 10, 14, 21].map((days) => (
                        <button
                          key={days}
                          onClick={() => updateOffer(contingency.daysKey!, days)}
                          className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                            offerData[contingency.daysKey as string] === days
                              ? "border-blue-500 bg-blue-100 text-blue-700 font-semibold"
                              : "border-slate-200 text-slate-600 hover:border-blue-300"
                          }`}
                        >
                          {days} days
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step === 6) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Additional Terms</h2>
        <p className="text-slate-500 mb-8">Customize your offer with advanced features.</p>

        <div className="space-y-6">
          {/* Escalation clause */}
          <div className={`rounded-2xl border-2 p-5 transition-all ${offerData.escalationClause ? "border-blue-200 bg-blue-50/30" : "border-slate-100"}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-0.5">Escalation Clause</h3>
                <p className="text-xs text-slate-500">Automatically beats competing offers up to your max</p>
              </div>
              <button
                onClick={() => updateOffer("escalationClause", !offerData.escalationClause)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  offerData.escalationClause ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${offerData.escalationClause ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            {!!offerData.escalationClause && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Beat competing offers by</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                    <input
                      type="number"
                      value={offerData.escalationIncrement as number}
                      onChange={(e) => updateOffer("escalationIncrement", Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Up to maximum of</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                    <input
                      type="number"
                      value={offerData.escalationMax as number}
                      onChange={(e) => updateOffer("escalationMax", Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Seller credits */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Request Seller Credits (optional)
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Seller credits reduce your out-of-pocket closing costs. Common in buyers&apos; markets or when repairs are needed.
            </p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                value={offerData.sellerCredits as number}
                onChange={(e) => updateOffer("sellerCredits", Number(e.target.value))}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Attorney review */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Attorney Review Period</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standard in Illinois — allows attorneys to review and modify the contract within 5 business days of acceptance.
                </p>
              </div>
              <div className="flex gap-2">
                {[3, 5, 7].map((days) => (
                  <button
                    key={days}
                    onClick={() => updateOffer("attorneyReviewDays", days)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      offerData.attorneyReviewDays === days
                        ? "border-blue-500 bg-blue-100 text-blue-700 font-semibold"
                        : "border-slate-200 text-slate-600 hover:border-blue-300"
                    }`}
                  >
                    {days} days
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Personal letter */}
          <div className={`rounded-2xl border-2 p-5 transition-all ${offerData.personalLetter ? "border-purple-200 bg-purple-50/30" : "border-slate-100"}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-0.5">Add Personal Letter to Seller</h3>
                <p className="text-xs text-slate-500">
                  A heartfelt letter can differentiate your offer. Our AI will help draft one based on the property.
                </p>
              </div>
              <button
                onClick={() => updateOffer("personalLetter", !offerData.personalLetter)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  offerData.personalLetter ? "bg-purple-600" : "bg-slate-200"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${offerData.personalLetter ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 7) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Review Your Offer</h2>
        <p className="text-slate-500 mb-8">
          Everything looks great! Review the key terms before generating your documents.
        </p>

        <div className="space-y-4">
          {[
            {
              section: "Property",
              items: [
                { label: "Address", value: `${property.address}, ${property.city}, ${property.state}` },
                { label: "Asking Price", value: formatCurrency(property.price) },
              ],
            },
            {
              section: "Your Offer",
              items: [
                { label: "Offer Price", value: formatCurrency(offerData.offerPrice as number) },
                { label: "Difference", value: `${offerData.offerPrice as number > property.price ? "+" : ""}${formatCurrency((offerData.offerPrice as number) - property.price)}` },
                { label: "Earnest Money", value: formatCurrency(offerData.earnestMoney as number) },
              ],
            },
            {
              section: "Financing",
              items: [
                { label: "Loan Type", value: (offerData.financeType as string).charAt(0).toUpperCase() + (offerData.financeType as string).slice(1) },
                { label: "Down Payment", value: `${offerData.downPayment}% (${formatCurrency((offerData.offerPrice as number) * ((offerData.downPayment as number) / 100))})` },
                { label: "Pre-Approved", value: offerData.preApproved ? "Yes ✓" : "No" },
              ],
            },
            {
              section: "Timeline",
              items: [
                { label: "Closing Date", value: offerData.closingDate ? new Date(offerData.closingDate as string).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "TBD" },
                { label: "Attorney Review", value: `${offerData.attorneyReviewDays} business days` },
              ],
            },
            {
              section: "Contingencies",
              items: [
                { label: "Inspection", value: offerData.inspectionContingency ? `Yes — ${offerData.inspectionDays} days` : "Waived" },
                { label: "Appraisal", value: offerData.appraisalContingency ? "Yes" : "Waived" },
                { label: "Financing", value: offerData.financingContingency ? `Yes — ${offerData.financingDays} days` : "Waived" },
                { label: "Sale", value: offerData.saleContingency ? "Yes" : "Not applicable" },
              ],
            },
            {
              section: "Advanced Terms",
              items: [
                { label: "Escalation Clause", value: offerData.escalationClause ? `Yes — up to ${formatCurrency(offerData.escalationMax as number)}` : "No" },
                { label: "Seller Credits", value: (offerData.sellerCredits as number) > 0 ? formatCurrency(offerData.sellerCredits as number) : "None" },
                { label: "Personal Letter", value: offerData.personalLetter ? "Yes, AI-drafted" : "No" },
              ],
            },
          ].map(({ section, items }) => (
            <div key={section} className="bg-slate-50 rounded-xl overflow-hidden">
              <div className="px-4 py-2 bg-slate-100">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{section}</p>
              </div>
              <div className="px-4 py-2">
                {items.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-sm text-slate-500">{label}</span>
                    <span className="text-sm font-semibold text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-green-50 rounded-xl p-4 flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-800">Offer ready to generate</p>
            <p className="text-sm text-green-700 mt-0.5">
              Your complete Illinois purchase contract, escalation clause addendum, and cover letter
              are ready. Click &quot;Generate Offer&quot; to download or send.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 8) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Submit Your Offer</h2>
        <p className="text-slate-500 mb-8">
          Choose how you want to deliver your professional offer package.
        </p>

        <div className="space-y-4">
          {[
            {
              title: "Download PDF Package",
              desc: "Download your complete offer package as a professionally formatted PDF.",
              icon: Download,
              badge: "Free",
              badgeColor: "bg-slate-100 text-slate-600",
              action: "Download",
              actionColor: "border-slate-200 text-slate-700 hover:bg-slate-50",
            },
            {
              title: "Send Directly to Listing Agent",
              desc: `Email your offer to Sarah Johnson at Coldwell Banker with a professional cover letter. Includes read receipt tracking.`,
              icon: Send,
              badge: "Recommended",
              badgeColor: "bg-blue-100 text-blue-700",
              action: "Send Offer",
              actionColor: "gradient-bg text-white hover:opacity-90",
            },
          ].map((option) => {
            const Icon = option.icon;
            return (
              <Link
                key={option.title}
                href="/pricing"
                className={`block bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-blue-300 transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">{option.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${option.badgeColor}`}>
                        {option.badge}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{option.desc}</p>
                  </div>
                  <button className={`flex-shrink-0 px-5 py-2 rounded-xl border text-sm font-semibold transition-all ${option.actionColor}`}>
                    {option.action}
                  </button>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 bg-amber-50 rounded-xl p-4 flex gap-3 border border-amber-100">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Attorney Review Recommended</p>
            <p className="text-sm text-amber-700 mt-0.5">
              HomeOfferDirect is a document automation tool, not a law firm. We strongly recommend
              having a licensed real estate attorney in Illinois review your offer before submission.
              Our Premium plan includes access to discounted attorney consultations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
