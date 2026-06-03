"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { useAuth, useTierFeatures } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/utils";
import { ALL_PROPERTIES } from "@/lib/properties";
import {
  FileText, Send, Clock, PlusCircle, Bell, TrendingUp,
  DollarSign, Download, MessageSquare, Bed, Bath,
  ChevronRight, Sparkles, Heart, MapPin, Lock,
  CheckCircle2, Circle, CalendarDays, AlertCircle, ArrowRight, Phone, Mail,
} from "lucide-react";

/* ── Journey milestones ─────────────────────────────────────────── */
type MilestoneStatus = "done" | "active" | "upcoming";
const MILESTONES: { title:string; sub:string; status:MilestoneStatus; date?:string; warn?:boolean }[] = [
  { title:"Get pre-approved",   sub:"Mortgage pre-approval letter obtained",           status:"done",     date:"May 10, 2026" },
  { title:"Find your home",     sub:"2847 N Clark St, Chicago — saved & reviewed",     status:"done",     date:"May 18, 2026" },
  { title:"Make an offer",      sub:"$492,000 offer submitted to listing agent",       status:"done",     date:"May 22, 2026" },
  { title:"Inspection period",  sub:"Schedule your home inspector immediately",        status:"active",   date:"Due Jun 3, 2026", warn:true },
  { title:"Appraisal",          sub:"Lender orders appraisal — no action needed yet", status:"upcoming", date:"Due Jun 12, 2026" },
  { title:"Financing approval", sub:"Receive final loan commitment from lender",       status:"upcoming", date:"Due Jun 12, 2026" },
  { title:"Final walkthrough",  sub:"Walk through the home 24 hrs before closing",    status:"upcoming", date:"~Jun 20, 2026" },
  { title:"Closing day",        sub:"Sign documents, transfer funds, get keys",        status:"upcoming", date:"Jun 21, 2026" },
];
const CALENDAR_DATES = [
  { date:"May 22", label:"Offer accepted",            warn:false },
  { date:"Jun 3",  label:"Inspection deadline",       warn:true  },
  { date:"Jun 12", label:"Appraisal & financing due", warn:true  },
  { date:"Jun 20", label:"Final walkthrough",         warn:false },
  { date:"Jun 21", label:"Closing day",               warn:false },
];

const STATUS_COLOR: Record<string, string> = {
  pending:  "text-amber-700 bg-amber-50",
  draft:    "text-slate-600 bg-slate-100",
  accepted: "text-green-700 bg-green-50",
  rejected: "text-red-600 bg-red-50",
};

