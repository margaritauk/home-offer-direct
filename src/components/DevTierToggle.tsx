"use client";
import { useState } from "react";
import { useAuth, TIER_FEATURES, type Tier } from "@/lib/auth-context";
import { FlaskConical, ChevronUp, ChevronDown, LogOut } from "lucide-react";

const TEST = [
  { email:"free@test.com",    label:"Alex Chen",     tier:"Free"    },
  { email:"basic@test.com",   label:"Sam Rivera",    tier:"Basic"   },
  { email:"premium@test.com", label:"Jordan Taylor", tier:"Premium" },
];
const TIERS: Tier[] = ["free","basic","premium","pro"];

export default function DevTierToggle() {
  const [open, setOpen] = useState(false);
  const { user, login, logout, setUserTier } = useAuth();

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999]" style={{fontFamily:"inherit"}}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl shadow-lg transition-colors"
        style={{background:"#111827",color:"#fff"}}
      >
        <FlaskConical style={{width:13,height:13}}/>
        DEV
        {user ? ` · ${user.name.split(" ")[0]} (${user.tier})` : " · guest"}
        {open ? <ChevronDown style={{width:11,height:11}}/> : <ChevronUp style={{width:11,height:11}}/>}
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden" style={{width:220}}>

          <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Test accounts</p>
          </div>
          {TEST.map(a => (
            <button key={a.email}
              onClick={async () => { try { await login(a.email,"test123"); } catch {} setOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm border-b border-gray-50 transition-colors hover:bg-blue-50"
              style={{color: user?.email===a.email ? "#2563eb" : "#374151"}}
            >
              <div className="text-left">
                <p className="font-medium text-sm">{a.label}</p>
                <p className="text-xs" style={{color:"#6b7280"}}>{a.tier}</p>
              </div>
              {user?.email===a.email && <span className="text-xs font-bold" style={{color:"#2563eb"}}>●</span>}
            </button>
          ))}

          {user && <>
            <div className="px-3 py-2 bg-gray-50 border-t border-b border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Switch tier</p>
            </div>
            {TIERS.map(t => (
              <button key={t}
                onClick={() => { setUserTier(t); setOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm border-b border-gray-50 hover:bg-gray-50 transition-colors"
                style={{color: user.tier===t ? "#2563eb" : "#374151", fontWeight: user.tier===t ? 600 : 400}}
              >
                <span className="capitalize">{t}</span>
                <span className="text-xs" style={{color:"#9ca3af"}}>{TIER_FEATURES[t].price}</span>
              </button>
            ))}
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-red-50 transition-colors"
              style={{color:"#dc2626"}}
            >
              <LogOut style={{width:13,height:13}}/> Log out
            </button>
          </>}
        </div>
      )}
    </div>
  );
}
