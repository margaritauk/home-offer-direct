"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { useAuth, useTierFeatures, UserOffer } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/utils";
import { ALL_PROPERTIES } from "@/lib/properties";
import {
  FileText, Send, Clock, PlusCircle, Bell, TrendingUp,
  DollarSign, Download, MessageSquare, Bed, Bath,
  ChevronRight, Sparkles, Heart, MapPin, Lock,
  CheckCircle2, Circle, CalendarDays, AlertCircle, ArrowRight, Phone, Mail,
  PenLine, ShieldCheck, ShieldOff, X, ChevronDown, Upload,
} from "lucide-react";

/* ── Supabase detection (mirrors auth-context.tsx pattern) ──────────── */
const SUPABASE_CONFIGURED =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/* ── DB row → UserOffer mapper ──────────────────────────────────────── */
const STATUS_LABEL: Record<string, string> = {
  draft:            "Draft",
  submitted:        "Submitted",
  pending:          "Pending review",
  pending_response: "Pending Response",
  accepted:         "Accepted",
  rejected:         "Not accepted",
  withdrawn:        "Withdrawn",
  counter:          "Counter-offer received",
};

interface DbOfferRow {
  id: string;
  status: string;
  offer_price: number | null;
  list_price: number | null;
  property_address: string | null;
  address: string | null;
  created_at: string;
  terms?: Record<string, unknown> | null;
  notes?: string | null;
}

/* Extended local offer that carries signature and notes data */
interface ExtendedOffer extends UserOffer {
  signatureDataUrl?: string;
  signatureDate?: string;
  notes?: string;
}

function formatSignatureDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    }) + " at " + d.toLocaleTimeString("en-US", {
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  } catch {
    return isoString;
  }
}

function dbRowToExtendedOffer(row: DbOfferRow): ExtendedOffer {
  const resolvedAddress = row.property_address ?? row.address ?? "Address not provided";
  const statusKey = row.status as UserOffer["status"];
  const terms = row.terms ?? {};
  return {
    id: row.id,
    address: resolvedAddress,
    price: row.offer_price ?? 0,
    listPrice: row.list_price ?? 0,
    status: statusKey,
    label: STATUS_LABEL[row.status] ?? row.status,
    date: new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    img: "",
    signatureDataUrl: (terms.signatureDataUrl as string | undefined) ?? undefined,
    signatureDate: (terms.signatureDate as string | undefined) ?? undefined,
    notes: row.notes ?? undefined,
  };
}

/* Keep backwards compat shim for non-Supabase (mock) offers */
function userOfferToExtended(o: UserOffer): ExtendedOffer {
  return { ...o };
}

/* Status options for the Update Status modal */
const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "pending",   label: "Pending response" },
  { value: "accepted",  label: "Accepted" },
  { value: "rejected",  label: "Rejected" },
  { value: "counter",   label: "Counter-offer received" },
  { value: "withdrawn", label: "Withdrawn" },
];

const STATUS_GUIDANCE: Record<string, string> = {
  accepted:  "Congratulations! Time to schedule your inspection and connect with your lender.",
  rejected:  "Sorry to hear that. Consider adjusting your offer strategy or looking at other properties.",
  counter:   "The seller responded with a counter. Review the terms and decide how to proceed.",
  withdrawn: "Offer withdrawn. You can start a new offer anytime.",
};

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
  pending:          "text-amber-700 bg-amber-50",
  pending_response: "bg-blue-100 text-blue-700",
  draft:            "text-slate-600 bg-slate-100",
  accepted:         "text-green-700 bg-green-50",
  rejected:         "text-red-600 bg-red-50",
  submitted:        "bg-blue-100 text-blue-700",
  withdrawn:        "bg-slate-100 text-slate-500",
};

/* ── Signed badge helper ────────────────────────────────────────────── */
function SignedBadge({ offer }: { offer: ExtendedOffer }) {
  const isSigned = !!offer.signatureDataUrl;
  if (isSigned) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
        <ShieldCheck className="w-3 h-3"/> Signed
        {offer.signatureDate && (
          <span className="font-normal text-green-600 ml-0.5">
            · {formatSignatureDate(offer.signatureDate)}
          </span>
        )}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
      <ShieldOff className="w-3 h-3"/> Unsigned
    </span>
  );
}

type Tab = "overview" | "offers" | "saved" | "journey";

