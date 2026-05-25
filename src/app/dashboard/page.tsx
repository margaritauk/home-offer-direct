"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import {
  Home,
  FileText,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
  Bell,
  TrendingUp,
  DollarSign,
  Eye,
  Download,
  MessageSquare,
  MapPin,
  Bed,
  Bath,
  ChevronRight,
  Sparkles,
  Heart,
  Calendar,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const savedProperties = [
  {
    id: "1",
    address: "2847 N Clark St",
    city: "Chicago, IL",
    price: 485000,
    beds: 3,
    baths: 2,
    dom: 12,
    aiScore: 87,
    photo: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400",
    status: "active",
    priceReduced: false,
  },
  {
    id: "2",
    address: "4521 N Ashland Ave",
    city: "Chicago, IL",
    price: 339000,
    beds: 2,
    baths: 1,
    dom: 28,
    aiScore: 91,
    photo: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
    status: "active",
    priceReduced: true,
  },
];

const offers = [
  {
    id: "1",
    address: "2847 N Clark St, Chicago, IL",
    price: 492000,
    listPrice: 485000,
    status: "pending",
    statusLabel: "Pending",
    statusColor: "text-amber-600 bg-amber-50",
    date: "May 22, 2026",
    expiresIn: "2 days",
    photo: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400",
    type: "Full Offer",
    agent: "Sarah Johnson",
  },
  {
    id: "2",
    address: "1520 W Wrightwood Ave, Chicago, IL",
    price: 618000,
    listPrice: 625000,
    status: "draft",
    statusLabel: "Draft",
    statusColor: "text-slate-600 bg-slate-100",
    date: "May 20, 2026",
    expiresIn: null,
    photo: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400",
    type: "Full Offer",
    agent: "Michael Chen",
  },
  {
    id: "3",
    address: "900 N Michigan Ave #1402, Chicago, IL",
    price: 380000,
    listPrice: 395000,
    status: "rejected",
    statusLabel: "Not Accepted",
    statusColor: "text-red-600 bg-red-50",
    date: "May 15, 2026",
    expiresIn: null,
    photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
    type: "Full Offer",
    agent: "Linda Park",
  },
];

const recommendations = [
  {
    icon: Bell,
    color: "text-blue-600 bg-blue-50",
    title: "Follow up on your pending offer",
    desc: "Your offer on 2847 N Clark St was submitted 3 days ago. Consider following up with the listing agent today.",
    action: "Send Follow-up",
  },
  {
    icon: TrendingUp,
    color: "text-purple-600 bg-purple-50",
    title: "Price reduced on saved property",
    desc: "4521 N Ashland Ave dropped by $20,000. This is a great time to make an offer!",
    action: "Make Offer Now",
  },
  {
    icon: Sparkles,
    color: "text-emerald-600 bg-emerald-50",
    title: "Strengthen your draft offer",
    desc: "Your draft offer on Wrightwood Ave could be improved with an escalation clause.",
    action: "Improve Offer",
  },
];

