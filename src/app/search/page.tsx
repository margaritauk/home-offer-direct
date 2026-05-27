"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth, useTierFeatures } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/utils";
import {
  Search, SlidersHorizontal, MapPin, Bed, Bath, Square,
  Heart, TrendingDown, TrendingUp, Sparkles, ChevronDown, Filter,
} from "lucide-react";

const sampleProperties = [
  { id:"1", address:"2847 N Clark St", city:"Chicago", state:"IL", zip:"60657", price:485000, beds:3, baths:2, sqft:1850, type:"Single Family", dom:12, priceHistory:"reduced", priceChange:-15000, photos:["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"], aiScore:87, aiLabel:"Great Value", aiColor:"text-emerald-600 bg-emerald-50", suggestedOffer:[475000,492000], marketTrend:"hot", listingAgent:"Sarah Johnson", brokerage:"Coldwell Banker" },
  { id:"2", address:"1520 W Wrightwood Ave", city:"Chicago", state:"IL", zip:"60614", price:625000, beds:4, baths:2.5, sqft:2400, type:"Townhouse", dom:5, priceHistory:"same", priceChange:0, photos:["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"], aiScore:72, aiLabel:"Competitive", aiColor:"text-blue-600 bg-blue-50", suggestedOffer:[618000,635000], marketTrend:"hot", listingAgent:"Michael Chen", brokerage:"Redfin" },
  { id:"3", address:"4521 N Ashland Ave", city:"Chicago", state:"IL", zip:"60640", price:359000, beds:2, baths:1, sqft:1200, type:"Condo", dom:28, priceHistory:"reduced", priceChange:-20000, photos:["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"], aiScore:91, aiLabel:"Best Deal", aiColor:"text-purple-600 bg-purple-50", suggestedOffer:[345000,360000], marketTrend:"cooling", listingAgent:"Amanda Rodriguez", brokerage:"Compass" },
  { id:"4", address:"3102 W Belmont Ave", city:"Chicago", state:"IL", zip:"60618", price:549000, beds:3, baths:2, sqft:2100, type:"Single Family", dom:3, priceHistory:"increased", priceChange:10000, photos:["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800"], aiScore:65, aiLabel:"Act Fast", aiColor:"text-orange-600 bg-orange-50", suggestedOffer:[545000,565000], marketTrend:"hot", listingAgent:"Thomas Burke", brokerage:"Baird & Warner" },
  { id:"5", address:"7845 S Cottage Grove Ave", city:"Chicago", state:"IL", zip:"60619", price:229000, beds:3, baths:1.5, sqft:1600, type:"Single Family", dom:45, priceHistory:"reduced", priceChange:-25000, photos:["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"], aiScore:95, aiLabel:"Negotiate!", aiColor:"text-green-600 bg-green-50", suggestedOffer:[210000,225000], marketTrend:"cooling", listingAgent:"Patricia Williams", brokerage:"Century 21" },
  { id:"6", address:"1234 W Fullerton Ave", city:"Chicago", state:"IL", zip:"60614", price:795000, beds:4, baths:3, sqft:3200, type:"Single Family", dom:8, priceHistory:"same", priceChange:0, photos:["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"], aiScore:78, aiLabel:"Well-Priced", aiColor:"text-blue-600 bg-blue-50", suggestedOffer:[785000,810000], marketTrend:"hot", listingAgent:"Jennifer Davis", brokerage:"Jameson Sotheby's" },
];

export default function SearchPage() {
  const router = useRouter();
  const { user, saveHome, unsaveHome } = useAuth();
  const features = useTierFeatures();
  const [query, setQuery] = useState("Chicago, IL");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [beds, setBeds] = useState("any");
  const [propType, setPropType] = useState("any");

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
            </div>
            <div className="flex gap-2">
              <input type="text" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="Min price"
                className="w-28 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <input type="text" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="Max price"
                className="w-28 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
            <div className="relative">
              <select value={beds} onChange={e => setBeds(e.target.value)}
                className="appearance-none pl-4 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                <option value="any">Any beds</option>
                <option value="1">1+ bd</option>
                <option value="2">2+ bd</option>
                <option value="3">3+ bd</option>
                <option value="4">4+ bd</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all bg-white">
              <SlidersHorizontal className="w-4 h-4" /> More Filters
            </button>
            <button className="flex items-center gap-2 gradient-bg text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-sm">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>

          <div className="flex gap-2 mt-3 flex-wrap">
            {["any","Single Family","Condo","Townhouse","Multi-Family"].map(type => (
              <button key={type} onClick={() => setPropType(type)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${propType===type ? "gradient-bg text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"}`}>
                {type==="any" ? "All Types" : type}
              </button>
            ))}
            <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:border-blue-300 transition-all flex items-center gap-1">
              <Filter className="w-3 h-3" /> Open Houses
            </button>
            <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:border-blue-300 transition-all">No HOA</button>
            <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:border-blue-300 transition-all">Price Reduced</button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{sampleProperties.length} homes for sale in Chicago, IL</h1>
            <p className="text-sm text-slate-500 mt-0.5">Updated {new Date().toLocaleDateString("en-US",{month:"long",day:"numeric"})}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {sampleProperties.map(p => (
            <PropertyCard key={p.id} property={p} saved={isSaved(p.id)} onToggleSave={() => toggleSave(p.id)} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

interface Property {
  id: string; address: string; city: string; state: string; zip: string;
  price: number; beds: number; baths: number; sqft: number; type: string;
  dom: number; priceHistory: string; priceChange: number; photos: string[];
  aiScore: number; aiLabel: string; aiColor: string; suggestedOffer: number[];
  marketTrend: string; listingAgent: string; brokerage: string;
}

function PropertyCard({ property, saved, onToggleSave }: { property: Property; saved: boolean; onToggleSave: () => void }) {
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
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${saved ? "bg-red-500 text-white" : "bg-white/90 text-slate-600 hover:bg-white hover:text-red-500"}`}>
          <Heart className={`w-4 h-4 ${saved ? "fill-white" : ""}`} />
        </button>
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
          {property.dom === 1 ? "1 day on market" : `${property.dom} days on market`}
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
          <p className="text-sm text-slate-700 truncate">{property.address}, {property.city}, {property.state} {property.zip}</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-1"><Bed className="w-4 h-4 text-slate-400"/><span className="font-medium">{property.beds}</span><span className="text-slate-400 text-xs">bd</span></div>
          <div className="flex items-center gap-1"><Bath className="w-4 h-4 text-slate-400"/><span className="font-medium">{property.baths}</span><span className="text-slate-400 text-xs">ba</span></div>
          <div className="flex items-center gap-1"><Square className="w-4 h-4 text-slate-400"/><span className="font-medium">{property.sqft.toLocaleString()}</span><span className="text-slate-400 text-xs">sqft</span></div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500"/>
            <span className="text-xs font-semibold text-blue-700">AI Suggested Offer Range</span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            {formatCurrency(property.suggestedOffer[0])} – {formatCurrency(property.suggestedOffer[1])}
          </p>
        </div>
        <Link href={`/offer-builder?property=${property.id}`}
          className="flex items-center justify-center gap-2 w-full gradient-bg text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all text-sm shadow-sm">
          Make an Offer <Sparkles className="w-4 h-4"/>
        </Link>
      </div>
    </div>
  );
}
