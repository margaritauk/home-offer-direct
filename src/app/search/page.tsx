"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth, useTierFeatures } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/utils";
import { ALL_PROPERTIES } from "@/lib/properties";
import type { Property } from "@/lib/properties";
import {
  Search, SlidersHorizontal, MapPin, Bed, Bath, Square,
  Heart, TrendingDown, TrendingUp, Sparkles, ChevronDown, Filter,
  Phone, Mail, Bookmark,
} from "lucide-react";

/* ── Supabase DB row shape (only columns that exist in the schema) ──── */
interface DbPropertyRow {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number | null;
  dom: number | null;
  agent_name: string | null;
  agent_email: string | null;
  brokerage: string | null;
  img: string | null;
}

/* ── Map a DB row to the Property interface ─────────────────────────── */
function dbRowToProperty(row: DbPropertyRow): Property {
  const price = row.price;
  const dom = row.dom ?? 0;
  // Deterministic AI score based on first char of UUID
  const aiScore = (row.id.charCodeAt(0) % 30) + 70;
  const aiLabel =
    aiScore >= 90 ? "Best Deal" : aiScore >= 80 ? "Great Value" : "Well-Priced";
  const marketTrend: string = dom < 10 ? "hot" : dom > 30 ? "cooling" : "neutral";
  const agentName = row.agent_name ?? "";
  const agentEmail = row.agent_email ?? "";
  const img = row.img ?? "";
  return {
    id: row.id,
    address: row.address,
    city: row.city,
    state: row.state,
    zip: row.zip,
    price,
    beds: row.beds,
    baths: row.baths,
    sqft: row.sqft ?? 0,
    dom,
    agent: agentName,
    agentName,
    agentPhone: "",
    agentEmail,
    brokerage: row.brokerage ?? "",
    img,
    photos: img ? [img] : [],
    type: "Single Family",
    priceHistory: "same",
    priceChange: 0,
    reduced: false,
    aiScore,
    aiLabel,
    aiColor: "text-blue-700 bg-blue-50",
    suggestedOffer: [Math.round(price * 0.97), Math.round(price * 1.02)],
    marketTrend,
  };
}