type Tab = "overview" | "offers" | "saved" | "journey";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const features = useTierFeatures();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    );
  }

  const savedHomes = ALL_PROPERTIES.filter(p => user.savedHomeIds.includes(p.id));
  const pendingCount = user.offers.filter(o => o.status === "pending").length;
  const draftCount   = user.offers.filter(o => o.status === "draft").length;
  const totalSaved   = user.offers.reduce((acc, o) => {
    if (o.status !== "rejected" && o.status !== "draft") return acc + Math.max(0, o.listPrice - o.price);
    return acc;
  }, 0);

  const headerSub = [
    pendingCount && `${pendingCount} pending offer${pendingCount > 1 ? "s" : ""}`,
    draftCount && `${draftCount} draft${draftCount > 1 ? "s" : ""} in progress`,
  ].filter(Boolean).join(" · ") || "No active offers";

  const stats = [
    {
      icon: FileText,
      label: "Total Offers",
      value: user.offers.length > 0 ? String(user.offers.length) : "—",
      sub: user.offers.length > 0 ? `${pendingCount} pending` : "Start your first offer",
    },
    {
      icon: Send,
      label: "Submitted",
      value: user.offers.filter(o => o.status !== "draft").length > 0
        ? String(user.offers.filter(o => o.status !== "draft").length)
        : "—",
      sub: pendingCount > 0 ? `${pendingCount} awaiting response` : "None submitted yet",
    },
    {
      icon: Heart,
      label: "Saved Homes",
      value: savedHomes.length > 0 ? String(savedHomes.length) : "—",
      sub: savedHomes.filter(p => p.reduced).length > 0
        ? `${savedHomes.filter(p => p.reduced).length} price reduced`
        : savedHomes.length === 0 ? "Browse homes to save" : "No reductions yet",
    },
    {
      icon: DollarSign,
      label: "Potential Savings",
      value: totalSaved > 0 ? `$${(totalSaved / 1000).toFixed(1)}K` : "—",
      sub: totalSaved > 0 ? "vs list price" : "Make offers to see savings",
    },
  ];

  const AI_RECS = pendingCount > 0 ? [
    { icon: Bell,      color:"text-blue-600 bg-blue-50",   title:"Follow up on your pending offer", desc:`Your offer was submitted a few days ago. Consider following up with the listing agent today.`, action:"Send Follow-up" },
    { icon: TrendingUp, color:"text-purple-600 bg-purple-50", title:"Improve negotiation position", desc:"Add an escalation clause to your offer to stay competitive without overpaying.", action:"Improve Offer" },
  ] : [
    { icon: Sparkles, color:"text-emerald-600 bg-emerald-50", title:"Start your first offer", desc:"Browse listings and build a professional offer in under 30 minutes.", action:"Browse Homes" },
    { icon: Heart,    color:"text-red-600 bg-red-50",         title:"Save homes you like", desc:"Heart homes while browsing to track them and contact agents directly.", action:"Browse Homes" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">

        {/* Welcome header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="text-slate-500 mt-2">{headerSub}</p>
          </div>
          <Link href="/offer-builder"
            className="flex items-center gap-2 gradient-bg text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-sm text-sm">
            <PlusCircle className="w-4 h-4" /> New Offer
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {stats.map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 mb-2">{value}</p>
              <p className="text-sm font-medium text-slate-700">{label}</p>
              <p className="text-xs text-slate-400 mt-2">{sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-8 w-fit" data-testid="tabs">
          {(["overview","offers","saved","journey"] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              data-testid={`tab-${tab}`}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium capitalize transition-all flex items-center gap-1.5 ${activeTab===tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {tab==="journey" && !features.journeyTracker && <Lock className="w-3 h-3"/>}
              {tab==="journey" ? "My Journey" : tab}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeTab==="overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Recent Offers</h2>
                <button onClick={() => setActiveTab("offers")}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              {user.offers.length === 0 ? (
                <div className="p-14 text-center">
                  <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3"/>
                  <p className="text-sm font-medium text-slate-500">No offers yet</p>
                  <Link href="/offer-builder" className="inline-flex items-center gap-1.5 mt-4 text-sm text-blue-600 font-semibold hover:underline">
                    Build your first offer <ArrowRight className="w-3.5 h-3.5"/>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100" data-testid="offers-panel">
                  {user.offers.slice(0, 3).map(o => (
                    <div key={o.id} className="p-6 flex items-center gap-5 hover:bg-slate-50 transition-colors">
                      <div className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0"
                        style={{backgroundImage:`url(${o.img})`}}/>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{o.address}</p>
                        <p className="text-lg font-black text-slate-900">{formatCurrency(o.price)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[o.status]}`}>{o.label}</span>
                          <span className="text-xs text-slate-400">{o.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {o.status==="draft" && (
                          <Link href="/offer-builder"
                            className="text-xs px-3 py-1.5 gradient-bg text-white rounded-lg font-medium hover:opacity-90">
                            Continue
                          </Link>
                        )}
                        {features.pdfDownload ? (
                          <button title="Download PDF" className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <Link href="/pricing" title="Upgrade to download PDF"
                            className="p-1.5 bg-slate-50 text-slate-300 border border-slate-100 rounded-lg hover:border-blue-200 hover:text-blue-400 transition-colors">
                            <Lock className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="px-8 py-5 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">AI Recommendations</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {AI_RECS.map(rec => {
                  const Icon = rec.icon;
                  return (
                    <div key={rec.title} className="p-7">
                      <div className={`w-9 h-9 ${rec.color} rounded-xl flex items-center justify-center mb-5`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-2">{rec.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">{rec.desc}</p>
                      <Link href={rec.action === "Browse Homes" ? "/search" : "/offer-builder"}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        {rec.action} <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Offers tab ── */}
        {activeTab==="offers" && (
          <div className="space-y-6" data-testid="offers-panel">
            {user.offers.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3"/>
                <p className="text-sm font-medium text-slate-500">No offers yet</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">Start by browsing homes or building an offer directly</p>
                <Link href="/offer-builder" className="inline-flex items-center gap-1.5 gradient-bg text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90">
                  Build your first offer <ArrowRight className="w-4 h-4"/>
                </Link>
              </div>
            ) : (
              (["pending","draft","accepted","rejected"] as const).map(status => {
                const group = user.offers.filter(o => o.status === status);
                if (!group.length) return null;
                const statusLabel = { pending:"Pending", draft:"Draft", accepted:"Accepted", rejected:"Not Accepted" }[status];
                return (
                  <div key={status}>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">{statusLabel}</h3>
                    <div className="space-y-4">
                      {group.map(offer => (
                        <div key={offer.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex items-center gap-6">
                          <div className="w-20 h-20 rounded-xl bg-cover bg-center flex-shrink-0"
                            style={{backgroundImage:`url(${offer.img})`}}/>
                          <div className="flex-1">
                            <div className="flex items-start justify-between flex-wrap gap-2">
                              <div>
                                <p className="font-semibold text-slate-900">{offer.address}</p>
                                <p className="text-2xl font-black text-slate-900">{formatCurrency(offer.price)}</p>
                                <p className="text-sm text-slate-500">List price: {formatCurrency(offer.listPrice)}</p>
                              </div>
                              <div className="text-right">
                                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLOR[offer.status]}`}>
                                  {offer.label}
                                </span>
                                <p className="text-xs text-slate-400 mt-1">{offer.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mt-6 flex-wrap">
                              {offer.status==="draft" && (
                                <Link href="/offer-builder"
                                  className="flex items-center gap-1.5 text-sm px-5 py-2.5 gradient-bg text-white rounded-xl font-semibold hover:opacity-90">
                                  <FileText className="w-4 h-4"/> Continue Offer
                                </Link>
                              )}
                              {offer.status==="pending" && (
                                <button className="flex items-center gap-1.5 text-sm px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100">
                                  <MessageSquare className="w-4 h-4"/> Follow Up
                                </button>
                              )}
                              {offer.status==="rejected" && (
                                <Link href="/offer-builder"
                                  className="flex items-center gap-1.5 text-sm px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200">
                                  <PlusCircle className="w-4 h-4"/> New Offer on This Property
                                </Link>
                              )}
                              {features.pdfDownload ? (
                                <button className="flex items-center gap-1.5 text-sm px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50">
                                  <Download className="w-4 h-4"/> Download
                                </button>
                              ) : (
                                <Link href="/pricing"
                                  className="flex items-center gap-1.5 text-sm px-4 py-2 border border-slate-100 text-slate-400 rounded-xl font-medium hover:border-blue-200 hover:text-blue-600">
                                  <Lock className="w-4 h-4"/> Download (upgrade)
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}

            {user.offers.length >= features.maxOffers && (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-5">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0"/>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">You&apos;ve reached your offer limit</p>
                  <p className="text-xs text-amber-600 mt-0.5">Upgrade your plan to create more offers.</p>
                </div>
                <Link href="/pricing" className="text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap">Upgrade</Link>
              </div>
            )}
          </div>
        )}

        {/* ── Saved tab ── */}
        {activeTab==="saved" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="saved-panel">
            {savedHomes.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                <Heart className="w-10 h-10 text-slate-200 mx-auto mb-3"/>
                <p className="text-sm font-medium text-slate-500">No saved homes yet</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">Browse listings and tap the heart to save homes you like</p>
                <Link href="/search" className="inline-flex items-center gap-1.5 gradient-bg text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90">
                  Browse homes <ArrowRight className="w-4 h-4"/>
                </Link>
              </div>
            ) : (
              <>
                {savedHomes.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all" data-testid="saved-home">
                    <div className="h-48 bg-cover bg-center relative" style={{backgroundImage:`url(${p.img})`}}>
                      {p.reduced && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">Price Reduced!</div>
                      )}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        <Sparkles className="w-3 h-3"/> {p.aiScore}
                      </div>
                    </div>
                    <div className="p-7">
                      <p className="font-semibold text-slate-900">{p.address}</p>
                      <div className="flex items-center gap-1 text-slate-500 text-xs mb-4">
                        <MapPin className="w-3 h-3"/> {p.city}, {p.state}
                      </div>
                      <p className="text-2xl font-black text-slate-900 mb-5">{formatCurrency(p.price)}</p>
                      <div className="flex items-center gap-3 text-sm text-slate-600 mb-6">
                        <span className="flex items-center gap-1"><Bed className="w-4 h-4"/>{p.beds} bd</span>
                        <span className="flex items-center gap-1"><Bath className="w-4 h-4"/>{p.baths} ba</span>
                      </div>
                      <Link href={`/offer-builder?property=${p.id}`}
                        className="w-full flex items-center justify-center gap-2 gradient-bg text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all text-sm">
                        Make an Offer <ChevronRight className="w-4 h-4"/>
                      </Link>
                    </div>
                    <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/80">
                      <p className="text-xs text-slate-400 mb-2">Listing agent</p>
                      <p className="text-sm font-medium text-slate-900">
                        {p.agentName} · <span className="text-slate-500 font-normal">{p.brokerage}</span>
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <a href={`tel:${p.agentPhone.replace(/\D/g,"")}`}
                          data-testid="agent-phone"
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors">
                          <Phone className="w-3.5 h-3.5 text-slate-400"/> {p.agentPhone}
                        </a>
                        <a href={`mailto:${p.agentEmail}?subject=Showing request — ${p.address}&body=Hi ${p.agentName.split(" ")[0]},%0D%0A%0D%0AI'm interested in scheduling a showing for ${p.address}. Please let me know your available times.%0D%0A%0D%0AThank you!`}
                          data-testid="agent-email"
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors">
                          <Mail className="w-3.5 h-3.5"/> Schedule showing
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/search"
                  className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 hover:border-blue-300 hover:bg-blue-50 transition-all min-h-[300px] group">
                  <PlusCircle className="w-10 h-10 text-slate-300 group-hover:text-blue-400 mb-3 transition-colors"/>
                  <p className="font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">Search More Properties</p>
                  <p className="text-sm text-slate-400 mt-1">Find your next opportunity</p>
                </Link>
              </>
            )}
          </div>
        )}

        {/* ── Journey tab ── */}
        {activeTab==="journey" && (
          features.journeyTracker ? (
            <div data-testid="journey-panel">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 mb-7">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-slate-900">Your home buying progress</p>
                  <span className="text-sm font-bold text-blue-600">3 of 8 complete</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="h-2.5 rounded-full gradient-bg transition-all" style={{width:"37.5%"}}/>
                </div>
                <p className="text-xs text-amber-600 mt-3 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5"/> Next: Schedule your home inspector before Jun 3
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-7">
                {MILESTONES.map((m, i) => (
                  <div key={i}
                    className={`flex items-start gap-5 px-7 py-5 ${i < MILESTONES.length-1 ? "border-b border-slate-50" : ""} ${m.status==="active" ? "bg-blue-50/40" : ""}`}>
                    <div className="mt-0.5 flex-shrink-0">
                      {m.status==="done" ? <CheckCircle2 className="w-5 h-5 text-green-500"/>
                        : m.status==="active" ? <Clock className="w-5 h-5 text-blue-500"/>
                        : <Circle className="w-5 h-5 text-slate-200"/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-semibold ${m.status==="upcoming" ? "text-slate-400" : "text-slate-900"}`}>{m.title}</p>
                        {m.status==="active" && <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">In progress</span>}
                      </div>
                      <p className={`text-xs mt-0.5 leading-relaxed ${m.status==="upcoming" ? "text-slate-300" : "text-slate-500"}`}>{m.sub}</p>
                    </div>
                    {m.date && (
                      <div className="text-right flex-shrink-0">
                        {m.warn && m.status!=="done" && <AlertCircle className="w-3.5 h-3.5 text-amber-500 ml-auto mb-0.5"/>}
                        <p className={`text-xs font-medium whitespace-nowrap ${m.warn&&m.status!=="done" ? "text-amber-600" : "text-slate-400"}`}>{m.date}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
                <div className="flex items-center gap-2 mb-6">
                  <CalendarDays className="w-4 h-4 text-blue-500"/>
                  <p className="text-sm font-semibold text-slate-900">Key contract dates</p>
                  <span className="text-xs text-slate-400 ml-auto">2847 N Clark St offer</span>
                </div>
                {CALENDAR_DATES.map((c, i) => (
                  <div key={i} className={`flex items-center gap-4 py-3.5 ${i < CALENDAR_DATES.length-1 ? "border-b border-slate-50" : ""}`}>
                    <div className={`text-sm font-bold w-14 flex-shrink-0 ${c.warn ? "text-amber-600" : "text-slate-400"}`}>{c.date}</div>
                    <div className="flex items-center gap-2 flex-1">
                      {c.warn && <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0"/>}
                      <p className={`text-sm ${c.warn ? "text-amber-700 font-medium" : "text-slate-700"}`}>{c.label}</p>
                    </div>
                    {c.warn && <span className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-medium flex-shrink-0">Deadline</span>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div data-testid="journey-panel" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-14 text-center">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-6 h-6 text-blue-400"/>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Journey Tracker is a Basic feature</h3>
              <p className="text-sm text-slate-500 mb-8 max-w-xs mx-auto">
                Track your milestones, key deadlines, and closing date in one place. Upgrade to unlock.
              </p>
              <Link href="/pricing"
                className="inline-flex items-center gap-2 gradient-bg text-white font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
                Upgrade to Basic — $29 <ArrowRight className="w-4 h-4"/>
              </Link>
              <p className="text-xs text-slate-400 mt-3">One-time purchase · No subscription</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