/* ── Status update modal state ──────────────────────────────────────── */
interface StatusModalState {
  offerId: string;
  currentStatus: string;
  selectedStatus: string;
  notes: string;
  submitting: boolean;
  guidanceMessage: string | null;
}

/* ── Verify identity card state ─────────────────────────────────────── */
interface VerifyState {
  idUploaded: boolean;
  proofUploaded: boolean;
  verified: boolean;
  verifiedAt: string | null;
  idUploading: boolean;
  proofUploading: boolean;
  idError: string | null;
  proofError: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const features = useTierFeatures();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [dbOffers, setDbOffers] = useState<ExtendedOffer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [statusModal, setStatusModal] = useState<StatusModalState | null>(null);

  /* ── Identity verification state ─────────────────────────────────── */
  const [verifyState, setVerifyState] = useState<VerifyState>({
    idUploaded: false,
    proofUploaded: false,
    verified: false,
    verifiedAt: null,
    idUploading: false,
    proofUploading: false,
    idError: null,
    proofError: null,
  });
  const idInputRef = useRef<HTMLInputElement>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  /* ── Fetch real offers from Supabase when authenticated ─────────── */
  useEffect(() => {
    if (!SUPABASE_CONFIGURED || !user) return;
    // TEST_ACCOUNT users have non-UUID ids (e.g. "u-free") — skip Supabase fetch for them
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_REGEX.test(user.id)) return;

    let cancelled = false;
    setOffersLoading(true);

    (async () => {
      try {
        const { createBrowserClient } = await import("@supabase/ssr");
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data, error } = await supabase
          .from("offers")
          .select("id, status, offer_price, list_price, property_address, address, created_at, terms, notes")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!cancelled) {
          if (!error && data) {
            setDbOffers((data as DbOfferRow[]).map(dbRowToExtendedOffer));
          }
          setOffersLoading(false);
        }
      } catch {
        if (!cancelled) setOffersLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user?.id]);