const SUPABASE_ENABLED =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getSupabaseClient() {
  const { createClient } = await import("@/lib/supabase/client");
  return createClient();
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, saveHome, unsaveHome } = useAuth();
  const features = useTierFeatures();
  const [query, setQuery] = useState("Chicago, IL");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [beds, setBeds] = useState("any");
  const [propType, setPropType] = useState("any");

  // Save Search popover state
  const [showSavePopover, setShowSavePopover] = useState(false);
  const [saveLabel, setSaveLabel] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveBanner, setSaveBanner] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Properties state — starts with mock data, replaced by DB data when available
  const [properties, setProperties] = useState<Property[]>(ALL_PROPERTIES);
  const [propertiesLoading, setPropertiesLoading] = useState(SUPABASE_ENABLED);
  const [usingDbProperties, setUsingDbProperties] = useState(false);

  // Realtime new-listings state
  const [newListingsCount, setNewListingsCount] = useState(0);
  const pendingNewProps = useRef<Property[]>([]);

  useEffect(() => {
    if (!SUPABASE_ENABLED) return;
    let cancelled = false;
    (async () => {
      try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .limit(100);
        if (cancelled) return;
        if (error || !data || data.length === 0) {
          // Fall back to mock data on error or empty result
          setProperties(ALL_PROPERTIES);
        } else {
          setProperties((data as DbPropertyRow[]).map(dbRowToProperty));
          setUsingDbProperties(true);
        }
      } catch {
        if (!cancelled) setProperties(ALL_PROPERTIES);
      } finally {
        if (!cancelled) setPropertiesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!SUPABASE_ENABLED) return;
    // Use a stable ref to hold cleanup so the return function can call it
    const cleanup = { fn: () => {} };
    getSupabaseClient().then(supabase => {
      const channel = supabase
        .channel("properties-inserts")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "properties" },
          (payload: { new: unknown }) => {
            const newProp = dbRowToProperty(payload.new as DbPropertyRow);
            pendingNewProps.current = [...pendingNewProps.current, newProp];
            setNewListingsCount(c => c + 1);
          }
        )
        .subscribe();
      cleanup.fn = () => { supabase.removeChannel(channel); };
    });
    return () => { cleanup.fn(); };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Close save popover when clicking outside
  useEffect(() => {
    if (!showSavePopover) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowSavePopover(false);
        setSaveError("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showSavePopover]);

  // Compute auto-generated label from current filters
  const computeDefaultLabel = () => {
    const parts: string[] = [];
    if (query.trim()) parts.push(query.trim());
    if (beds !== "any") parts.push(`${beds}+ beds`);
    if (propType !== "any") parts.push(propType);
    if (priceMin) parts.push(`from ${priceMin}`);
    if (priceMax) parts.push(`to ${priceMax}`);
    return parts.length ? parts.join(" · ") : "My Chicago Search";
  };

  const handleOpenSavePopover = () => {
    if (!user) { router.push("/login"); return; }
    setSaveLabel(computeDefaultLabel());
    setSaveError("");
    setShowSavePopover(true);
  };

  const handleSaveSearch = async () => {
    setSaveError("");
    try {
      const res = await fetch("/api/searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: saveLabel,
          price_min: priceMin ? parseInt(priceMin.replace(/\D/g, "")) : null,
          price_max: priceMax ? parseInt(priceMax.replace(/\D/g, "")) : null,
          min_beds: beds !== "any" ? parseInt(beds) : null,
          property_types: propType !== "any" ? [propType] : [],
        }),
      });
      if (!res.ok) {
        const data: unknown = await res.json().catch(() => ({}));
        const message = (data as { error?: string })?.error ?? "Failed to save search";
        setSaveError(message);
        return;
      }
      setShowSavePopover(false);
      setSaveBanner(true);
      setTimeout(() => setSaveBanner(false), 3000);
    } catch {
      setSaveError("Network error — please try again");
    }
  };

  const filteredProperties = properties.filter(p => {
    const min = priceMin ? parseInt(priceMin.replace(/[^0-9]/g, ""), 10) : 0;
    const max = priceMax ? parseInt(priceMax.replace(/[^0-9]/g, ""), 10) : Infinity;
    if (p.price < min || p.price > max) return false;
    if (beds !== "any" && p.beds < parseInt(beds, 10)) return false;
    if (!usingDbProperties && propType !== "any" && p.type !== propType) return false;
    const q = debouncedQuery.trim().toLowerCase();
    if (q) {
      const cityState = `${p.city ?? ""}, ${p.state ?? ""}`.toLowerCase();
      if (!p.address.toLowerCase().includes(q) && !cityState.includes(q)) return false;
    }
    return true;
  });

  const isSaved = (id: string) => user?.savedHomeIds.includes(id) ?? false;

  const toggleSave = (id: string) => {
    if (!user) { router.push("/login"); return; }
    if (!isSaved(id) && user.savedHomeIds.length >= features.savedHomes) {
      router.push("/pricing"); return;
    }
    isSaved(id) ? unsaveHome(id) : saveHome(id);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Search header */}
      <div className="bg-white border-b border-slate-200 pt-20 pb-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="City, ZIP, or address..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              <p className="text-xs text-slate-400 mt-1 pl-1">Showing sample Chicago listings · Enter any property address to build your offer</p>
            </div>
            <div className="flex gap-2">
              <input type="text" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="Min price"
                className="w-full sm:w-28 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <input type="text" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="Max price"
                className="w-full sm:w-28 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
            <div className="relative">
              <select value={beds} onChange={e => setBeds(e.target.value)}
                className="w-full appearance-none pl-4 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                <option value="any">Any beds</option>
                <option value="1">1+ bd</option>
                <option value="2">2+ bd</option>
                <option value="3">3+ bd</option>
                <option value="4">4+ bd</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all bg-white min-h-[44px]">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <div className="relative" ref={popoverRef}>
              <button
                onClick={handleOpenSavePopover}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all bg-white min-h-[44px]"
              >
                <Bookmark className="w-4 h-4" /> Save search
              </button>
              {showSavePopover && (
                <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-slate-200 rounded-xl shadow-lg p-4 w-72">
                  <p className="text-sm font-semibold text-slate-800 mb-2">Save this search</p>
                  <input
                    type="text"
                    value={saveLabel}
                    onChange={e => setSaveLabel(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    placeholder="Search label"
                  />
                  {saveError && (
                    <p className="text-xs text-red-600 mb-2">{saveError}</p>
                  )}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveSearch}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setShowSavePopover(false); setSaveError(""); }}
                      className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-sm min-h-[44px]">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>

          <div className="flex gap-2 mt-3 flex-wrap">
            {["any","Single Family","Condo","Townhouse","Multi-Family"].map(type => (
              <button key={type} onClick={() => setPropType(type)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${propType===type ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"}`}>
                {type==="any" ? "All Types" : type}
              </button>
            ))}
            <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:border-blue-300 transition-all flex items-center gap-1">
              <Filter className="w-3 h-3" /> Open Houses
            </button>
            <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:border-blue-300 transition-all">Price Reduced</button>
          </div>
        </div>
      </div>

      {/* Save search success banner */}
      {saveBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white text-sm font-medium px-6 py-3 rounded-xl shadow-lg">
          Search saved! We&apos;ll find new matches for you.
        </div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searchParams.get("welcome") === "1" && (
          <div style={{background:"var(--blue-light)",border:"1px solid #bfdbfe",borderRadius:12,padding:"16px 20px",marginBottom:24,display:"flex",alignItems:"flex-start",gap:12}}>
            <span style={{fontSize:20}}>🏠</span>
            <div>
              <p style={{fontSize:15,fontWeight:600,color:"var(--blue)",marginBottom:4}}>Welcome to HomeOfferDirect!</p>
              <p style={{fontSize:13,color:"var(--gray-700)",lineHeight:1.6}}>Find a property below to get started on your offer. No agent required.</p>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold text-slate-900">
              {propertiesLoading ? "Loading homes..." : `${filteredProperties.length} homes for sale in Chicago, IL`}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Updated {new Date().toLocaleDateString("en-US",{month:"long",day:"numeric"})}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium text-blue-700">AI insights enabled</span>
            </div>
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Sort: Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>AI Score</option>
            </select>
          </div>
        </div>

        {propertiesLoading ? (
          /* Loading skeleton — 6 placeholder cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
                <div className="h-52 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-2/3" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-10 bg-slate-200 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-500 font-medium">No homes match your filters</p>
                <button onClick={() => { setPriceMin(""); setPriceMax(""); setBeds("any"); setPropType("any"); }}
                  className="mt-3 text-sm text-blue-600 hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              filteredProperties.map(p => (
                <PropertyCard key={p.id} property={p} saved={isSaved(p.id)} onToggleSave={() => toggleSave(p.id)} />
              ))
            )}
          </div>
        )}
      </div>
      {newListingsCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 text-sm font-semibold cursor-pointer"
          onClick={() => {
            setProperties(prev => [...pendingNewProps.current, ...prev]);
            pendingNewProps.current = [];
            setNewListingsCount(0);
          }}>
          <Sparkles className="w-4 h-4" />
          {newListingsCount} new listing{newListingsCount > 1 ? "s" : ""} — click to show
        </div>
      )}
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}

function PropertyCard({ property, saved, onToggleSave }: { property: Property; saved: boolean; onToggleSave: () => void }) {
  const showingMailto = `mailto:${property.agentEmail}?subject=Showing request — ${property.address}&body=Hi ${property.agentName.split(" ")[0]},%0D%0A%0D%0AI'm interested in scheduling a showing for ${property.address}. Please let me know your available times.%0D%0A%0D%0AThank you!`;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group">
      <div className="relative h-52 bg-slate-100 overflow-hidden">
        <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{backgroundImage:`url(${property.photos[0]})`}} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${property.aiColor} backdrop-blur-sm`}>
          <Sparkles className="w-3 h-3" /> {property.aiScore} · {property.aiLabel}
        </div>
        <button onClick={onToggleSave}
          title={saved ? "Remove from saved" : "Save home"}
          aria-label={saved ? `Remove ${property.address} from saved` : `Save ${property.address}`}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${saved ? "bg-red-500 text-white" : "bg-white/90 text-slate-600 hover:bg-white hover:text-red-500"}`}>
          <Heart className={`w-4 h-4 ${saved ? "fill-white" : ""}`} />
        </button>
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
          {property.dom === 1 ? "1 day on market" : `${property.dom} days`}
        </div>
        {property.marketTrend==="hot" && (
          <div className="absolute bottom-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-semibold">Hot Market</div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-2xl font-black text-slate-900">{formatCurrency(property.price)}</p>
            {property.priceChange !== 0 && (
              <div className={`flex items-center gap-1 text-xs font-medium ${property.priceChange<0 ? "text-green-600" : "text-red-500"}`}>
                {property.priceChange<0 ? <TrendingDown className="w-3 h-3"/> : <TrendingUp className="w-3 h-3"/>}
                Price {property.priceChange<0 ? "reduced" : "increased"} {formatCurrency(Math.abs(property.priceChange))}
              </div>
            )}
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{property.type}</span>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <p className="text-sm text-slate-600 truncate">{property.address}, {property.city}, {property.state}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-1"><Bed className="w-4 h-4 text-slate-400"/><span className="font-medium text-slate-700">{property.beds}</span><span className="text-xs ml-0.5">bd</span></div>
          <div className="flex items-center gap-1"><Bath className="w-4 h-4 text-slate-400"/><span className="font-medium text-slate-700">{property.baths}</span><span className="text-xs ml-0.5">ba</span></div>
          <div className="flex items-center gap-1"><Square className="w-4 h-4 text-slate-400"/><span className="font-medium text-slate-700">{property.sqft.toLocaleString()}</span><span className="text-xs ml-0.5">sqft</span></div>
        </div>

        <div className="bg-blue-50 rounded-xl p-3.5 mb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500"/>
            <span className="text-xs font-semibold text-blue-700">AI Suggested Offer Range</span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            {formatCurrency(property.suggestedOffer[0])} – {formatCurrency(property.suggestedOffer[1])}
          </p>
        </div>

        <Link href={`/offer-builder?property=${property.id}`}
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-sm mb-3">
          Make an Offer <Sparkles className="w-4 h-4"/>
        </Link>

        {/* Agent contact */}
        <div className="border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-400 mb-2">
            Listing agent: <span className="text-slate-600 font-medium">{property.agentName}</span>
            <span className="text-slate-300 mx-1">·</span>
            <span>{property.brokerage}</span>
          </p>
          <div className="flex gap-2">
            <a href={`tel:${property.agentPhone.replace(/\D/g,"")}`}
              className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 flex-1 transition-colors">
              <Phone className="w-3 h-3"/> Call
            </a>
            <a href={showingMailto}
              className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 hover:bg-blue-100 flex-1 transition-colors">
              <Mail className="w-3 h-3"/> Schedule showing
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