const stats = [
  { icon: FileText, label: "Total Offers", value: "3", sub: "1 active" },
  { icon: Send, label: "Submitted", value: "2", sub: "1 pending" },
  { icon: Heart, label: "Saved Homes", value: "2", sub: "1 price reduced" },
  { icon: DollarSign, label: "Potential Savings", value: "$14.5K", sub: "vs agent fees" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "offers" | "saved">("overview");

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Welcome header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, Jennifer 👋
            </h1>
            <p className="text-slate-500 mt-0.5">
              You have 1 pending offer and 1 draft waiting.
            </p>
          </div>
          <Link
            href="/search"
            className="flex items-center gap-2 gradient-bg text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-sm text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            New Offer
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 mb-0.5">{value}</p>
              <p className="text-sm font-medium text-slate-700">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
          {(["overview", "offers", "saved"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent offers */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Recent Offers</h2>
                <button
                  onClick={() => setActiveTab("offers")}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {offers.map((offer) => (
                  <div key={offer.id} className="p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div
                      className="w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${offer.photo})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{offer.address}</p>
                      <p className="text-lg font-black text-slate-900">{formatCurrency(offer.price)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${offer.statusColor}`}>
                          {offer.statusLabel}
                        </span>
                        <span className="text-xs text-slate-400">{offer.date}</span>
                        {offer.expiresIn && (
                          <span className="text-xs text-amber-600 font-medium">
                            Expires in {offer.expiresIn}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {offer.status === "draft" && (
                        <Link
                          href="/offer-builder"
                          className="text-xs px-3 py-1.5 gradient-bg text-white rounded-lg font-medium hover:opacity-90"
                        >
                          Continue
                        </Link>
                      )}
                      {offer.status === "pending" && (
                        <button className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">AI Recommendations</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {recommendations.map((rec) => {
                  const Icon = rec.icon;
                  return (
                    <div key={rec.title} className="p-5">
                      <div className={`w-9 h-9 ${rec.color} rounded-xl flex items-center justify-center mb-3`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">{rec.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">{rec.desc}</p>
                      <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        {rec.action} <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "offers" && (
          <div className="space-y-4">
            {["pending", "draft", "rejected"].map((status) => {
              const statusOffers = offers.filter((o) => o.status === status);
              if (!statusOffers.length) return null;
              return (
                <div key={status}>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 capitalize">
                    {status === "rejected" ? "Not Accepted" : status}
                  </h3>
                  <div className="space-y-3">
                    {statusOffers.map((offer) => (
                      <div key={offer.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-6">
                        <div
                          className="w-20 h-20 rounded-xl bg-cover bg-center flex-shrink-0"
                          style={{ backgroundImage: `url(${offer.photo})` }}
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-slate-900">{offer.address}</p>
                              <p className="text-2xl font-black text-slate-900">{formatCurrency(offer.price)}</p>
                              <p className="text-sm text-slate-500">
                                List price: {formatCurrency(offer.listPrice)} · Agent: {offer.agent}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${offer.statusColor}`}>
                                {offer.statusLabel}
                              </span>
                              <p className="text-xs text-slate-400 mt-1">{offer.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-4">
                            {offer.status === "draft" && (
                              <Link
                                href="/offer-builder"
                                className="flex items-center gap-1.5 text-sm px-4 py-2 gradient-bg text-white rounded-xl font-semibold hover:opacity-90"
                              >
                                <FileText className="w-4 h-4" />
                                Continue Offer
                              </Link>
                            )}
                            {offer.status === "pending" && (
                              <button className="flex items-center gap-1.5 text-sm px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100">
                                <MessageSquare className="w-4 h-4" />
                                Follow Up
                              </button>
                            )}
                            {offer.status === "rejected" && (
                              <Link
                                href="/offer-builder"
                                className="flex items-center gap-1.5 text-sm px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200"
                              >
                                <PlusCircle className="w-4 h-4" />
                                New Offer on This Property
                              </Link>
                            )}
                            <button className="flex items-center gap-1.5 text-sm px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50">
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "saved" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((prop) => (
              <div key={prop.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all">
                <div
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${prop.photo})` }}
                >
                  {prop.priceReduced && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                      Price Reduced!
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    {prop.aiScore}
                  </div>
                </div>
                <div className="p-5">
                  <p className="font-semibold text-slate-900">{prop.address}</p>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
                    <MapPin className="w-3 h-3" />
                    {prop.city}
                  </div>
                  <p className="text-2xl font-black text-slate-900 mb-3">{formatCurrency(prop.price)}</p>
                  <div className="flex items-center gap-3 text-sm text-slate-600 mb-4">
                    <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{prop.beds}</span>
                    <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{prop.baths}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{prop.dom}d</span>
                  </div>
                  <Link
                    href={`/offer-builder?property=${prop.id}`}
                    className="w-full flex items-center justify-center gap-2 gradient-bg text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition-all text-sm"
                  >
                    Make an Offer
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}

            <Link
              href="/search"
              className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 hover:border-blue-300 hover:bg-blue-50 transition-all min-h-[300px] group"
            >
              <PlusCircle className="w-10 h-10 text-slate-300 group-hover:text-blue-400 mb-3 transition-colors" />
              <p className="font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                Search More Properties
              </p>
              <p className="text-sm text-slate-400 mt-1">Find your next opportunity</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
