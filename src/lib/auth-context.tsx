"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { sha256 } from "@/lib/hash";

export type Tier = "free" | "basic" | "premium" | "pro";

export interface UserOffer {
  id: string;
  address: string;
  price: number;
  listPrice: number;
  status: "pending" | "pending_response" | "submitted" | "draft" | "accepted" | "rejected" | "withdrawn" | "cancelled";
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

const SUPABASE_CONFIGURED =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/* ── Helpers ────────────────────────────────────────────────────────── */

function withTimeout<T>(promise: Promise<T>, ms = 12000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out. Please check your connection and try again.")), ms)
    ),
  ]);
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

/* ── Supabase path ──────────────────────────────────────────────────── */

async function getSupabaseClient() {
  const { createClient } = await import("@/lib/supabase/client");
  return createClient();
}

const STATUS_LABEL: Record<string, string> = {
  draft:     "Draft",
  submitted: "Submitted",
  pending:   "Pending review",
  accepted:  "Accepted",
  rejected:  "Not accepted",
  withdrawn: "Withdrawn",
  cancelled: "Cancelled",
};

interface DbOfferRow {
  id: string;
  status: string;
  offer_price: number | null;
  list_price: number | null;
  property_address: string | null;
  address: string | null;
  created_at: string;
}

function dbRowToUserOffer(row: DbOfferRow): UserOffer {
  const resolvedAddress = row.property_address ?? row.address ?? "Address not provided";
  const statusKey = row.status as UserOffer["status"];
  return {
    id: row.id,
    address: resolvedAddress,
    price: row.offer_price ?? 0,
    listPrice: row.list_price ?? 0,
    status: statusKey,
    label: STATUS_LABEL[row.status] ?? row.status,
    date: new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    img: "",
  };
}

async function fetchUserOffers(supabase: Awaited<ReturnType<typeof getSupabaseClient>>, userId: string): Promise<UserOffer[]> {
  const { data, error } = await supabase
    .from("offers")
    .select("id, status, offer_price, list_price, property_address, address, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as DbOfferRow[]).map(dbRowToUserOffer);
}

function supabaseUserToAuthUser(sbUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }, profile?: { name?: string; tier?: string; state?: string }, offers: UserOffer[] = []): AuthUser {
  return {
    id: sbUser.id,
    name: (profile?.name as string) ?? (sbUser.user_metadata?.name as string) ?? sbUser.email ?? "User",
    email: sbUser.email ?? "",
    tier: ((profile?.tier as Tier) ?? "free"),
    state: (profile?.state as string) ?? "IL",
    offers,
    savedHomeIds: [],
  };
}

