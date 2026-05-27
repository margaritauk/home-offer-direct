"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import {
  PlusCircle, FileText, Heart, ChevronRight, Download,
  ArrowRight, Bed, Bath, Phone, Mail, CheckCircle2,
  Circle, Clock, CalendarDays, AlertCircle,
} from "lucide-react";

/* ── Mock data ──────────────────────────────────────────────────────── */
const offers = [
  { id:"1", address:"2847 N Clark St, Chicago, IL", price:492000, list:485000, status:"pending",  label:"Pending review", color:"bg-amber-50 text-amber-700",  date:"May 22, 2026", img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&auto=format&fit=crop" },
  { id:"2", address:"1520 W Wrightwood, Chicago, IL", price:618000, list:625000, status:"draft",   label:"Draft",         color:"bg-gray-100 text-gray-600",    date:"May 20, 2026", img:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&auto=format&fit=crop" },
  { id:"3", address:"900 N Michigan Ave, Chicago, IL", price:380000, list:395000, status:"rejected",label:"Not accepted",  color:"bg-red-50 text-red-600",       date:"May 15, 2026", img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&auto=format&fit=crop" },
];

const saved = [
  {
    id:"1", address:"2847 N Clark St", city:"Chicago, IL", price:485000, beds:3, baths:2, reduced:true,
    img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&auto=format&fit=crop",
    agent:{ name:"Sarah Johnson", company:"Coldwell Banker", phone:"(312) 555-0192", email:"sarah.johnson@coldwellbanker.com" },
  },
  {
    id:"2", address:"4521 N Ashland Ave", city:"Chicago, IL", price:339000, beds:2, baths:1, reduced:false,
    img:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&auto=format&fit=crop",
    agent:{ name:"Mike Torres", company:"Re/Max Chicago", phone:"(312) 555-0847", email:"m.torres@remax.com" },
  },
];

/* ── Journey milestones ─────────────────────────────────────────────── */
type MilestoneStatus = "done" | "active" | "upcoming";
const milestones: { title:string; sub:string; status:MilestoneStatus; date?:string; warn?:boolean }[] = [
  { title:"Get pre-approved",    sub:"Mortgage pre-approval letter obtained",             status:"done",     date:"May 10, 2026" },
  { title:"Find your home",      sub:"2847 N Clark St, Chicago — saved & reviewed",       status:"done",     date:"May 18, 2026" },
  { title:"Make an offer",       sub:"$492,000 offer submitted to listing agent",         status:"done",     date:"May 22, 2026" },
  { title:"Inspection period",   sub:"Schedule your home inspector immediately",          status:"active",   date:"Due Jun 3, 2026",  warn:true },
  { title:"Appraisal",           sub:"Lender orders appraisal — no action needed yet",   status:"upcoming", date:"Due Jun 12, 2026" },
  { title:"Financing approval",  sub:"Receive final loan commitment from your lender",   status:"upcoming", date:"Due Jun 12, 2026" },
  { title:"Final walkthrough",   sub:"Walk through the home 24 hrs before closing",      status:"upcoming", date:"~Jun 20, 2026" },
  { title:"Closing day",         sub:"Sign documents, transfer funds, get your keys",    status:"upcoming", date:"Jun 21, 2026" },
];

const calendarDates = [
  { date:"May 22", label:"Offer accepted",            warn:false },
  { date:"Jun 3",  label:"Inspection deadline",       warn:true  },
  { date:"Jun 12", label:"Appraisal & financing due", warn:true  },
  { date:"Jun 20", label:"Final walkthrough",         warn:false },
  { date:"Jun 21", label:"Closing day",               warn:false },
];

const fmt = (n:number) => "$"+n.toLocaleString();
type Tab = "offers" | "saved" | "journey";

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>("offers");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 pb-16">

        {/* Header */}
        <div className="flex items-center justify-between py-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">1 pending · 1 draft · 2 saved homes</p>
          </div>
          <Link href="/offer-builder"
            className="flex items-center gap-1.5 brand-gradient text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
            <PlusCircle className="w-4 h-4"/> New offer
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: FileText,   label:"Offers",    value:"3" },
            { icon: Heart,      label:"Saved",     value:"2" },
            { icon: ArrowRight, label:"Avg saved",  value:"$14.5K" },
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
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-5 w-fit" data-testid="tabs">
          {(["offers","saved","journey"] as Tab[]).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              data-testid={`tab-${t}`}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${tab===t?"bg-white text-gray-900 shadow-sm":"text-gray-500 hover:text-gray-700"}`}>
              {t==="journey" ? "My Journey" : t}
            </button>
          ))}
        </div>

        {/* ── Offers tab ── */}
        {tab==="offers" && (
          <div className="space-y-3" data-testid="offers-panel">
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

        {/* ── Saved homes tab ── */}
        {tab==="saved" && (
          <div className="space-y-4" data-testid="saved-panel">
            {saved.map(p=>(
              <div key={p.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden" data-testid="saved-home">
                <div className="flex">
                  <div className="relative w-28 sm:w-36 flex-shrink-0">
                    <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:`url(${p.img})`}}/>
                    {p.reduced && <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">Reduced</div>}
                  </div>
                  <div className="flex-1 p-4 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{p.address}</p>
                    <p className="text-xs text-gray-400 mb-1">{p.city}</p>
                    <p className="text-xl font-bold text-gray-900">{fmt(p.price)}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 mb-3">
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5"/>{p.beds} bd</span>
                      <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5"/>{p.baths} ba</span>
                    </div>
                    <Link href={`/offer-builder?property=${p.id}`}
                      className="inline-flex items-center gap-1 py-1.5 px-3 brand-gradient text-white text-xs font-semibold rounded-lg hover:opacity-90">
                      Make an offer <ChevronRight className="w-3 h-3"/>
                    </Link>
                  </div>
                </div>

                {/* Agent contact */}
                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/80">
                  <p className="text-xs text-gray-400 mb-1.5">Listing agent</p>
                  <p className="text-sm font-medium text-gray-900">
                    {p.agent.name} · <span className="text-gray-500 font-normal">{p.agent.company}</span>
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <a
                      href={`tel:${p.agent.phone.replace(/\D/g,"")}`}
                      data-testid="agent-phone"
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-gray-400"/> {p.agent.phone}
                    </a>
                    <a
                      href={`mailto:${p.agent.email}?subject=Showing request — ${p.address}&body=Hi ${p.agent.name.split(" ")[0]},%0D%0A%0D%0AI'm interested in scheduling a showing for ${p.address}. Please let me know your available times.%0D%0A%0D%0AThank you!`}
                      data-testid="agent-email"
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5"/> Schedule showing
                    </a>
                  </div>
                </div>
              </div>
            ))}

            <Link href="/search"
              className="border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 py-8 hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <PlusCircle className="w-5 h-5 text-gray-300 group-hover:text-blue-400"/>
              <p className="text-sm text-gray-400 group-hover:text-blue-600 font-medium">Search more homes</p>
            </Link>
          </div>
        )}

        {/* ── Journey tab ── */}
        {tab==="journey" && (
          <div data-testid="journey-panel">

            {/* Progress summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-900">Your home buying progress</p>
                <span className="text-sm font-bold text-blue-600">3 of 8 complete</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="h-2.5 rounded-full brand-gradient transition-all" style={{width:"37.5%"}}/>
              </div>
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5"/> Next: Schedule your home inspector before Jun 3
              </p>
            </div>

            {/* Milestone list */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-5">
              {milestones.map((m, i) => (
                <div key={i}
                  className={`flex items-start gap-4 px-5 py-4 ${i < milestones.length-1?"border-b border-gray-50":""} ${m.status==="active"?"bg-blue-50/40":""}`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {m.status==="done"
                      ? <CheckCircle2 className="w-5 h-5 text-green-500"/>
                      : m.status==="active"
                        ? <Clock className="w-5 h-5 text-blue-500"/>
                        : <Circle className="w-5 h-5 text-gray-200"/>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-semibold ${m.status==="upcoming"?"text-gray-400":"text-gray-900"}`}>{m.title}</p>
                      {m.status==="active" && <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">In progress</span>}
                    </div>
                    <p className={`text-xs mt-0.5 leading-relaxed ${m.status==="upcoming"?"text-gray-300":"text-gray-500"}`}>{m.sub}</p>
                  </div>
                  {m.date && (
                    <div className="text-right flex-shrink-0">
                      {m.warn && m.status!=="done" && <AlertCircle className="w-3.5 h-3.5 text-amber-500 ml-auto mb-0.5"/>}
                      <p className={`text-xs font-medium whitespace-nowrap ${m.warn&&m.status!=="done"?"text-amber-600":"text-gray-400"}`}>{m.date}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-4 h-4 text-blue-500"/>
                <p className="text-sm font-semibold text-gray-900">Key contract dates</p>
                <span className="text-xs text-gray-400 ml-auto">2847 N Clark St offer</span>
              </div>
              <div className="space-y-0">
                {calendarDates.map((c, i) => (
                  <div key={i} className={`flex items-center gap-4 py-2.5 ${i < calendarDates.length-1?"border-b border-gray-50":""}`}>
                    <div className={`text-sm font-bold w-14 flex-shrink-0 ${c.warn?"text-amber-600":"text-gray-400"}`}>{c.date}</div>
                    <div className="flex items-center gap-2 flex-1">
                      {c.warn && <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0"/>}
                      <p className={`text-sm ${c.warn?"text-amber-700 font-medium":"text-gray-700"}`}>{c.label}</p>
                    </div>
                    {c.warn && (
                      <span className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-medium flex-shrink-0">Deadline</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
