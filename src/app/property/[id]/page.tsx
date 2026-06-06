import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPropertyById } from "@/lib/properties";
import { formatCurrency } from "@/lib/utils";
import {
  Bed, Bath, MapPin, TrendingUp, TrendingDown, Minus,
  Sparkles, ArrowRight, CheckCircle2, Clock, Tag,
} from "lucide-react";

/* ── Confidence factor builder ──────────────────────────────────────── */
interface ConfidenceFactor {
  label: string;
  detail: string;
  positive: boolean;
}

function buildConfidenceFactors(property: {
  dom: number;
  reduced: boolean;
  priceChange: number;
  marketTrend: string;
}): ConfidenceFactor[] {
  const { dom, reduced, priceChange, marketTrend } = property;

  // Factor 1 — Days on market
  const domFactor: ConfidenceFactor = dom <= 7
    ? { label: `Days on market: ${dom}`, detail: "fresh listing — competition may be high", positive: false }
    : dom <= 21
      ? { label: `Days on market: ${dom}`, detail: "moderate competition, room to negotiate", positive: true }
      : { label: `Days on market: ${dom}`, detail: "seller likely motivated — strong negotiating position", positive: true };

  // Factor 2 — Price history
  const priceFactor: ConfidenceFactor = reduced
    ? { label: `Price reduced: $${Math.abs(priceChange).toLocaleString()}`, detail: "seller has already moved — may accept below ask", positive: true }
    : priceChange > 0
      ? { label: "Price increased", detail: "seller is confident — offer closer to asking", positive: false }
      : { label: "No price changes", detail: "listed at original price — test the market", positive: true };

  // Factor 3 — Market trend
  const trendFactor: ConfidenceFactor = marketTrend === "hot"
    ? { label: "Market trend: Hot", detail: "act quickly — multiple offers are common in this area", positive: false }
    : marketTrend === "cooling"
      ? { label: "Market trend: Cooling", detail: "buyer leverage is increasing — negotiate confidently", positive: true }
      : { label: "Market trend: Neutral", detail: "balanced market — fair offers typically accepted", positive: true };

  return [domFactor, priceFactor, trendFactor];
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) notFound();

  const factors = buildConfidenceFactors(property);

  const priceHistoryLabel =
    property.priceChange < 0
      ? `Reduced $${Math.abs(property.priceChange).toLocaleString()}`
      : property.priceChange > 0
        ? `Increased $${property.priceChange.toLocaleString()}`
        : "No changes";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">

        {/* ── Hero image + property info ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
          {/* Image */}
          <div
            className="h-64 sm:h-80 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${property.img})` }}
          >
            {property.reduced && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                Price Reduced!
              </div>
            )}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-blue-700 text-sm font-bold px-3 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-4 h-4" />
              AI Score {property.aiScore}
            </div>
          </div>

          {/* Core details */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{property.address}</h1>
                <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {property.city}, {property.state} {property.zip}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-black text-slate-900">
                  {formatCurrency(property.price)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{property.type}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-700 mb-4">
              <span className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-slate-400"/>{property.beds} beds</span>
              <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-slate-400"/>{property.baths} baths</span>
              <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-slate-400"/>{property.sqft.toLocaleString()} sqft</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400"/>{property.dom} days on market</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                {priceHistoryLabel}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                property.marketTrend === "hot"
                  ? "bg-red-50 text-red-600"
                  : property.marketTrend === "cooling"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-slate-100 text-slate-600"
              }`}>
                {property.marketTrend === "hot" ? <TrendingUp className="w-3 h-3"/> : property.marketTrend === "cooling" ? <TrendingDown className="w-3 h-3"/> : <Minus className="w-3 h-3"/>}
                {property.marketTrend.charAt(0).toUpperCase() + property.marketTrend.slice(1)} market
              </span>
            </div>
          </div>
        </div>

        {/* ── Listing agent info ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 mb-8">
          <p className="text-xs font-medium text-slate-400 mb-1">Listed by</p>
          <p className="font-semibold text-slate-900">{property.agentName}</p>
          <p className="text-sm text-slate-500">{property.brokerage} · {property.agentPhone}</p>
        </div>

        {/* ── Offer Confidence module ────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
          <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-blue-600"/>
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Offer Confidence</h2>
              <p className="text-xs text-slate-400">AI-powered analysis for this listing</p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* AI Score badge */}
              <div className="flex flex-col items-start gap-2">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">AI Score</p>
                <div className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl ${property.aiColor}`}>
                  <Sparkles className="w-4 h-4"/>
                  {property.aiScore} / 100 — {property.aiLabel}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Based on market conditions, price history, and days on market.
                </p>
              </div>

              {/* Suggested offer range */}
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Suggested Offer Range</p>
                <p className="text-2xl font-black text-slate-900">
                  {formatCurrency(property.suggestedOffer[0])}
                </p>
                <p className="text-sm text-slate-400">to {formatCurrency(property.suggestedOffer[1])}</p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Range based on comparable sales, DOM, and price trend. Not a guarantee of market value.
                </p>
              </div>
            </div>

            {/* Confidence factors */}
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-4">Confidence Factors</p>
              <div className="space-y-3">
                {factors.map((factor, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${factor.positive ? "bg-green-100" : "bg-amber-50"}`}>
                      <CheckCircle2 className={`w-3 h-3 ${factor.positive ? "text-green-600" : "text-amber-500"}`}/>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-800">{factor.label}</span>
                      <span className="text-sm text-slate-500"> — {factor.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 sm:px-8 py-5 bg-slate-50 border-t border-slate-100">
            <Link
              href={`/offer-builder?property=${property.id}`}
              className="inline-flex items-center gap-2 gradient-bg text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-sm text-sm"
            >
              Build your offer <ArrowRight className="w-4 h-4"/>
            </Link>
            <p className="text-xs text-slate-400 mt-2">
              Your offer is pre-populated with this property&apos;s details.
            </p>
          </div>
        </div>

        {/* Photo gallery */}
        {property.photos.length > 1 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 sm:px-8 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Photos</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 p-1">
              {property.photos.map((photo, i) => (
                <div
                  key={i}
                  className="h-48 bg-cover bg-center rounded-xl"
                  style={{ backgroundImage: `url(${photo})` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
