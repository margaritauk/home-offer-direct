"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { PlusCircle, FileText, Heart, ChevronRight, Download, ArrowRight, Bed, Bath } from "lucide-react";

const offers = [
  { id:"1", address:"2847 N Clark St, Chicago, IL", price:492000, list:485000, status:"pending",  label:"Pending review", color:"bg-amber-50 text-amber-700",  date:"May 22, 2026", img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&auto=format&fit=crop" },
  { id:"2", address:"1520 W Wrightwood, Chicago, IL", price:618000, list:625000, status:"draft",   label:"Draft",         color:"bg-gray-100 text-gray-600",    date:"May 20, 2026", img:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&auto=format&fit=crop" },
  { id:"3", address:"900 N Michigan Ave, Chicago, IL", price:380000, list:395000, status:"rejected",label:"Not accepted",  color:"bg-red-50 text-red-600",       date:"May 15, 2026", img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&auto=format&fit=crop" },
];

const saved = [
  { id:"1", address:"2847 N Clark St", city:"Chicago, IL", price:485000, beds:3, baths:2, reduced:true,  img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&auto=format&fit=crop" },
  { id:"3", address:"4521 N Ashland Ave", city:"Chicago, IL", price:339000, beds:2, baths:1, reduced:false, img:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop" },
];

const fmt = (n:number) => "$"+n.toLocaleString();

export default function Dashboard() {
  const [tab, setTab] = useState<"offers"|"saved">("offers");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-16">

        {/* Header */}
        <div className="flex items-center justify-between py-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">1 pending · 1 draft</p>
          </div>
          <Link href="/search"
            className="flex items-center gap-1.5 brand-gradient text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
            <PlusCircle className="w-4 h-4"/> New offer
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: FileText, label:"Offers", value:"3" },
            { icon: Heart,    label:"Saved",  value:"2" },
            { icon: ArrowRight,label:"Saved",  value:"$14.5K", sub:"vs agent fees" },
          ].map((s,i)=>{
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <Icon className="w-5 h-5 text-blue-500 mx-auto mb-1.5"/>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-5 w-fit">
          {(["offers","saved"] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-5 py-2 rounded-md text-sm font-medium capitalize transition-all ${tab===t?"bg-white text-gray-900 shadow-sm":"text-gray-500 hover:text-gray-700"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab==="offers" && (
          <div className="space-y-3">
            {offers.map(o=>(
              <div key={o.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-cover bg-center flex-shrink-0"
                  style={{backgroundImage:`url(${o.img})`}}/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{o.address}</p>
                  <p className="text-lg font-bold text-gray-900">{fmt(o.price)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${o.color}`}>{o.label}</span>
                    <span className="text-xs text-gray-400">{o.date}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {o.status==="draft" && (
                    <Link href="/offer-builder" className="text-xs px-3 py-1.5 brand-gradient text-white rounded-lg font-medium">
                      Continue
                    </Link>
                  )}
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg">
                    <Download className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==="saved" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {saved.map(p=>(
              <div key={p.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-36">
                  <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:`url(${p.img})`}}/>
                  {p.reduced&&<div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded font-medium">Price reduced</div>}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-900 text-sm truncate">{p.address}</p>
                  <p className="text-xs text-gray-400 mb-2">{p.city}</p>
                  <p className="text-xl font-bold text-gray-900 mb-2">{fmt(p.price)}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5"/>{p.beds} bd</span>
                    <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5"/>{p.baths} ba</span>
                  </div>
                  <Link href={`/offer-builder?property=${p.id}`}
                    className="flex items-center justify-center gap-1 w-full py-2 brand-gradient text-white text-xs font-semibold rounded-lg hover:opacity-90">
                    Make an offer <ChevronRight className="w-3 h-3"/>
                  </Link>
                </div>
              </div>
            ))}
            <Link href="/search"
              className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center min-h-[220px] hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <PlusCircle className="w-8 h-8 text-gray-300 group-hover:text-blue-400 mb-2 transition-colors"/>
              <p className="text-sm text-gray-400 group-hover:text-blue-600 transition-colors font-medium">Search more homes</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