  /* ── Fetch current verification status from Supabase ─────────────── */
  useEffect(() => {
    if (!SUPABASE_CONFIGURED || !user) return;
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_REGEX.test(user.id)) return;

    (async () => {
      try {
        const { createBrowserClient } = await import("@supabase/ssr");
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data } = await supabase
          .from("users")
          .select("id_document_path, proof_of_funds_path, id_verified_at")
          .eq("id", user.id)
          .single();
        if (data) {
          setVerifyState(prev => ({
            ...prev,
            idUploaded: !!(data.id_document_path),
            proofUploaded: !!(data.proof_of_funds_path),
            verified: !!(data.id_verified_at),
            verifiedAt: data.id_verified_at ?? null,
          }));
        }
      } catch { /* non-fatal */ }
    })();
  }, [user?.id]);

  /* ── Handle identity document upload ─────────────────────────────── */
  async function handleVerifyUpload(file: File, type: "id" | "proof_of_funds") {
    const errorKey = type === "id" ? "idError" : "proofError";
    const uploadingKey = type === "id" ? "idUploading" : "proofUploading";

    const ALLOWED = ["image/jpeg", "image/png", "application/pdf"];
    if (!ALLOWED.includes(file.type)) {
      setVerifyState(prev => ({ ...prev, [errorKey]: "Only JPEG, PNG, or PDF files are accepted." }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setVerifyState(prev => ({ ...prev, [errorKey]: "File must be 10 MB or smaller." }));
      return;
    }

    setVerifyState(prev => ({ ...prev, [uploadingKey]: true, [errorKey]: null }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch("/api/verify/upload-id", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Upload failed");
      }
      const result = await res.json() as { verified: boolean; idUploaded: boolean; proofUploaded: boolean };
      setVerifyState(prev => ({
        ...prev,
        idUploaded: result.idUploaded,
        proofUploaded: result.proofUploaded,
        verified: result.verified,
        verifiedAt: result.verified ? (prev.verifiedAt ?? new Date().toISOString()) : prev.verifiedAt,
        [uploadingKey]: false,
      }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Upload failed. Please try again.";
      setVerifyState(prev => ({ ...prev, [uploadingKey]: false, [errorKey]: msg }));
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    );
  }

  const savedHomes = ALL_PROPERTIES.filter(p => user.savedHomeIds.includes(p.id));

  /* Use real DB offers for Supabase-authenticated users, fall back to
     TEST_ACCOUNTS mock offers for localStorage / test-account sessions. */
  const UUID_REGEX_DISPLAY = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isSupabaseUser = SUPABASE_CONFIGURED && UUID_REGEX_DISPLAY.test(user.id);
  const activeOffers: ExtendedOffer[] = isSupabaseUser
    ? dbOffers
    : user.offers.map(userOfferToExtended);

  const pendingCount = activeOffers.filter(o => o.status === "pending").length;
  const draftCount   = activeOffers.filter(o => o.status === "draft").length;
  const totalSaved   = activeOffers.reduce((acc, o) => {
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
      value: activeOffers.length > 0 ? String(activeOffers.length) : "—",
      sub: activeOffers.length > 0 ? `${pendingCount} pending` : "Start your first offer",
    },
    {
      icon: Send,
      label: "Submitted",
      value: activeOffers.filter(o => o.status !== "draft").length > 0
        ? String(activeOffers.filter(o => o.status !== "draft").length)
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

  /* ── Status update handlers ─────────────────────────────────────── */
  function openStatusModal(offer: ExtendedOffer) {
    setStatusModal({
      offerId: offer.id,
      currentStatus: offer.status,
      selectedStatus: offer.status === "draft" ? "pending" : offer.status,
      notes: offer.notes ?? "",
      submitting: false,
      guidanceMessage: null,
    });
  }

  async function submitStatusUpdate() {
    if (!statusModal) return;
    setStatusModal(prev => prev ? { ...prev, submitting: true } : prev);
    try {
      const res = await fetch(`/api/offers/${statusModal.offerId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusModal.selectedStatus,
          notes: statusModal.notes,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Failed to update status");
      }
      /* Optimistically update local state */
      const newLabel = STATUS_LABEL[statusModal.selectedStatus] ?? statusModal.selectedStatus;
      setDbOffers(prev =>
        prev.map(o =>
          o.id === statusModal.offerId
            ? { ...o, status: statusModal.selectedStatus as UserOffer["status"], label: newLabel, notes: statusModal.notes }
            : o
        )
      );
      const guidance = STATUS_GUIDANCE[statusModal.selectedStatus] ?? null;
      setStatusModal(prev => prev ? { ...prev, submitting: false, guidanceMessage: guidance } : prev);
    } catch (e) {
      console.error(e);
      setStatusModal(prev => prev ? { ...prev, submitting: false } : prev);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* ── Status Update Modal ─────────────────────────────────────── */}
      {statusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-7">
            {statusModal.guidanceMessage ? (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0"/>
                  <h3 className="text-base font-semibold text-slate-900">Status updated</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-7">
                  {statusModal.guidanceMessage}
                </p>
                <button
                  onClick={() => setStatusModal(null)}
                  className="w-full py-2.5 gradient-bg text-white font-semibold rounded-xl text-sm hover:opacity-90">
                  Done
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-semibold text-slate-900">Update offer status</h3>
                  <button onClick={() => setStatusModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4"/>
                  </button>
                </div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Status</label>
                <div className="relative mb-4">
                  <select
                    value={statusModal.selectedStatus}
                    onChange={e => setStatusModal(prev => prev ? { ...prev, selectedStatus: e.target.value } : prev)}
                    className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 pr-9">
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                </div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                  Notes <span className="font-normal">(optional)</span>
                </label>
                <textarea
                  value={statusModal.notes}
                  onChange={e => setStatusModal(prev => prev ? { ...prev, notes: e.target.value } : prev)}
                  rows={3}
                  placeholder="e.g. Seller countered at $510,000 with closing in 30 days…"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none mb-6"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setStatusModal(null)}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-sm hover:bg-slate-50">
                    Cancel
                  </button>
                  <button
                    onClick={submitStatusUpdate}
                    disabled={statusModal.submitting}
                    className="flex-1 py-2.5 gradient-bg text-white font-semibold rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
                    {statusModal.submitting ? "Saving…" : "Confirm"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">

        {/* Welcome header */}
        <div className="flex items-center justify-between gap-4 mb-12">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="text-slate-500 mt-1 sm:mt-2 text-sm">{headerSub}</p>
          </div>
          <Link href="/offer-builder"
            className="flex items-center gap-2 gradient-bg text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:opacity-90 transition-all shadow-sm text-sm flex-shrink-0">
            <PlusCircle className="w-4 h-4" /> <span className="hidden sm:inline">New </span>Offer
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {stats.map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-7">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 sm:mb-5">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 mb-1 sm:mb-2">{value}</p>
              <p className="text-xs sm:text-sm font-medium text-slate-700">{label}</p>
              <p className="text-xs text-slate-400 mt-1 sm:mt-2">{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Verify Your Identity card ── */}
        {isSupabaseUser && (
          <div className={`mb-8 rounded-2xl border shadow-sm overflow-hidden ${verifyState.verified ? "border-green-200 bg-green-50" : "border-slate-100 bg-white"}`}>
            <div className="px-4 sm:px-8 py-4 sm:py-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${verifyState.verified ? "bg-green-100" : "bg-blue-50"}`}>
                <ShieldCheck className={`w-5 h-5 ${verifyState.verified ? "text-green-600" : "text-blue-600"}`} />
              </div>
              <div className="flex-1 min-w-0">
                {verifyState.verified ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 bg-green-100 border border-green-200 px-3 py-1 rounded-full">
                      <ShieldCheck className="w-4 h-4" /> Verified Buyer
                    </span>
                    {verifyState.verifiedAt && (
                      <span className="text-xs text-green-600">
                        Verified {new Date(verifyState.verifiedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </span>
                    )}
                    <span className="text-xs text-green-600 font-medium">
                      · Government ID and proof of funds on file — badge shown on your offer PDF and emails
                    </span>
                  </div>
                ) : (
                  <>
                    <h3 className="text-sm font-semibold text-slate-900">Verify your identity</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Upload a government ID and proof of funds to display a <strong>Verified Buyer</strong> badge on your offers.
                    </p>
                  </>
                )}
              </div>
            </div>

            {!verifyState.verified && (
              <div className="px-8 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Government ID upload */}
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-2">
                    Government ID <span className="font-normal text-slate-400">(driver&apos;s license or passport)</span>
                  </p>
                  <input
                    ref={idInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="sr-only"
                    disabled={verifyState.idUploading}
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) handleVerifyUpload(f, "id");
                      e.target.value = "";
                    }}
                  />
                  <button
                    onClick={() => idInputRef.current?.click()}
                    disabled={verifyState.idUploading}
                    className={`w-full flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all ${
                      verifyState.idUploaded
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                    } disabled:opacity-50`}>
                    {verifyState.idUploading ? (
                      <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> Uploading…</>
                    ) : verifyState.idUploaded ? (
                      <><CheckCircle2 className="w-4 h-4"/> ID uploaded ✓</>
                    ) : (
                      <><Upload className="w-4 h-4"/> Upload government ID</>
                    )}
                  </button>
                  {verifyState.idError && (
                    <p className="text-xs text-red-600 mt-1.5">{verifyState.idError}</p>
                  )}
                </div>

                {/* Proof of funds upload */}
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-2">
                    Proof of funds <span className="font-normal text-slate-400">(bank statement or pre-approval)</span>
                  </p>
                  <input
                    ref={proofInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="sr-only"
                    disabled={verifyState.proofUploading}
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) handleVerifyUpload(f, "proof_of_funds");
                      e.target.value = "";
                    }}
                  />
                  <button
                    onClick={() => proofInputRef.current?.click()}
                    disabled={verifyState.proofUploading}
                    className={`w-full flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all ${
                      verifyState.proofUploaded
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                    } disabled:opacity-50`}>
                    {verifyState.proofUploading ? (
                      <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> Uploading…</>
                    ) : verifyState.proofUploaded ? (
                      <><CheckCircle2 className="w-4 h-4"/> Proof uploaded ✓</>
                    ) : (
                      <><Upload className="w-4 h-4"/> Upload proof of funds</>
                    )}
                  </button>
                  {verifyState.proofError && (
                    <p className="text-xs text-red-600 mt-1.5">{verifyState.proofError}</p>
                  )}
                </div>

                {/* Privacy notice */}
                <p className="sm:col-span-2 text-xs text-slate-400 flex items-start gap-1.5 mt-1">
                  <Lock className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  Your ID is stored securely and only shared as part of your offer package.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-8 overflow-x-auto" data-testid="tabs">
          {(["overview","offers","saved","journey"] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              data-testid={`tab-${tab}`}
              className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium capitalize transition-all flex items-center gap-1.5 whitespace-nowrap ${activeTab===tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {tab==="journey" && !features.journeyTracker && <Lock className="w-3 h-3"/>}
              {tab==="journey" ? "My Journey" : tab}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeTab==="overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Recent Offers</h2>
                <button onClick={() => setActiveTab("offers")}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              {offersLoading ? (
                <div className="divide-y divide-slate-100">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="p-6 flex items-center gap-5 animate-pulse">
                      <div className="w-16 h-16 rounded-xl bg-slate-200 flex-shrink-0"/>
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-slate-200 rounded w-3/4"/>
                        <div className="h-5 bg-slate-200 rounded w-1/3"/>
                        <div className="h-3 bg-slate-200 rounded w-1/4"/>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activeOffers.length === 0 ? (
                <div className="p-14 text-center">
                  <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3"/>
                  <p className="text-sm font-medium text-slate-500">You haven&apos;t started any offers yet</p>
                  <Link href="/search" className="inline-flex items-center gap-1.5 mt-4 text-sm text-blue-600 font-semibold hover:underline">
                    Start an offer <ArrowRight className="w-3.5 h-3.5"/>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100" data-testid="offers-panel">
                  {activeOffers.slice(0, 3).map(o => (
                    <div key={o.id} className="p-4 sm:p-6 flex items-center gap-3 sm:gap-5 hover:bg-slate-50 transition-colors">
                      <div className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0"
                        style={{backgroundImage:`url(${o.img})`}}/>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{o.address}</p>
                        <p className="text-lg font-black text-slate-900">{formatCurrency(o.price)}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[o.status]}`}>{o.label}</span>
                          <SignedBadge offer={o}/>
                          <span className="text-xs text-slate-400">{o.date}</span>
                        </div>
                        {!o.signatureDataUrl && (
                          <Link
                            href={`/offer-builder?id=${o.id}&step=15`}
                            className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold mt-1.5 hover:underline">
                            <PenLine className="w-3 h-3"/> Sign before sending to agent
                          </Link>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {o.status==="draft" && (
                          <Link href="/offer-builder"
                            className="text-xs px-3 py-1.5 gradient-bg text-white rounded-lg font-medium hover:opacity-90">
                            Continue
                          </Link>
                        )}
                        <button
                          onClick={() => openStatusModal(o)}
                          title="Update status"
                          className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-xs font-medium flex items-center gap-1">
                          <Send className="w-3.5 h-3.5"/>
                        </button>
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
              <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">AI Recommendations</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {AI_RECS.map(rec => {
                  const Icon = rec.icon;
                  return (
                    <div key={rec.title} className="p-4 sm:p-7">
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
            {offersLoading ? (
              <div className="space-y-4">
                {[0, 1, 2].map(i => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-8 flex items-center gap-4 sm:gap-6 animate-pulse">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-200 flex-shrink-0"/>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-2/3"/>
                      <div className="h-7 bg-slate-200 rounded w-1/3"/>
                      <div className="h-3 bg-slate-200 rounded w-1/4"/>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeOffers.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
                <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3"/>
                <p className="text-sm font-medium text-slate-500">You haven&apos;t started any offers yet</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">Browse homes to find your next opportunity</p>
                <Link href="/search" className="inline-flex items-center gap-1.5 gradient-bg text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90">
                  Start an offer <ArrowRight className="w-4 h-4"/>
                </Link>
              </div>
            ) : (
              (["pending","submitted","draft","accepted","rejected","withdrawn"] as const).map(status => {
                const group = activeOffers.filter(o => o.status === status);
                if (!group.length) return null;
                const statusLabel = { pending:"Pending", submitted:"Submitted", draft:"Draft", accepted:"Accepted", rejected:"Not Accepted", withdrawn:"Withdrawn" }[status];
                return (
                  <div key={status}>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">{statusLabel}</h3>
                    <div className="space-y-4">
                      {group.map(offer => (
                        <div key={offer.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                          <div className="w-full h-32 sm:w-20 sm:h-20 rounded-xl bg-cover bg-center flex-shrink-0"
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
                            {/* Signature status */}
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              <SignedBadge offer={offer}/>
                              {!offer.signatureDataUrl && (
                                <Link
                                  href={`/offer-builder?id=${offer.id}&step=15`}
                                  className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold hover:underline">
                                  <PenLine className="w-3 h-3"/> Sign now before sending to agent
                                </Link>
                              )}
                            </div>
                            {/* Notes */}
                            {offer.notes && (
                              <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 mt-3 leading-relaxed">
                                <span className="font-medium text-slate-700">Notes: </span>{offer.notes}
                              </p>
                            )}
                            <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-6 flex-wrap">
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
                              {/* Update status button */}
                              <button
                                onClick={() => openStatusModal(offer)}
                                className="flex items-center gap-1.5 text-sm px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200">
                                <Send className="w-4 h-4"/> Update status
                              </button>
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

            {activeOffers.length >= features.maxOffers && (
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
