"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, Heart, Bed, Bath, Square, Sparkles, ArrowRight, SlidersHorizontal } from "lucide-react";

const PROPERTIES = [
  { id:"1", address:"2847 N Clark St", city:"Chicago", state:"IL", price:485000, beds:3, baths:2, sqft:1850, dom:12, type:"Single Family", aiScore:87, aiLabel:"Great value", reduced:true, reduceAmt:15000, img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&auto=format&fit=crop" },
  { id:"2", address:"1520 W Wrightwood Ave", city:"Chicago", state:"IL", price:625000, beds:4, baths:2.5, sqft:2400, dom:5, type:"Townhouse", aiScore:72, aiLabel:"Competitive", reduced:false, reduceAmt:0, img:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop" },
  { id:"3", address:"4521 N Ashland Ave", city:"Chicago", state:"IL", price:339000, beds:2, baths:1, sqft:1200, dom:28, type:"Condo", aiScore:91, aiLabel:"Best deal", reduced:true, reduceAmt:20000, img:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop" },
  { id:"4", address:"3102 W Belmont Ave", city:"Chicago", state:"IL", price:549000, beds:3, baths:2, sqft:2100, dom:3, type:"Single Family", aiScore:65, aiLabel:"Act fast", reduced:false, reduceAmt:0, img:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop" },
  { id:"5", address:"7845 S Cottage Grove", city:"Chicago", state:"IL", price:229000, beds:3, baths:1.5, sqft:1600, dom:45, type:"Single Family", aiScore:95, aiLabel:"Negotiate!", reduced:true, reduceAmt:25000, img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop" },
  { id:"6", address:"1234 W Fullerton Ave", city:"Chicago", state:"IL", price:795000, beds:4, baths:3, sqft:3200, dom:8, type:"Single Family", aiScore:78, aiLabel:"Well-priced", reduced:false, reduceAmt:0, img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop" },
];

const fmt = (n: number) => "$" + n.toLocaleString();

export default function SearchPage() {
  const [q, setQ] = useState("Chicago, IL");
  const [saved, setSaved] = useState<string[]>([]);
  const toggle = (id: string) => setSaved(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Search bar */}
      <div className="fixed top-14 inset-x-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={q} onChange={e=>setQ(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="City, ZIP, or address" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white hover:bg-gray-50 whitespace-nowrap">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <button className="px-5 py-2.5 brand-gradient text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-16">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">{PROPERTIES.length} homes in <strong className="text-gray-900">Chicago, IL</strong></p>
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Newest</option>
            <option>Price ↑</option>
            <option>Price ↓</option>
            <option>AI Score</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {PROPERTIES.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              {/* Photo */}
              <div className="relative h-44 bg-gray-100">
                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{backgroundImage:`url(${p.img})`}} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {/* AI badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                  <Sparkles className="w-3 h-3 text-blue-500" /> {p.aiScore} · {p.aiLabel}
                </div>
                {/* Save */}
                <button onClick={()=>toggle(p.id)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${saved.includes(p.id) ? "bg-red-500 text-white" : "bg-white/90 text-gray-500 hover:text-red-500"}`}>
                  <Heart className={`w-4 h-4 ${saved.includes(p.id)?"fill-white":""}`} />
                </button>
                {p.reduced && (
                  <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
                    ↓ ${(p.reduceAmt/1000).toFixed(0)}K reduced
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-xl font-bold text-gray-900">{fmt(p.price)}</p>
                <p className="text-sm text-gray-500 mt-0.5 truncate">{p.address}, {p.city}, {p.state}</p>

                <div className="flex items-center gap-3 text-xs text-gray-400 mt-2 mb-4">
                  <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5"/>{p.beds} bd</span>
                  <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5"/>{p.baths} ba</span>
                  <span className="flex items-center gap-1"><Square className="w-3.5 h-3.5"/>{p.sqft.toLocaleString()} sqft</span>
                  <span className="ml-auto">{p.dom}d on market</span>
                </div>

                <Link href={`/offer-builder?property=${p.id}`}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 brand-gradient text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity">
                  Make an offer <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