/* ── Provider ───────────────────────────────────────────────────────── */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /* ── Initialise session ─────────────────────────────────────────── */
  useEffect(() => {
    if (SUPABASE_CONFIGURED) {
      // Supabase path: subscribe to auth state changes
      let unsubscribe: (() => void) | undefined;

      getSupabaseClient().then((supabase) => {
        // Bootstrap from current session
        supabase.auth.getUser().then(async ({ data }) => {
          if (data.user) {
            const { data: profile } = await supabase
              .from("users")
              .select("name, tier, state")
              .eq("id", data.user.id)
              .single();
            const offers = await fetchUserOffers(supabase, data.user.id);
            const authUser = supabaseUserToAuthUser(data.user, profile ?? undefined, offers);
            const { data: savedRows } = await supabase
              .from("saved_homes")
              .select("property_id")
              .eq("user_id", data.user.id);
            if (savedRows) {
              authUser.savedHomeIds = savedRows.map((r: { property_id: string }) => r.property_id);
            }
            setUser(authUser);
          }
          setLoading(false);
        });

        // Keep in sync with auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session?.user) {
              const { data: profile } = await supabase
                .from("users")
                .select("name, tier, state")
                .eq("id", session.user.id)
                .single();
              const offers = await fetchUserOffers(supabase, session.user.id);
              const authUser = supabaseUserToAuthUser(session.user, profile ?? undefined, offers);
              const { data: savedRows } = await supabase
                .from("saved_homes")
                .select("property_id")
                .eq("user_id", session.user.id);
              if (savedRows) {
                authUser.savedHomeIds = savedRows.map((r: { property_id: string }) => r.property_id);
              }
              setUser(authUser);
            } else {
              setUser(null);
            }
            setLoading(false);
          }
        );
        unsubscribe = () => subscription.unsubscribe();
      });

      return () => { unsubscribe?.(); };
    } else {
      // localStorage fallback
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setUser(JSON.parse(stored));
      } catch { /* ignore */ }
      setLoading(false);
    }
  }, []);

  /* ── localStorage helpers (fallback path only) ─────────────────── */
  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  /* ── login ──────────────────────────────────────────────────────── */
  const login = async (email: string, password: string) => {
    const key = email.toLowerCase().trim();

    // Test accounts work in both paths
    const test = TEST_ACCOUNTS[key];
    if (test && password === "test123") {
      if (!SUPABASE_CONFIGURED) persist(test);
      else setUser(test);
      return;
    }

    if (SUPABASE_CONFIGURED) {
      const supabase = await getSupabaseClient();
      const { error } = await withTimeout(
        supabase.auth.signInWithPassword({ email: key, password })
      );
      if (error) throw new Error(error.message);
      // Eagerly set the user so navigation to /dashboard doesn't race
      // against onAuthStateChange and trigger the "no user" redirect guard.
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      if (sbUser) {
        const { data: profile } = await supabase
          .from("users")
          .select("name, tier, state")
          .eq("id", sbUser.id)
          .single();
        setUser(supabaseUserToAuthUser(sbUser, profile ?? undefined));
      }
    } else {
      const users = JSON.parse(localStorage.getItem("hod_users") ?? "{}");
      const stored = users[key];
      const hash = await sha256(password);
      if (stored && stored.passwordHash === hash) {
        const { passwordHash: _, ...u } = stored;
        persist(u as AuthUser);
        return;
      }
      throw new Error("Invalid email or password");
    }
  };

  /* ── register ───────────────────────────────────────────────────── */
  const register = async (name: string, email: string, password: string, state: string) => {
    const key = email.toLowerCase().trim();
    if (TEST_ACCOUNTS[key]) throw new Error("This email is reserved for testing");

    if (SUPABASE_CONFIGURED) {
      const supabase = await getSupabaseClient();
      const { data, error } = await withTimeout(
        supabase.auth.signUp({
          email: key,
          password,
          options: { data: { name: name.trim() } },
        })
      );
      if (error) throw new Error(error.message);
      if (data.user) {
        // Insert the public profile row — best-effort, non-blocking
        void supabase.from("users").insert({
          id: data.user.id,
          name: name.trim(),
          email: key,
          tier: "free",
          state,
        });
        // onAuthStateChange will update the user state
      }
    } else {
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
    }

    // Fire-and-forget welcome email (both paths)
    fetch("/api/auth/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: key, name: name.trim() }),
    }).catch(() => { /* ignore email failures */ });
  };

  /* ── logout ─────────────────────────────────────────────────────── */
  const logout = async () => {
    if (SUPABASE_CONFIGURED) {
      const supabase = await getSupabaseClient();
      await supabase.auth.signOut();
      // onAuthStateChange will set user to null
    } else {
      persist(null);
    }
  };

  /* ── tier / saved homes (localStorage path; Supabase path would use DB) */
  const setUserTier = (tier: Tier) => {
    if (!user) return;
    const updated = { ...user, tier };
    setUser(updated);
    if (!SUPABASE_CONFIGURED) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const saveHome = (homeId: string) => {
    if (!user) return;
    if (SUPABASE_CONFIGURED) {
      if (!isValidUUID(homeId)) {
        // Non-UUID property ID (e.g. mock data) — update state only
        setUser({ ...user, savedHomeIds: [...new Set([...user.savedHomeIds, homeId])] });
        return;
      }
      const currentUser = user;
      getSupabaseClient().then((supabase) => {
        supabase
          .from("saved_homes")
          .insert({ user_id: currentUser.id, property_id: homeId })
          .then(({ error }) => {
            if (error) {
              console.error("saveHome: failed to persist to Supabase", error);
              return;
            }
            setUser((prev) => {
              if (!prev) return prev;
              return { ...prev, savedHomeIds: [...new Set([...prev.savedHomeIds, homeId])] };
            });
          });
      });
    } else {
      const updated = { ...user, savedHomeIds: [...new Set([...user.savedHomeIds, homeId])] };
      persist(updated);
    }
  };

  const unsaveHome = (homeId: string) => {
    if (!user) return;
    if (SUPABASE_CONFIGURED) {
      if (!isValidUUID(homeId)) {
        // Non-UUID property ID (e.g. mock data) — update state only
        setUser({ ...user, savedHomeIds: user.savedHomeIds.filter((id) => id !== homeId) });
        return;
      }
      const currentUser = user;
      getSupabaseClient().then((supabase) => {
        supabase
          .from("saved_homes")
          .delete()
          .eq("user_id", currentUser.id)
          .eq("property_id", homeId)
          .then(({ error }) => {
            if (error) {
              console.error("unsaveHome: failed to delete from Supabase", error);
              return;
            }
            setUser((prev) => {
              if (!prev) return prev;
              return { ...prev, savedHomeIds: prev.savedHomeIds.filter((id) => id !== homeId) };
            });
          });
      });
    } else {
      const updated = { ...user, savedHomeIds: user.savedHomeIds.filter((id) => id !== homeId) };
      persist(updated);
    }
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
