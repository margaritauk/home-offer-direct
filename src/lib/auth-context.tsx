"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { sha256 } from "@/lib/hash";

export type Tier = "free" | "basic" | "premium" | "pro";

export interface UserOffer {
  id: string;
  address: string;
  price: number;
  listPrice: number;
  status: "pending" | "draft" | "accepted" | "rejected";
  label: string;
  date: string;
  img: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tier: Tier;
  state: string;
  offers: UserOffer[];
  savedHomeIds: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, state: string) => Promise<void>;
  logout: () => void;
  setUserTier: (tier: Tier) => void;
  saveHome: (homeId: string) => void;
  unsaveHome: (homeId: string) => void;
}

export const TIER_FEATURES: Record<Tier, {
  label: string; price: string; maxOffers: number;
  pdfDownload: boolean; agentSend: boolean; aiRecommend: boolean;
  savedHomes: number; journeyTracker: boolean;
}> = {
  free:    { label:"Free",    price:"$0",     maxOffers:1,   pdfDownload:false, agentSend:false, aiRecommend:false, savedHomes:3,   journeyTracker:false },
  basic:   { label:"Basic",   price:"$29",    maxOffers:5,   pdfDownload:true,  agentSend:false, aiRecommend:false, savedHomes:15,  journeyTracker:true  },
  premium: { label:"Premium", price:"$99",    maxOffers:99,  pdfDownload:true,  agentSend:true,  aiRecommend:true,  savedHomes:99,  journeyTracker:true  },
  pro:     { label:"Pro",     price:"$49/mo", maxOffers:999, pdfDownload:true,  agentSend:true,  aiRecommend:true,  savedHomes:999, journeyTracker:true  },
};

/* ── Test accounts ───────────────────────────────────────────────────── */
const TEST_ACCOUNTS: Record<string, AuthUser> = {
  "free@test.com": {
    id:"u-free", name:"Alex Chen", email:"free@test.com", tier:"free", state:"IL",
    offers:[
      { id:"1", address:"2847 N Clark St, Chicago, IL", price:485000, listPrice:485000, status:"draft", label:"Draft", date:"May 24, 2026", img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&auto=format&fit=crop" },
    ],
    savedHomeIds:["1"],
  },
  "basic@test.com": {
    id:"u-basic", name:"Sam Rivera", email:"basic@test.com", tier:"basic", state:"IL",
    offers:[
      { id:"1", address:"2847 N Clark St, Chicago, IL", price:492000, listPrice:485000, status:"pending", label:"Pending review", date:"May 22, 2026", img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&auto=format&fit=crop" },
      { id:"2", address:"1520 W Wrightwood Ave, Chicago, IL", price:618000, listPrice:625000, status:"draft", label:"Draft", date:"May 20, 2026", img:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&auto=format&fit=crop" },
    ],
    savedHomeIds:["1","3"],
  },
  "premium@test.com": {
    id:"u-premium", name:"Jordan Taylor", email:"premium@test.com", tier:"premium", state:"IL",
    offers:[
      { id:"1", address:"2847 N Clark St, Chicago, IL", price:492000, listPrice:485000, status:"pending", label:"Pending review", date:"May 22, 2026", img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&auto=format&fit=crop" },
      { id:"2", address:"1520 W Wrightwood Ave, Chicago, IL", price:618000, listPrice:625000, status:"draft", label:"Draft", date:"May 20, 2026", img:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&auto=format&fit=crop" },
      { id:"3", address:"900 N Michigan Ave, Chicago, IL", price:380000, listPrice:395000, status:"rejected", label:"Not accepted", date:"May 15, 2026", img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&auto=format&fit=crop" },
    ],
    savedHomeIds:["1","3"],
  },
};

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = "hod_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (email: string, password: string) => {
    const key = email.toLowerCase().trim();
    // Check test accounts
    const test = TEST_ACCOUNTS[key];
    if (test && password === "test123") { persist(test); return; }
    // Check registered users
    const users = JSON.parse(localStorage.getItem("hod_users") ?? "{}");
    const stored = users[key];
    const hash = await sha256(password);
    if (stored && stored.passwordHash === hash) {
      const { passwordHash: _, ...u } = stored;
      persist(u as AuthUser);
      return;
    }
    throw new Error("Invalid email or password");
  };

  const register = async (name: string, email: string, password: string, state: string) => {
    const key = email.toLowerCase().trim();
    if (TEST_ACCOUNTS[key]) throw new Error("This email is reserved for testing");
    const users = JSON.parse(localStorage.getItem("hod_users") ?? "{}");
    if (users[key]) throw new Error("An account with this email already exists");
    const passwordHash = await sha256(password);
    const newUser: AuthUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: key,
      tier: "free",
      state,
      offers: [],
      savedHomeIds: [],
    };
    users[key] = { ...newUser, passwordHash };
    localStorage.setItem("hod_users", JSON.stringify(users));
    persist(newUser);
  };

  const logout = () => persist(null);

  const setUserTier = (tier: Tier) => {
    if (!user) return;
    persist({ ...user, tier });
  };

  const saveHome = (homeId: string) => {
    if (!user) return;
    persist({ ...user, savedHomeIds: [...new Set([...user.savedHomeIds, homeId])] });
  };

  const unsaveHome = (homeId: string) => {
    if (!user) return;
    persist({ ...user, savedHomeIds: user.savedHomeIds.filter(id => id !== homeId) });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUserTier, saveHome, unsaveHome }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useTierFeatures() {
  const { user } = useAuth();
  return TIER_FEATURES[user?.tier ?? "free"];
}
