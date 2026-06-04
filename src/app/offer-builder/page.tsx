"use client";
import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, ChevronDown, ChevronUp, AlertTriangle, Info, Home, RotateCcw, X } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import SignatureCanvas from "react-signature-canvas";
import { track } from "@/lib/analytics";
import { ALL_PROPERTIES as PROPERTIES } from "@/lib/properties";
import type { Property } from "@/lib/properties";
import { useAuth } from "@/lib/auth-context";
import { scoreOffer } from "@/lib/scoring";
import type { ScoringResult } from "@/lib/scoring";

/* ─────────────────────────────────────────────────
   WORKFLOW DEFINITION
   One question per screen, real estate order
───────────────────────────────────────────────── */
const SECTIONS = [
  { id:"setup",    label:"Setup",          steps:[0,1,2] },
  { id:"property", label:"Your Property",  steps:[3] },
  { id:"price",    label:"Offer Price",    steps:[4] },
  { id:"financing",label:"Financing",      steps:[5,6,7] },
  { id:"timeline", label:"Timeline",       steps:[8,9] },
  { id:"protect",  label:"Contingencies",  steps:[10,11,12] },
  { id:"terms",    label:"Extra Terms",    steps:[13,14] },
  { id:"sign",     label:"Sign",           steps:[15] },
  { id:"review",   label:"Review & Send",  steps:[16,17] },
];
const TOTAL = 18;

type D = {
  buyerType:string; state:string; firstTime:boolean;
  propertyConfirmed:boolean;
  offerPrice:number;
  financeType:string; downPct:number; preApproved:boolean|null;
  closingDays:number; earnestPct:number;
  inspectionContingency:boolean|null; inspectionDays:number;
  appraisalContingency:boolean|null;
  financingContingency:boolean|null; financingDays:number;
  escalation:boolean|null; escIncrement:number; escMax:number;
  sellerCredits:number;
  personalLetter:boolean|null;
  personalLetterText:string;
  signatureDataUrl:string;
  signatureDate:string;
  signatureName:string;
};

/* ─────────────────────────────────────────────────
   PROPERTIES — imported from @/lib/properties
───────────────────────────────────────────────── */

const fmt = (n:number) => "$"+n.toLocaleString();

/* ─────────────────────────────────────────────────
   TERM TIP — plain-English inline explainer
   Usage: <TermTip tip="Your plain-English explanation here." />
   Renders an ℹ icon that opens a popover on click/hover.
───────────────────────────────────────────────── */
function TermTip({ tip }: { tip: string }) {
  return (
    <Popover style={{ display: "inline-block", position: "relative", verticalAlign: "middle" }}>
      <PopoverButton
        aria-label="What does this mean?"
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 18, height: 18, borderRadius: "50%",
          background: "var(--blue-light)", border: "1.5px solid #bfdbfe",
          color: "var(--blue)", cursor: "pointer", padding: 0,
          marginLeft: 6, flexShrink: 0, lineHeight: 1,
        }}>
        <Info style={{ width: 10, height: 10 }} />
      </PopoverButton>
      <PopoverPanel
        style={{
          position: "absolute", zIndex: 100, bottom: "calc(100% + 8px)", left: "50%",
          transform: "translateX(-50%)", width: 260,
          background: "#1e293b", color: "#f1f5f9",
          borderRadius: 10, padding: "10px 14px",
          fontSize: 12, lineHeight: 1.6, fontWeight: 400,
          boxShadow: "0 8px 24px -4px rgba(0,0,0,0.35)",
          pointerEvents: "none",
        }}>
        {tip}
        {/* Arrow */}
        <span style={{
          position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
          width: 0, height: 0,
          borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
          borderTop: "6px solid #1e293b",
        }} />
      </PopoverPanel>
    </Popover>
  );
}

/* Plain-English tip text for each term */
const TIPS = {
  inspectionContingency:
    "This lets you back out of the deal — and get your deposit back — if a professional home inspector finds serious problems like a bad roof, foundation cracks, or faulty wiring.",
  financingContingency:
    "Even with a pre-approval, loans can fall through. This clause lets you walk away and keep your deposit if your mortgage is denied before closing.",
  appraisalContingency:
    "Your lender will hire an appraiser to confirm the home's value. If the appraisal comes in lower than your offer, this clause lets you renegotiate the price or back out without losing your deposit.",
  earnestMoney:
    "This is a good-faith deposit — usually 1–3% of the purchase price — that you pay when your offer is accepted. It shows the seller you're serious. It gets applied to your down payment at closing, but you could lose it if you back out for a reason not covered by your contingencies.",
  closingDate:
    "The closing date is the day you officially become the owner and get the keys. It's typically 30–45 days after your offer is accepted, giving time for inspections, appraisal, and your lender to finalize the loan.",
  escalationClause:
    "This tells the seller: 'I'll automatically beat any competing offer by $X, up to a maximum I set.' It keeps you competitive without revealing your top dollar upfront. It only kicks in if there's a real competing offer.",
  escalationCap:
    "This is the most you're willing to pay — your absolute ceiling. The escalation clause won't push your price above this number no matter how many competing offers there are.",
  asIs:
    "Buying 'as-is' means you accept the home in its current condition. The seller won't make repairs. It's riskier, but can appeal to sellers who don't want the hassle of fixing things before closing.",
  preApproval:
    "A pre-approval means a lender has reviewed your income, credit, and assets and agreed to loan you up to a set amount. It's much stronger than a pre-qualification, which is just a rough estimate. Sellers take pre-approvals seriously.",
  preQualification:
    "A pre-qualification is a quick, informal estimate of how much you might be able to borrow — usually just based on self-reported income. It carries less weight than a full pre-approval because the lender hasn't verified anything yet.",
  sellerCredits:
    "Seller credits (also called seller concessions) are when the seller agrees to pay some of your closing costs at settlement. This can save you thousands upfront, but asking for credits may weaken your offer in a competitive market.",
  downPayment:
    "Your down payment is the portion of the purchase price you pay upfront in cash. The bank covers the rest with a mortgage. Putting down 20% or more avoids Private Mortgage Insurance (PMI), which adds $100–300/month to your payment.",
};

const INITIAL_D: D = {
  buyerType:"", state:"", firstTime:false,
  propertyConfirmed:false,
  offerPrice:0,
  financeType:"", downPct:0, preApproved:null,
  closingDays:0, earnestPct:0,
  inspectionContingency:null, inspectionDays:0,
  appraisalContingency:null,
  financingContingency:null, financingDays:21,
  escalation:null, escIncrement:2500, escMax:510000,
  sellerCredits:-1,
  personalLetter:null,
  personalLetterText:"",
  signatureDataUrl:"",
  signatureDate:"",
  signatureName:"",
};

/* ─────────────────────────────────────────────────
   VALIDATION
───────────────────────────────────────────────── */
function canContinue(step:number, d:D): boolean {
  switch(step) {
    case 0:  return d.buyerType !== "";
    case 1:  return d.state !== null && d.state !== "";
    case 2:  return d.financeType !== "";
    case 3:  return true;
    case 4:  return d.offerPrice > 0;
    case 5:  return d.financeType !== "";
    case 6:  return d.financeType === "cash" || d.downPct > 0;
    case 7:  return d.earnestPct > 0;
    case 8:  return d.closingDays > 0;
    case 9:  return d.inspectionContingency !== null;
    case 10: return d.appraisalContingency !== null;
    case 11: return d.financeType === "cash" || d.financingContingency !== null;
    case 12: return d.escalation !== null;
    case 13: return d.sellerCredits !== -1;
    case 14: return d.personalLetter !== null;
    case 15: return d.signatureDataUrl !== "" && d.signatureName.trim() !== "";
    default: return true;
  }
}

/* ─────────────────────────────────────────────────
   LOADING SPINNER
───────────────────────────────────────────────── */
function LoadingSpinner() {
  return (
    <div style={{minHeight:"100vh",background:"var(--gray-50)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:40,height:40,border:"3px solid var(--gray-200)",borderTop:"3px solid var(--blue)",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 16px"}}/>
        <p style={{fontSize:14,color:"var(--gray-500)"}}>Loading...</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────── */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

const SUPABASE_ENABLED =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getSupabaseClient() {
  const { createClient } = await import("@/lib/supabase/client");
  return createClient();
}

/* ─────────────────────────────────────────────────
   INNER COMPONENT (uses useSearchParams)
───────────────────────────────────────────────── */
function OfferBuilderInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const propertyId = searchParams.get("property") ?? "1";
  const exitDest = searchParams.get("from") ?? "/search";
  const property = PROPERTIES.find(p => p.id === propertyId) ?? PROPERTIES[0];

  const storageKey = "hod-offer-" + propertyId;

  const [step, setStep] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return typeof parsed.step === "number" ? parsed.step : 0;
      }
    } catch {}
    return 0;
  });

  const [d, setD] = useState<D>(() => {
    if (typeof window === "undefined") return INITIAL_D;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.d ? { ...INITIAL_D, ...parsed.d } : INITIAL_D;
      }
    } catch {}
    return INITIAL_D;
  });

  const [showHelper, setShowHelper] = useState(false);
  const [hint, setHint] = useState(false);
  const [dateValue, setDateValue] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Signature canvas ref
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  // Pre-approval upload state
  const [preApprovalPath, setPreApprovalPath] = useState<string | null>(null);
  const [preApprovalUploadError, setPreApprovalUploadError] = useState<string | null>(null);
  const [preApprovalUploading, setPreApprovalUploading] = useState(false);
  const [preApprovalLocalFile, setPreApprovalLocalFile] = useState<File | null>(null);

  // ── Scoring: recompute whenever d or property changes ──────────────
  const scoringResult: ScoringResult = useMemo(() => {
    return scoreOffer({
      offerPrice: d.offerPrice > 0 ? d.offerPrice : property.price,
      listPrice: property.price,
      inspectionContingency: d.inspectionContingency ?? true,
      financingContingency: d.financeType === "cash" ? false : (d.financingContingency ?? true),
      appraisalContingency: d.financeType === "cash" ? false : (d.appraisalContingency ?? true),
      cashOffer: d.financeType === "cash",
      closingDays: d.closingDays > 0 ? d.closingDays : 45,
      escalation: d.escalation ?? false,
      escalationIncrement: d.escIncrement,
      escalationCap: d.escMax,
      emdPercent: d.earnestPct,
      sellerCredits: d.sellerCredits,
      preApprovalUploaded: !!(preApprovalPath || preApprovalLocalFile),
    });
  }, [d, property.price, preApprovalPath, preApprovalLocalFile]);

  // Supabase offer row ID — once created, subsequent saves use upsert with this id
  const supabaseOfferId = useRef<string | null>(null);
  // Debounce timer ref for Supabase upserts
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Upsert draft offer to Supabase (debounced)
  const upsertOfferToSupabase = (currentStep: number, currentD: D, offerId: string | null) => {
    if (!SUPABASE_ENABLED || !user) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const supabase = await getSupabaseClient();
        const currentScore = scoreOffer({
          offerPrice: currentD.offerPrice > 0 ? currentD.offerPrice : property.price,
          listPrice: property.price,
          inspectionContingency: currentD.inspectionContingency ?? true,
          financingContingency: currentD.financeType === "cash" ? false : (currentD.financingContingency ?? true),
          appraisalContingency: currentD.financeType === "cash" ? false : (currentD.appraisalContingency ?? true),
          cashOffer: currentD.financeType === "cash",
          closingDays: currentD.closingDays > 0 ? currentD.closingDays : 45,
          escalation: currentD.escalation ?? false,
          escalationIncrement: currentD.escIncrement,
          escalationCap: currentD.escMax,
          emdPercent: currentD.earnestPct,
          sellerCredits: currentD.sellerCredits,
          preApprovalUploaded: !!(preApprovalPath),
        });
        const payload: Record<string, unknown> = {
          user_id: user.id,
          address: `${property.address}, ${property.city}, ${property.state} ${property.zip}`,
          list_price: property.price,
          status: "draft" as const,
          tier: currentScore.tier,
          ai_score: currentScore.score,
          offer_price: currentD.offerPrice > 0 ? currentD.offerPrice : null,
          terms: { step: currentStep, ...currentD, preApprovalPath } as Record<string, unknown>,
        };
        // Only set property_id FK when the id is a real UUID (DB row)
        if (isValidUUID(propertyId)) {
          payload.property_id = propertyId;
        }
        if (offerId) {
          payload.id = offerId;
        }
        const { data, error } = await supabase
          .from("offers")
          .upsert(payload, { onConflict: "id" })
          .select("id")
          .single();
        if (error) {
          console.error("offer-builder: Supabase upsert failed", error);
          return;
        }
        if (data?.id && !offerId) {
          supabaseOfferId.current = data.id as string;
        }
      } catch (err) {
        console.error("offer-builder: Supabase save error", err);
      }
    }, 600);
  };

  // Persist to localStorage whenever d or step changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ step, d }));
    } catch {}
  }, [d, step, storageKey]);

  // On mount (step >= 1 or when user advances to step 2+): create initial draft
  useEffect(() => {
    if (step >= 1) {
      upsertOfferToSupabase(step, d, supabaseOfferId.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    track({ event: "offer_builder_started", property_id: property.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup: cancel any pending debounced save on unmount
  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current); }, []);

  const clearProgress = () => {
    try { localStorage.removeItem(storageKey); } catch {}
    setD(INITIAL_D);
    setStep(0);
    supabaseOfferId.current = null;
    setShowHelper(false);
    setHint(false);
    setPreApprovalPath(null);
    setPreApprovalUploadError(null);
    setPreApprovalLocalFile(null);
  };

  const handlePreApprovalUpload = async (file: File) => {
    // Validate type
    if (file.type !== "application/pdf") {
      setPreApprovalUploadError("Only PDF files are accepted.");
      return;
    }
    // Validate size (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setPreApprovalUploadError("File must be 10 MB or smaller.");
      return;
    }
    setPreApprovalUploadError(null);
    setPreApprovalLocalFile(file);

    if (!SUPABASE_ENABLED) {
      // Store locally only — no upload
      return;
    }

    setPreApprovalUploading(true);
    try {
      const supabase = await getSupabaseClient();
      const userId = user?.id ?? "anon";
      const offerId = supabaseOfferId.current;
      const prefix = offerId ?? String(Date.now());
      const storagePath = `pre-approvals/${userId}/${prefix}-preapproval.pdf`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(storagePath, file, { upsert: true });

      if (uploadError) {
        console.error("offer-builder: pre-approval upload failed", uploadError);
        setPreApprovalUploadError("Upload failed — please try again.");
        setPreApprovalUploading(false);
        return;
      }

      const savedPath = uploadData?.path ?? storagePath;
      setPreApprovalPath(savedPath);

      // Insert row into public.documents only when we have an offer_id
      if (offerId) {
        const { error: dbError } = await supabase
          .from("documents")
          .insert({ offer_id: offerId, type: "pre_approval", storage_path: savedPath });
        if (dbError) {
          console.error("offer-builder: documents insert failed", dbError);
        }
      }
    } catch (err) {
      console.error("offer-builder: pre-approval upload error", err);
      setPreApprovalUploadError("Upload failed — please try again.");
    } finally {
      setPreApprovalUploading(false);
    }
  };

  const handleFinalSubmit = async () => {
    track({ event: "offer_builder_submitted" });
    setSubmitError(null);

    // Always update localStorage to mark as submitted
    try {
      const saved = localStorage.getItem(storageKey);
      const parsed = saved ? JSON.parse(saved) : {};
      localStorage.setItem(storageKey, JSON.stringify({ ...parsed, status: "submitted" }));
    } catch {}

    if (SUPABASE_ENABLED && user) {
      setIsSubmitting(true);
      try {
        const offerId = supabaseOfferId.current;
        if (offerId) {
          const res = await fetch(`/api/offers/${offerId}/submit`, { method: "POST" });
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            console.error("offer-builder: failed to submit offer", body);
            setSubmitError("Failed to submit offer — please try again");
            setIsSubmitting(false);
            return;
          }
          setIsSubmitting(false);
          router.push(`/offer-submitted?offerId=${offerId}`);
          return;
        } else {
          // No Supabase row yet — fall through to pricing modal
          setIsSubmitting(false);
        }
      } catch (err) {
        console.error("offer-builder: submit error", err);
        setSubmitError("Failed to submit offer — please try again");
        setIsSubmitting(false);
        return;
      }
    }

    // Fallback: open pricing modal when Supabase is not enabled or no row id
    setShowPricingModal(true);
  };

  const set = <K extends keyof D>(k:K, v:D[K]) => setD(p=>({...p,[k]:v}));
  const pct = Math.round((step/(TOTAL-1))*100);
  const activeSection = SECTIONS.find(s => s.steps.includes(step));

  const next = () => {
    // If leaving the signature step, capture the canvas data first
    if (step === 15) {
      const canvas = sigCanvasRef.current;
      if (canvas && !canvas.isEmpty()) {
        const dataUrl = canvas.toDataURL("image/png");
        const updatedD = { ...d, signatureDataUrl: dataUrl, signatureDate: new Date().toISOString() };
        setD(updatedD);
        if (!canContinue(step, updatedD)) {
          setHint(true);
          setTimeout(() => setHint(false), 3000);
          return;
        }
        const nextStep = Math.min(TOTAL - 1, step + 1);
        setStep(nextStep);
        track({ event: "offer_builder_step_completed", step, step_name: activeSection?.label ?? "" });
        setShowHelper(false);
        setHint(false);
        if (nextStep >= 1) {
          upsertOfferToSupabase(nextStep, updatedD, supabaseOfferId.current);
        }
        return;
      }
    }
    if (!canContinue(step, d)) {
      setHint(true);
      setTimeout(() => setHint(false), 3000);
      return;
    }
    const nextStep = Math.min(TOTAL - 1, step + 1);
    setStep(nextStep);
    track({ event: "offer_builder_step_completed", step, step_name: activeSection?.label ?? "" });
    setShowHelper(false);
    setHint(false);
    // Supabase auto-save: trigger on advancing to step 2+ (after setup section starts)
    if (nextStep >= 1) {
      upsertOfferToSupabase(nextStep, d, supabaseOfferId.current);
    }
  };
  const back = () => { setStep(s=>Math.max(0,s-1)); setShowHelper(false); setHint(false); };

  const continueDisabled = !canContinue(step, d);

  /* ── Nav content (shared between in-flow and sticky) ── */
  const navContent = (
    <>
      {submitError && (
        <p role="alert" style={{fontSize:13,color:"var(--red)",fontWeight:500,textAlign:"center",gridColumn:"1/-1",margin:"4px 0 -4px"}}>
          {submitError}
        </p>
      )}
      <button onClick={back} disabled={step===0}
        style={{display:"flex",alignItems:"center",gap:8,padding:"12px 20px",background:"transparent",border:"1.5px solid var(--gray-200)",borderRadius:10,fontSize:14,fontWeight:500,color:"var(--gray-700)",cursor:step===0?"not-allowed":"pointer",opacity:step===0?.4:1}}>
        <ArrowLeft style={{width:15,height:15}}/> Back
      </button>

      <div style={{textAlign:"center"}}>
        <span style={{fontSize:12,color:"var(--gray-400)"}}>{step+1} of {TOTAL}</span>
        {hint && (
          <p style={{fontSize:12,color:"var(--amber)",fontWeight:500,marginTop:4}}>
            {step === 15 ? "Please sign and enter your printed name to continue" : "Select an option to continue"}
          </p>
        )}
      </div>

      {step < TOTAL-1
        ? <button onClick={next}
            style={{display:"flex",alignItems:"center",gap:8,padding:"12px 28px",background:"var(--blue)",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:continueDisabled?"not-allowed":"pointer",opacity:continueDisabled?0.5:1,transition:"opacity .15s"}}>
            Continue <ArrowRight style={{width:15,height:15}}/>
          </button>
        : <button onClick={handleFinalSubmit} disabled={isSubmitting}
            style={{display:"flex",alignItems:"center",gap:8,padding:"12px 28px",background:"var(--blue)",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:isSubmitting?"not-allowed":"pointer",opacity:isSubmitting?0.6:1,transition:"opacity .15s"}}>
            {isSubmitting ? "Submitting…" : "Submit offer"} <ArrowRight style={{width:15,height:15}}/>
          </button>
      }
    </>
  );

  return (
    <div style={{minHeight:"100vh",background:"var(--gray-50)"}}>
      {/* ── Top bar ── */}
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:50,background:"#fff",borderBottom:"1px solid var(--gray-200)",paddingTop:"env(safe-area-inset-top)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
          <Link href="/" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
            <div style={{width:28,height:28,borderRadius:7,background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Home style={{width:14,height:14,color:"#fff"}}/>
            </div>
            <span style={{fontWeight:700,color:"var(--gray-900)",fontSize:15}}>HomeOffer<span style={{color:"var(--blue)"}}>Direct</span></span>
          </Link>
          <div className="hidden sm:block" style={{flex:1,maxWidth:360,margin:"0 24px"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--gray-500)",marginBottom:6}}>
              <span style={{fontWeight:600,color:"var(--blue)"}}>{activeSection?.label}</span>
              <span>{pct}% complete</span>
            </div>
            <div style={{height:4,background:"var(--gray-100)",borderRadius:4,overflow:"hidden"}}>
              <div style={{height:4,width:`${pct}%`,background:"linear-gradient(90deg,#2563eb,#7c3aed)",borderRadius:4,transition:"width .4s ease"}}/>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={() => setConfirmReset(true)} title="Start over"
              style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:"var(--gray-400)",background:"none",border:"none",cursor:"pointer",padding:"4px 8px",borderRadius:6}}>
              <RotateCcw style={{width:13,height:13}}/> Start over
            </button>
            <button onClick={()=>router.push(exitDest)}
              style={{display:"flex",alignItems:"center",gap:4,fontSize:13,color:"var(--gray-500)",background:"none",border:"none",cursor:"pointer",padding:0}}>
              <ArrowLeft style={{width:14,height:14}}/> Exit
            </button>
          </div>
        </div>
      </div>

      {/* Mobile progress bar — below the top bar, sm and below only */}
      <div className="sm:hidden fixed left-0 right-0 z-40 bg-white border-b border-gray-100 px-4 pb-2" style={{top:"calc(56px + env(safe-area-inset-top))"}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--gray-500)",marginBottom:4}}>
          <span style={{fontWeight:600,color:"var(--blue)"}}>{activeSection?.label}</span>
          <span>{pct}% complete</span>
        </div>
        <div style={{height:3,background:"var(--gray-100)",borderRadius:4,overflow:"hidden"}}>
          <div style={{height:3,width:`${pct}%`,background:"linear-gradient(90deg,#2563eb,#7c3aed)",borderRadius:4,transition:"width .4s ease"}}/>
        </div>
      </div>

      {/* ── Layout ── */}
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-start" style={{maxWidth:1100,margin:"0 auto",paddingLeft:16,paddingRight:16,paddingBottom:80,paddingTop:"max(116px, calc(56px + env(safe-area-inset-top) + 36px))"}}>

        {/* Left sidebar — hidden on mobile via inline style trick */}
        <div style={{position:"sticky",top:80}} className="hidden md:block">
          <div className="card" style={{padding:"12px 8px"}}>
            {SECTIONS.map(sec => {
              const done = sec.steps.every(i=>i<step);
              const active = sec.steps.includes(step);
              return (
                <div key={sec.id}
                  className={`step-sidebar-item ${done?"done":""} ${active?"active":""}`}
                  style={{cursor: done?"pointer":"default"}}
                  onClick={()=>done&&setStep(sec.steps[0])}>
                  <div style={{width:18,height:18,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                    background: done?"#d1fae5": active?"var(--blue)":"var(--gray-100)",
                    color: done?"var(--green)": active?"#fff":"var(--gray-300)"}}>
                    {done
                      ? <CheckCircle style={{width:11,height:11}}/>
                      : <span style={{fontSize:9,fontWeight:700}}>{SECTIONS.indexOf(sec)+1}</span>
                    }
                  </div>
                  {sec.label}
                </div>
              );
            })}
          </div>

          {/* Property mini card */}
          <div className="card" style={{marginTop:12,overflow:"hidden"}}>
            <div style={{height:80,backgroundImage:`url(${property.img})`,backgroundSize:"cover",backgroundPosition:"center"}}/>
            <div style={{padding:"10px 12px"}}>
              <p style={{fontSize:12,fontWeight:600,color:"var(--gray-900)"}}>{property.address}</p>
              <p style={{fontSize:11,color:"var(--gray-500)"}}>{property.city}, {property.state}</p>
              <p style={{fontSize:15,fontWeight:700,color:"var(--gray-900)",marginTop:4}}>{fmt(property.price)}</p>
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="w-full min-w-0" style={{maxWidth:560,paddingBottom:"max(96px, env(safe-area-inset-bottom))"}}>
          <div key={step} className="fade-up">
            <StepView step={step} d={d} set={set} showHelper={showHelper} toggleHelper={()=>setShowHelper(v=>!v)} property={property} dateValue={dateValue} setDateValue={setDateValue}
              preApprovalPath={preApprovalPath} preApprovalUploading={preApprovalUploading} preApprovalUploadError={preApprovalUploadError} preApprovalLocalFile={preApprovalLocalFile} onPreApprovalUpload={handlePreApprovalUpload}
              sigCanvasRef={sigCanvasRef as React.RefObject<SignatureCanvas>}
              scoringResult={scoringResult}/>
          </div>

          {/* Nav buttons — desktop only (hidden on mobile) */}
          <div className="hidden md:flex" style={{alignItems:"center",justifyContent:"space-between",marginTop:32,paddingTop:24,borderTop:"1px solid var(--gray-200)"}}>
            {navContent}
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40"
        style={{background:"#fff",borderTop:"1px solid var(--gray-200)",padding:"12px 16px",paddingBottom:"max(12px, env(safe-area-inset-bottom))"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:560,margin:"0 auto"}}>
          {navContent}
        </div>
      </div>

      {confirmReset && (
        <>
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",zIndex:299}} onClick={() => setConfirmReset(false)}/>
          <div role="alertdialog" aria-labelledby="confirm-reset-title" aria-describedby="confirm-reset-body"
            style={{position:"fixed",zIndex:300,top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"min(420px,calc(100vw - 32px))",background:"#fff",borderRadius:14,padding:24,boxShadow:"0 20px 60px -8px rgba(0,0,0,0.3)",border:"1px solid var(--gray-200)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <AlertTriangle style={{width:20,height:20,color:"var(--amber)"}}/>
              <h2 id="confirm-reset-title" style={{fontSize:17,fontWeight:700,color:"var(--gray-900)",margin:0}}>Start over?</h2>
            </div>
            <p id="confirm-reset-body" style={{fontSize:14,color:"var(--gray-500)",lineHeight:1.65,marginBottom:24}}>
              This will permanently delete your progress on this offer. You&apos;ve completed {step + 1} of {TOTAL} steps and this cannot be undone.
            </p>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button autoFocus onClick={() => setConfirmReset(false)}
                style={{padding:"10px 18px",borderRadius:10,border:"1.5px solid var(--gray-200)",background:"#fff",fontSize:14,fontWeight:500,color:"var(--gray-700)",cursor:"pointer"}}>
                Keep my progress
              </button>
              <button onClick={() => { setConfirmReset(false); clearProgress(); }}
                style={{padding:"10px 18px",borderRadius:10,background:"var(--red)",color:"#fff",border:"none",fontSize:14,fontWeight:600,cursor:"pointer"}}>
                Yes, start over
              </button>
            </div>
          </div>
        </>
      )}

      {showPricingModal && (
        <>
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:200}} onClick={() => setShowPricingModal(false)}/>
          <div role="dialog" aria-modal="true" aria-labelledby="pricing-modal-title"
            style={{position:"fixed",zIndex:201,top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"min(640px,calc(100vw - 32px))",background:"#fff",borderRadius:16,boxShadow:"0 25px 60px -12px rgba(0,0,0,0.3)",maxHeight:"90vh",overflowY:"auto"}}>
            {/* Header */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px",borderBottom:"1px solid var(--gray-200)"}}>
              <h2 id="pricing-modal-title" style={{fontSize:18,fontWeight:700,color:"var(--gray-900)",margin:0}}>Get your offer package</h2>
              <button onClick={() => setShowPricingModal(false)} aria-label="Close pricing options"
                style={{width:32,height:32,borderRadius:8,border:"1px solid var(--gray-200)",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                <X style={{width:16,height:16,color:"var(--gray-500)"}}/>
              </button>
            </div>
            {/* Property context strip */}
            <div className="flex flex-wrap items-center justify-between gap-2" style={{padding:"12px 24px",background:"var(--gray-50)",borderBottom:"1px solid var(--gray-200)",fontSize:13,color:"var(--gray-700)",fontWeight:500}}>
              <span>{property.address}, {property.city} {property.state}</span>
              <span>${property.price.toLocaleString()}</span>
            </div>
            {/* Plans */}
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{gap:16,padding:24}}>
              {/* Basic */}
              <div style={{border:"1.5px solid var(--gray-200)",borderRadius:12,padding:20}}>
                <p style={{fontSize:13,fontWeight:600,color:"var(--gray-500)",marginBottom:8}}>BASIC</p>
                <p style={{fontSize:28,fontWeight:800,color:"var(--gray-900)",marginBottom:4}}>$29</p>
                <p style={{fontSize:12,color:"var(--gray-400)",marginBottom:16}}>one-time per offer</p>
                {["Full PDF offer package","State-specific purchase agreement","All required addendums","Professional cover letter"].map(f=>(
                  <div key={f} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <CheckCircle style={{width:14,height:14,color:"var(--green)",flexShrink:0}}/>
                    <span style={{fontSize:13,color:"var(--gray-700)"}}>{f}</span>
                  </div>
                ))}
                <Link href={`/signup?plan=basic&property=${property.id}`}
                  style={{display:"block",width:"100%",marginTop:20,padding:"12px",borderRadius:10,background:"var(--gray-900)",color:"#fff",textAlign:"center",fontSize:14,fontWeight:600,textDecoration:"none"}}>
                  Choose Basic
                </Link>
              </div>
              {/* Premium */}
              <div style={{border:"2px solid var(--blue)",borderRadius:12,padding:20,position:"relative"}}>
                <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:"var(--blue)",color:"#fff",fontSize:11,fontWeight:700,padding:"3px 12px",borderRadius:99}}>★ Popular</div>
                <p style={{fontSize:13,fontWeight:600,color:"var(--blue)",marginBottom:8}}>PREMIUM</p>
                <p style={{fontSize:28,fontWeight:800,color:"var(--gray-900)",marginBottom:4}}>$99</p>
                <p style={{fontSize:12,color:"var(--gray-400)",marginBottom:16}}>one-time per offer</p>
                {["Everything in Basic","Direct email to listing agent","Read receipt tracking","AI negotiation copilot","Unlimited revisions"].map(f=>(
                  <div key={f} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <CheckCircle style={{width:14,height:14,color:"var(--blue)",flexShrink:0}}/>
                    <span style={{fontSize:13,color:"var(--gray-700)"}}>{f}</span>
                  </div>
                ))}
                <Link href={`/signup?plan=premium&property=${property.id}`}
                  style={{display:"block",width:"100%",marginTop:20,padding:"12px",borderRadius:10,background:"var(--blue)",color:"#fff",textAlign:"center",fontSize:14,fontWeight:600,textDecoration:"none"}}>
                  Choose Premium
                </Link>
              </div>
            </div>
            {/* Legal */}
            <div className="warn-box" style={{margin:"0 24px 24px"}}>
              <p style={{fontSize:12,color:"var(--gray-600)"}}>⚖️ HomeOfferDirect is not a law firm. We strongly recommend having a licensed real estate attorney review your offer before submitting.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   PAGE EXPORT (wraps inner in Suspense)
───────────────────────────────────────────────── */
export default function OfferBuilderPage() {
  return (
    <Suspense fallback={<LoadingSpinner/>}>
      <OfferBuilderInner/>
    </Suspense>
  );
}

/* ─────────────────────────────────────────────────
   INDIVIDUAL STEP COMPONENTS
───────────────────────────────────────────────── */
type SetFn = <K extends keyof D>(k:K,v:D[K])=>void;

function Q({ title, subtitle, helper, children, showHelper, toggleHelper, titleTip }:
  { title:string; subtitle?:string; helper?:string; children:React.ReactNode; showHelper?:boolean; toggleHelper?:()=>void; titleTip?:string }) {
  return (
    <div>
      <h1 style={{fontSize:26,fontWeight:700,color:"var(--gray-900)",lineHeight:1.25,marginBottom:subtitle?8:24,display:"flex",alignItems:"center",flexWrap:"wrap",gap:4}}>
        {title}{titleTip && <TermTip tip={titleTip}/>}
      </h1>
      {subtitle && <p style={{fontSize:15,color:"var(--gray-500)",marginBottom:24,lineHeight:1.6}}>{subtitle}</p>}
      {helper && toggleHelper && (
        <div style={{marginBottom:20}}>
          <button onClick={toggleHelper}
            style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:"var(--blue)",background:"none",border:"none",cursor:"pointer",padding:0}}>
            <Info style={{width:14,height:14}}/>
            {showHelper ? "Hide explanation" : "What does this mean?"}
            {showHelper ? <ChevronUp style={{width:12,height:12}}/> : <ChevronDown style={{width:12,height:12}}/>}
          </button>
          {showHelper && (
            <div className="helper-box" style={{marginTop:10}}>
              <p style={{fontSize:13,color:"var(--gray-700)",lineHeight:1.6}}>{helper}</p>
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function OptionCard({ label, desc, icon, selected, onClick, badge, warn }:
  { label:string; desc?:string; icon?:string; selected:boolean; onClick:()=>void; badge?:string; warn?:boolean }) {
  return (
    <button className={`option-card ${selected?"selected":""}`} onClick={onClick}
      style={{marginBottom:10, borderColor: warn&&!selected?"var(--amber)":undefined}}>
      {icon && <span style={{fontSize:24,flexShrink:0}}>{icon}</span>}
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:15,fontWeight:600,color:"var(--gray-900)"}}>{label}</span>
          {badge && <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:99,background:selected?"#dbeafe":"var(--gray-100)",color:selected?"var(--blue)":"var(--gray-500)"}}>{badge}</span>}
          {warn && !selected && <AlertTriangle style={{width:14,height:14,color:"var(--amber)"}}/>}
        </div>
        {desc && <p style={{fontSize:13,color:"var(--gray-500)",marginTop:2,lineHeight:1.5}}>{desc}</p>}
      </div>
      <div className="check">
        {selected && <CheckCircle style={{width:13,height:13,color:"#fff"}}/>}
      </div>
    </button>
  );
}

function StepView({ step, d, set, showHelper, toggleHelper, property, dateValue, setDateValue,
  preApprovalPath, preApprovalUploading, preApprovalUploadError, preApprovalLocalFile, onPreApprovalUpload, sigCanvasRef, scoringResult }:
  { step:number; d:D; set:SetFn; showHelper:boolean; toggleHelper:()=>void; property:Property; dateValue:string; setDateValue:(v:string)=>void;
    preApprovalPath:string|null; preApprovalUploading:boolean; preApprovalUploadError:string|null; preApprovalLocalFile:File|null; onPreApprovalUpload:(f:File)=>Promise<void>;
    sigCanvasRef: React.RefObject<SignatureCanvas>; scoringResult: ScoringResult }) {

  // ── Step 0: Buyer type ──────────────────────────────────────────────
  if (step===0) return (
    <Q title="What best describes you?" subtitle="We'll personalize your guidance based on your experience.">
      {[
        {v:"first", icon:"🏡", label:"First-time buyer", desc:"I've never purchased a home before"},
        {v:"experienced", icon:"🔑", label:"I've bought before", desc:"I've been through the process at least once"},
        {v:"investor", icon:"📈", label:"Real estate investor", desc:"I buy properties regularly"},
      ].map(o=>(
        <OptionCard key={o.v} label={o.label} desc={o.desc} icon={o.icon}
          selected={d.buyerType===o.v} onClick={()=>set("buyerType",o.v)}/>
      ))}
    </Q>
  );

  // ── Step 1: State ───────────────────────────────────────────────────
  if (step===1) return (
    <Q title="Which state is the property in?"
      subtitle="Each state uses different legal forms. We'll automatically load the correct ones.">
      <select
        className="input-field"
        value={d.state ?? ""}
        onChange={e => set("state", e.target.value)}
        style={{fontSize:15}}>
        <option value="" disabled>Select a state...</option>
        {[
          {v:"AL",label:"Alabama"},{v:"AK",label:"Alaska"},{v:"AZ",label:"Arizona"},
          {v:"AR",label:"Arkansas"},{v:"CA",label:"California"},{v:"CO",label:"Colorado"},
          {v:"CT",label:"Connecticut"},{v:"DE",label:"Delaware"},{v:"FL",label:"Florida"},
          {v:"GA",label:"Georgia"},{v:"HI",label:"Hawaii"},{v:"ID",label:"Idaho"},
          {v:"IL",label:"Illinois"},{v:"IN",label:"Indiana"},{v:"IA",label:"Iowa"},
          {v:"KS",label:"Kansas"},{v:"KY",label:"Kentucky"},{v:"LA",label:"Louisiana"},
          {v:"ME",label:"Maine"},{v:"MD",label:"Maryland"},{v:"MA",label:"Massachusetts"},
          {v:"MI",label:"Michigan"},{v:"MN",label:"Minnesota"},{v:"MS",label:"Mississippi"},
          {v:"MO",label:"Missouri"},{v:"MT",label:"Montana"},{v:"NE",label:"Nebraska"},
          {v:"NV",label:"Nevada"},{v:"NH",label:"New Hampshire"},{v:"NJ",label:"New Jersey"},
          {v:"NM",label:"New Mexico"},{v:"NY",label:"New York"},{v:"NC",label:"North Carolina"},
          {v:"ND",label:"North Dakota"},{v:"OH",label:"Ohio"},{v:"OK",label:"Oklahoma"},
          {v:"OR",label:"Oregon"},{v:"PA",label:"Pennsylvania"},{v:"RI",label:"Rhode Island"},
          {v:"SC",label:"South Carolina"},{v:"SD",label:"South Dakota"},{v:"TN",label:"Tennessee"},
          {v:"TX",label:"Texas"},{v:"UT",label:"Utah"},{v:"VT",label:"Vermont"},
          {v:"VA",label:"Virginia"},{v:"WA",label:"Washington"},{v:"WV",label:"West Virginia"},
          {v:"WI",label:"Wisconsin"},{v:"WY",label:"Wyoming"},
        ].map(s => <option key={s.v} value={s.v}>{s.label}</option>)}
      </select>
      {d.state && (
        <div className="helper-box" style={{marginTop:12}}>
          <p style={{fontSize:13,color:"var(--gray-700)"}}>
            {d.state === "IL" ? "Illinois CAR forms loaded — attorney review is standard in Illinois." :
             d.state === "TX" ? "Texas TREC forms loaded — no attorney review required by law." :
             d.state === "CA" ? "California CAR forms loaded." :
             d.state === "NY" ? "New York NYSBA forms loaded — attorney review is standard in New York." :
             d.state === "FL" ? "Florida FAR forms loaded." :
             `${d.state} state forms loaded. Full state-specific guidance coming soon.`}
          </p>
        </div>
      )}
    </Q>
  );

  // ── Step 2: Pre-approval ────────────────────────────────────────────
  if (step===2) return (
    <Q title="Do you have a mortgage pre-approval?"
      titleTip={TIPS.preApproval}
      subtitle="This is one of the most important things sellers look at."
      helper="A pre-approval letter from a lender shows the seller you've already been approved for a loan up to a certain amount. It's different from a pre-qualification — sellers take pre-approvals much more seriously. If you're paying all cash, select that option instead."
      showHelper={showHelper} toggleHelper={toggleHelper}>
      <OptionCard icon="✅" label="Yes, I'm pre-approved"
        desc="I have a letter from my lender ready to attach."
        badge="Strongest position"
        selected={d.financeType!=="cash" && d.preApproved===true}
        onClick={()=>{set("preApproved",true); set("financeType","conventional");}}/>
      <OptionCard icon="💵" label="I'm paying all cash"
        desc="No mortgage needed. This is the strongest possible offer."
        badge="Most competitive"
        selected={d.financeType==="cash"}
        onClick={()=>{set("financeType","cash"); set("preApproved",null);}}/>
      <OptionCard icon="📄" label="No pre-approval yet"
        desc="I haven't started the mortgage process."
        warn={true}
        selected={d.financeType!=="cash" && d.preApproved===false}
        onClick={()=>{set("preApproved",false); set("financeType","conventional");}}/>
      {d.financeType!=="cash" && d.preApproved===false && (
        <div className="warn-box" style={{marginTop:8}}>
          <p style={{fontSize:13,color:"#92400e"}}>⚠️ <strong>Tip:</strong> Sellers often won't consider offers without pre-approval. We recommend getting one before submitting — it takes 24–48 hours online.</p>
        </div>
      )}
      {/* Pre-qualification vs pre-approval explainer */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginTop:12,padding:"8px 12px",background:"var(--gray-50)",borderRadius:8,border:"1px solid var(--gray-200)"}}>
        <TermTip tip={TIPS.preQualification}/>
        <p style={{fontSize:12,color:"var(--gray-600)",lineHeight:1.5}}>
          <strong>Pre-approval vs. pre-qualification:</strong> Not sure of the difference? Click the icon.
        </p>
      </div>
      {d.financeType!=="cash" && d.preApproved===true && (
        <div style={{marginTop:16}}>
          {preApprovalPath || preApprovalLocalFile ? (
            <div className="good-box" style={{display:"flex",alignItems:"center",gap:10}}>
              <CheckCircle style={{width:16,height:16,color:"var(--green)",flexShrink:0}}/>
              <span style={{fontSize:13,fontWeight:600,color:"#065f46"}}>
                Pre-approval uploaded ✓
                {preApprovalLocalFile && !preApprovalPath && " (saved locally)"}
              </span>
            </div>
          ) : (
            <div style={{border:"1.5px dashed var(--gray-300)",borderRadius:10,padding:"18px 20px",background:"var(--gray-50)"}}>
              <label style={{display:"block",cursor:"pointer"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <span style={{fontSize:20}}>📎</span>
                  <span style={{fontSize:14,fontWeight:600,color:"var(--gray-700)"}}>
                    {preApprovalUploading ? "Uploading…" : "Upload pre-approval letter (PDF)"}
                  </span>
                </div>
                <p style={{fontSize:12,color:"var(--gray-400)",marginBottom:12}}>Accepted: PDF only · Max 10 MB</p>
                <input
                  type="file"
                  accept="application/pdf"
                  disabled={preApprovalUploading}
                  style={{display:"none"}}
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) { onPreApprovalUpload(f); }
                    e.target.value = "";
                  }}
                />
                <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 18px",background:preApprovalUploading?"var(--gray-200)":"var(--blue)",color:"#fff",borderRadius:8,fontSize:13,fontWeight:600,opacity:preApprovalUploading?0.7:1,transition:"opacity .15s"}}>
                  {preApprovalUploading ? "Uploading…" : "Choose PDF"}
                </div>
              </label>
              {preApprovalUploadError && (
                <p role="alert" style={{fontSize:13,color:"var(--red)",fontWeight:500,marginTop:10}}>
                  {preApprovalUploadError}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </Q>
  );

  // ── Step 3: Property confirm ────────────────────────────────────────
  if (step===3) return (
    <Q title="Confirm the property" subtitle="Here's the home you're making an offer on.">
      <div className="card" style={{overflow:"hidden",marginBottom:16}}>
        <div style={{height:180,backgroundImage:`url(${property.img})`,backgroundSize:"cover",backgroundPosition:"center"}}/>
        <div style={{padding:"16px 20px"}}>
          {[
            ["Address",`${property.address}, ${property.city}, ${property.state} ${property.zip}`],
            ["List price", fmt(property.price)],
            ["Beds / Baths", `${property.beds} bd · ${property.baths} ba · ${property.sqft.toLocaleString()} sqft`],
            ["Days on market", `${property.dom} days`],
            ["Listing agent", `${property.agent} · ${property.brokerage}`],
            ["State forms",
              d.state === "IL" ? "Illinois Residential Purchase & Sale Agreement" :
              d.state === "TX" ? "Texas TREC One to Four Family Residential Contract" :
              d.state === "CA" ? "California Residential Purchase Agreement" :
              d.state === "NY" ? "New York Standard Form Purchase Agreement" :
              d.state === "FL" ? "Florida FAR/BAR As Is Residential Contract" :
              `${d.state} Residential Purchase Agreement`
            ],
          ].map(([k,v])=>(
            <div key={k} className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1" style={{padding:"10px 0",borderBottom:"1px solid var(--gray-100)"}}>
              <span style={{fontSize:13,color:"var(--gray-500)",flexShrink:0}}>{k}</span>
              <span style={{fontSize:13,fontWeight:600,color:"var(--gray-900)",textAlign:"right",maxWidth:"65%"}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="good-box">
        <p style={{fontSize:13,color:"#065f46",lineHeight:1.6}}>
          ✓ This home has been on the market for {property.dom} days. Comparable homes in this ZIP sold for 101–103% of asking price in the last 90 days.
        </p>
      </div>
    </Q>
  );

  // ── Step 4: Offer price ─────────────────────────────────────────────
  if (step===4) return (
    <Q title="How much do you want to offer?"
      subtitle={`The asking price is ${fmt(property.price)}. Here's what the market data suggests.`}
      helper="Your offer price is the amount you're willing to pay for the home. Going above asking can win bidding wars but you don't want to overpay. Going below asking may save money but could lose the deal. The AI recommendation is based on recent nearby sales, days on market, and current inventory levels."
      showHelper={showHelper} toggleHelper={toggleHelper}>

      {/* AI recommendation banner */}
      <div style={{background:"var(--blue-light)",border:"1.5px solid #bfdbfe",borderRadius:12,padding:"14px 18px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <span style={{fontSize:14}}>🤖</span>
          <span style={{fontSize:13,fontWeight:600,color:"var(--blue)"}}>AI Recommendation for Chicago · Lincoln Park</span>
        </div>
        <p style={{fontSize:13,color:"var(--gray-700)",lineHeight:1.6}}>
          Based on 14 recent sales, homes here sell for <strong>1–3% above asking</strong> in 9 days average. I recommend <strong>{fmt(Math.round(property.price*1.015))}</strong> — competitive without overbidding.
        </p>
      </div>

      {/* Quick picks */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {[
          {p:property.price-15000, label:"$15K below asking", note:"Low risk of winning"},
          {p:property.price,       label:"At asking price",   note:"Moderate"},
          {p:Math.round(property.price*1.015), label:"~1.5% above asking", note:"AI recommended", ai:true},
          {p:property.price+20000, label:"$20K above asking", note:"Very competitive"},
        ].map(o=>(
          <button key={o.p} onClick={()=>set("offerPrice",o.p)}
            style={{padding:"14px 16px",border:`1.5px solid ${d.offerPrice===o.p?"var(--blue)":"var(--gray-200)"}`,borderRadius:10,
              background:d.offerPrice===o.p?"var(--blue-light)":"#fff",cursor:"pointer",textAlign:"left",transition:"all .15s"}}>
            <div style={{fontSize:15,fontWeight:700,color:d.offerPrice===o.p?"var(--blue)":"var(--gray-900)"}}>{fmt(o.p)}</div>
            <div style={{fontSize:11,color:"var(--gray-500)",marginTop:2}}>{o.label}</div>
            {o.ai && <div style={{fontSize:11,color:"var(--blue)",fontWeight:600,marginTop:2}}>✦ AI pick</div>}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <label style={{display:"block",fontSize:13,fontWeight:500,color:"var(--gray-700)",marginBottom:6}}>Or enter your own amount</label>
      <div style={{position:"relative"}}>
        <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",color:"var(--gray-500)",fontSize:15}}>$</span>
        <input type="number" value={d.offerPrice || ""} placeholder={String(property.price)} onChange={e=>set("offerPrice",+e.target.value)}
          className="input-field" style={{paddingLeft:28}}/>
      </div>

      {/* Strength bar */}
      {d.offerPrice > 0 && <div style={{marginTop:16,padding:"14px 16px",background:"var(--gray-50)",borderRadius:10,border:"1px solid var(--gray-200)"}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:8}}>
          <span style={{color:"var(--gray-600)"}}>Offer strength vs. asking price</span>
          <span style={{fontWeight:700,color:d.offerPrice>=property.price?"var(--green)":"var(--amber)"}}>
            {d.offerPrice>=property.price
              ? `+${fmt(d.offerPrice-property.price)} above (${((d.offerPrice/property.price-1)*100).toFixed(1)}%)`
              : `-${fmt(property.price-d.offerPrice)} below`}
          </span>
        </div>
        <div style={{height:6,background:"var(--gray-200)",borderRadius:3,overflow:"hidden"}}>
          <div style={{height:6,background:d.offerPrice>=property.price?"var(--green)":"var(--amber)",
            borderRadius:3,transition:"width .4s",
            width:`${Math.min(100,Math.max(5,50+(d.offerPrice-property.price)/property.price*300))}%`}}/>
        </div>
      </div>}
    </Q>
  );

  // ── Step 5: Loan type ───────────────────────────────────────────────
  if (step===5) return (
    <Q title="What type of loan are you using?"
      helper="Conventional loans are the most common and fastest to close. FHA loans allow lower down payments (3.5%) but take longer to close. VA loans are for veterans with great terms. All-cash offers close fastest and are strongest for the seller."
      showHelper={showHelper} toggleHelper={toggleHelper}>
      {d.financeType==="cash"
        ? (
          <div className="good-box">
            <p style={{fontSize:14,color:"#065f46",lineHeight:1.6}}>
              💵 <strong>All-cash offer selected</strong> — this is the strongest type of offer. No financing contingency needed. We'll skip the loan questions.
            </p>
          </div>
        )
        : [
          {v:"conventional", icon:"🏦", label:"Conventional loan", desc:"Most common. 30 or 15-year. Best for buyers with good credit.", badge:"Most common"},
          {v:"fha",          icon:"🏛️", label:"FHA loan",          desc:"Government-backed. As low as 3.5% down. Takes slightly longer."},
          {v:"va",           icon:"⭐", label:"VA loan",            desc:"Veterans only. No down payment required. Excellent terms.", badge:"Veterans only"},
        ].map(o=>(
          <OptionCard key={o.v} icon={o.icon} label={o.label} desc={o.desc} badge={o.badge}
            selected={d.financeType===o.v} onClick={()=>set("financeType",o.v as D["financeType"])}/>
        ))
      }
    </Q>
  );

  // ── Step 6: Down payment ────────────────────────────────────────────
  if (step===6) {
    if (d.financeType==="cash") return (
      <Q title="Great — you're paying all cash" subtitle="We'll skip the down payment and financing questions.">
        <div className="good-box">
          <p style={{fontSize:14,color:"#065f46",lineHeight:1.6}}>✓ Cash offers typically close in 2–3 weeks instead of 30–45 days, and sellers often accept cash at a slight discount. You'll need to provide proof of funds with your offer.</p>
        </div>
      </Q>
    );
    return (
      <Q title="How much are you putting down?"
        titleTip={TIPS.downPayment}
        subtitle="A larger down payment signals financial strength to sellers."
        helper="Your down payment is the percentage of the home price you pay upfront. The rest is covered by your mortgage. 20% down eliminates Private Mortgage Insurance (PMI), which can add $100–300/month to your payment."
        showHelper={showHelper} toggleHelper={toggleHelper}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            {p:3,  note:d.financeType==="fha"?"FHA minimum":"Low — PMI required",warn:true},
            {p:5,  note:"PMI required"},
            {p:10, note:"PMI required"},
            {p:20, note:"No PMI — ideal", best:true},
            {p:25, note:"Strong position"},
            {p:30, note:"Very strong"},
          ].map(o=>(
            <button key={o.p} onClick={()=>set("downPct",o.p)}
              style={{padding:"14px 16px",border:`1.5px solid ${d.downPct===o.p?"var(--blue)":"var(--gray-200)"}`,
                borderRadius:10,background:d.downPct===o.p?"var(--blue-light)":"#fff",cursor:"pointer",textAlign:"left",transition:"all .15s"}}>
              <div style={{fontSize:16,fontWeight:700,color:d.downPct===o.p?"var(--blue)":"var(--gray-900)"}}>{o.p}%</div>
              <div style={{fontSize:12,color:o.best?"var(--green)":o.warn?"var(--amber)":"var(--gray-500)",marginTop:2,fontWeight:o.best?600:400}}>{o.note}</div>
              <div style={{fontSize:12,color:"var(--gray-500)",marginTop:1}}>{fmt(Math.round(d.offerPrice*o.p/100))}</div>
            </button>
          ))}
        </div>
        {d.downPct>0 && d.downPct<20 && (
          <div className="warn-box" style={{marginTop:12}}>
            <p style={{fontSize:13,color:"#92400e"}}>⚠️ Below 20% down means you'll pay Private Mortgage Insurance (PMI) until you reach 20% equity. This adds roughly ${Math.round(d.offerPrice*0.005/12)}/month to your payment.</p>
          </div>
        )}
      </Q>
    );
  }

  // ── Step 7: Earnest money ───────────────────────────────────────────
  if (step===7) return (
    <Q title="How much earnest money (EMD) will you deposit?"
      titleTip={TIPS.earnestMoney}
      subtitle="This is a good-faith deposit that shows you're serious."
      helper="Earnest money is a deposit you make when your offer is accepted. It's held in an escrow account and applied to your down payment at closing. If you back out for reasons not covered by contingencies, you may lose this money. In Illinois, 2% of the purchase price is standard."
      showHelper={showHelper} toggleHelper={toggleHelper}>
      <div className="grid grid-cols-3" style={{gap:10,marginBottom:16}}>
        {[1,2,3].map(p=>(
          <button key={p} onClick={()=>set("earnestPct",p)}
            style={{padding:"14px",border:`1.5px solid ${d.earnestPct===p?"var(--blue)":"var(--gray-200)"}`,
              borderRadius:10,background:d.earnestPct===p?"var(--blue-light)":"#fff",cursor:"pointer",textAlign:"center",transition:"all .15s"}}>
            <div style={{fontSize:18,fontWeight:700,color:d.earnestPct===p?"var(--blue)":"var(--gray-900)"}}>{p}%</div>
            <div style={{fontSize:12,color:"var(--gray-500)",marginTop:2}}>{fmt(Math.round(d.offerPrice*p/100))}</div>
            {p===2&&<div style={{fontSize:11,color:"var(--green)",fontWeight:600,marginTop:2}}>IL standard</div>}
          </button>
        ))}
      </div>
      <div className="helper-box">
        <p style={{fontSize:13,color:".var(--gray-700)",lineHeight:1.6}}>
          ℹ️ In Illinois, earnest money must be deposited within <strong>24–48 hours</strong> of offer acceptance. Make sure you have {fmt(Math.round(d.offerPrice*d.earnestPct/100))} readily available in your bank account.
        </p>
      </div>
    </Q>
  );

  // ── Step 8: Closing timeline ────────────────────────────────────────
  if (step===8) return (
    <Q title="When do you want to close?"
      titleTip={TIPS.closingDate}
      subtitle="The closing date is when you get the keys and the home becomes yours."
      helper="The closing date is typically 30–45 days after offer acceptance. This gives time for inspections, appraisal, and your lender to finalize the loan. Sellers sometimes prefer faster or slower closings depending on their situation — offering flexibility can make your offer stand out."
      showHelper={showHelper} toggleHelper={toggleHelper}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {[
          {d:21, label:"21 days", note:"Fast — cash or very strong financing only"},
          {d:30, label:"30 days", note:"Standard in most markets", best:true},
          {d:45, label:"45 days", note:"Typical for FHA/VA loans"},
          {d:60, label:"60 days", note:"Flexible — seller may prefer this"},
        ].map(o=>(
          <button key={o.d} onClick={()=>{ set("closingDays",o.d); setDateValue(""); }}
            style={{padding:"14px 16px",border:`1.5px solid ${d.closingDays===o.d&&!dateValue?"var(--blue)":"var(--gray-200)"}`,
              borderRadius:10,background:d.closingDays===o.d&&!dateValue?"var(--blue-light)":"#fff",cursor:"pointer",textAlign:"left",transition:"all .15s"}}>
            <div style={{fontSize:15,fontWeight:700,color:d.closingDays===o.d&&!dateValue?"var(--blue)":"var(--gray-900)"}}>{o.label}</div>
            <div style={{fontSize:12,color:o.best?"var(--green)":"var(--gray-500)",marginTop:3,fontWeight:o.best?600:400}}>{o.note}</div>
          </button>
        ))}
      </div>
      <label style={{display:"block",fontSize:13,fontWeight:500,color:"var(--gray-700)",marginBottom:6}}>Or pick a specific date</label>
      <input type="date" className="input-field"
        value={dateValue}
        min={new Date(Date.now()+15*86400000).toISOString().split("T")[0]}
        max={new Date(Date.now()+365*86400000).toISOString().split("T")[0]}
        onChange={e=>{ setDateValue(e.target.value); if (e.target.value) { const ms = new Date(e.target.value).getTime()-Date.now(); set("closingDays", Math.max(0, Math.round(ms/86400000))); } }}/>
      {dateValue && (
        <p style={{fontSize:13,marginTop:8,color:d.closingDays>=21?"var(--green)":"var(--amber)",fontWeight:500}}>
          That&apos;s {d.closingDays} days from today
        </p>
      )}
    </Q>
  );

  // ── Step 9: Inspection contingency ─────────────────────────────────
  if (step===9) return (
    <Q title="Do you want an inspection contingency?"
      titleTip={TIPS.inspectionContingency}
      subtitle="This lets you back out or renegotiate if the home inspection finds serious problems."
      helper="An inspection contingency gives you the right to hire a professional inspector to examine the home. If they find major issues, you can request repairs, ask for a price reduction, or walk away and get your earnest money back. Waiving this saves time but means you're buying 'as-is' — risky for older homes."
      showHelper={showHelper} toggleHelper={toggleHelper}>
      <OptionCard icon="🔍" label="Yes — include inspection contingency"
        desc="I want 10 days to inspect the home. Most buyers choose this." badge="Recommended"
        selected={d.inspectionContingency===true && d.inspectionDays===10}
        onClick={()=>{set("inspectionContingency",true); set("inspectionDays",10);}}/>
      <OptionCard icon="⚡" label="Yes — shorter 7-day inspection window"
        desc="Shows urgency. Useful in very competitive markets."
        selected={d.inspectionContingency===true && d.inspectionDays===7}
        onClick={()=>{set("inspectionContingency",true); set("inspectionDays",7);}}/>
      <OptionCard icon="🚫" label="No — waive the inspection contingency"
        desc="Strongest offer — but you accept the home in its current condition (as-is)."
        warn={true}
        selected={d.inspectionContingency===false}
        onClick={()=>set("inspectionContingency",false)}/>
      {/* As-is tip shown contextually when waiving */}
      {d.inspectionContingency===false && (
        <div style={{display:"flex",alignItems:"flex-start",gap:8,padding:"8px 12px",background:"var(--blue-light)",borderRadius:8,marginTop:-4,marginBottom:4}}>
          <TermTip tip={TIPS.asIs}/>
          <p style={{fontSize:12,color:"var(--blue)",lineHeight:1.5,marginLeft:2}}>What does <strong>&ldquo;as-is&rdquo;</strong> mean? Click the icon to learn more.</p>
        </div>
      )}
      {d.inspectionContingency===false && (
        <div className="warn-box" style={{marginTop:8}}>
          <p style={{fontSize:13,color:"#92400e",lineHeight:1.6}}>⚠️ <strong>High risk:</strong> Without an inspection, you could be responsible for costly hidden defects — HVAC failures, foundation issues, roof damage, etc. We strongly advise against this unless you're very familiar with the property.</p>
        </div>
      )}
    </Q>
  );

  // ── Step 10: Appraisal contingency ─────────────────────────────────
  if (step===10) return (
    <Q title="Do you want an appraisal contingency?"
      titleTip={TIPS.appraisalContingency}
      subtitle="This protects you if the bank says the home is worth less than your offer price."
      helper="When you get a mortgage, your lender requires a professional appraisal. If the home appraises below your offer price, the lender won't loan you the full amount. An appraisal contingency lets you renegotiate or back out. Without it, you'd need to cover the gap in cash."
      showHelper={showHelper} toggleHelper={toggleHelper}>
      <OptionCard icon="📊" label="Yes — include appraisal contingency"
        desc="I'm protected if the home appraises below my offer price." badge="Recommended"
        selected={d.appraisalContingency===true}
        onClick={()=>set("appraisalContingency",true)}/>
      <OptionCard icon="💪" label="No — waive appraisal contingency"
        desc="Stronger offer — but I must cover any gap between appraised value and offer price."
        warn={true}
        selected={d.appraisalContingency===false}
        onClick={()=>set("appraisalContingency",false)}/>
      {d.appraisalContingency===false && (
        <div className="warn-box" style={{marginTop:8}}>
          <p style={{fontSize:13,color:"#92400e",lineHeight:1.6}}>⚠️ You offered {fmt(d.offerPrice)} ({d.offerPrice > property.price ? fmt(d.offerPrice-property.price)+" above asking" : "at or below asking"}). If the home appraises at asking price, you'd need an extra <strong>{fmt(Math.max(0, d.offerPrice-property.price))} in cash at closing</strong>.</p>
        </div>
      )}
    </Q>
  );

  // ── Step 11: Financing contingency ─────────────────────────────────
  if (step===11) return (
    <Q title="Do you want a financing contingency?"
      titleTip={TIPS.financingContingency}
      subtitle="This lets you walk away if your mortgage falls through."
      helper="Even with a pre-approval, mortgages can fall through — your financial situation could change, the property might not qualify, or interest rates could move. A financing contingency means if you can't get your loan within the agreed period, you can back out and get your earnest money back."
      showHelper={showHelper} toggleHelper={toggleHelper}>
      {d.financeType==="cash"
        ? <div className="good-box"><p style={{fontSize:14,color:"#065f46",lineHeight:1.6}}>✓ Cash buyers don't need a financing contingency — you're not getting a mortgage. This is automatically skipped.</p></div>
        : <>
          <OptionCard icon="🛡️" label="Yes — include financing contingency"
            desc="I'm protected if I can't get my mortgage approved within 21 days." badge="Recommended"
            selected={d.financingContingency===true}
            onClick={()=>set("financingContingency",true)}/>
          <OptionCard icon="⚡" label="No — waive financing contingency"
            desc="Stronger offer but I risk losing my earnest money if my loan is denied."
            warn={true}
            selected={d.financingContingency===false}
            onClick={()=>set("financingContingency",false)}/>
          {d.financingContingency===false && (
            <div className="warn-box" style={{marginTop:8}}>
              <p style={{fontSize:13,color:"#92400e",lineHeight:1.6}}>⚠️ If your mortgage is denied, you could lose your {fmt(Math.round(d.offerPrice*d.earnestPct/100))} earnest money deposit. Only waive this if you're extremely confident in your financing.</p>
            </div>
          )}
        </>}
    </Q>
  );

  // ── Step 12: Escalation clause ─────────────────────────────────────
  if (step===12) return (
    <Q title="Do you want an escalation clause?"
      titleTip={TIPS.escalationClause}
      subtitle="If another buyer makes a higher offer, should yours automatically increase?"
      helper="An escalation clause says: 'I'll beat any other legitimate offer by $X, up to a maximum of $Y.' For example, you might offer $492K and escalate in $2,500 increments up to $510K. This lets you stay competitive without revealing your maximum upfront. It only triggers if there's a real competing offer."
      showHelper={showHelper} toggleHelper={toggleHelper}>
      <OptionCard icon="📈" label="Yes — add an escalation clause"
        desc="Automatically beat competing offers up to my maximum. Smart in competitive markets."
        selected={d.escalation===true}
        onClick={()=>set("escalation",true)}/>
      <OptionCard icon="📋" label="No — my offer is firm"
        desc="I'll submit my best price and not escalate."
        selected={d.escalation===false}
        onClick={()=>set("escalation",false)}/>
      {d.escalation===true && (
        <div className="card-sm" style={{padding:"16px 20px",marginTop:12,border:"1.5px solid #bfdbfe"}}>
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{gap:16}}>
            <div>
              <label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--gray-700)",marginBottom:6}}>Beat competing offers by</label>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--gray-400)",fontSize:13}}>$</span>
                <input type="number" value={d.escIncrement} onChange={e=>set("escIncrement",+e.target.value)}
                  className="input-field" style={{paddingLeft:24,fontSize:14}}/>
              </div>
            </div>
            <div>
              <label style={{display:"flex",alignItems:"center",fontSize:12,fontWeight:600,color:"var(--gray-700)",marginBottom:6}}>
                Up to my maximum (cap)<TermTip tip={TIPS.escalationCap}/>
              </label>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--gray-400)",fontSize:13}}>$</span>
                <input type="number" value={d.escMax} onChange={e=>set("escMax",+e.target.value)}
                  className="input-field" style={{paddingLeft:24,fontSize:14}}/>
              </div>
            </div>
          </div>
          <p style={{fontSize:12,color:"var(--gray-500)",marginTop:10,lineHeight:1.5}}>
            Your offer will automatically rise by {fmt(d.escIncrement)} increments to beat other offers, up to a max of {fmt(d.escMax)}.
          </p>
          {d.escMax > 0 && d.escMax <= d.offerPrice && (
            <div className="warn-box" style={{marginTop:10}}>
              <p style={{fontSize:13,color:"#92400e",lineHeight:1.5}}>
                ⚠️ Your maximum ({fmt(d.escMax)}) is at or below your offer price ({fmt(d.offerPrice)}) — the escalation clause won't activate.
              </p>
            </div>
          )}
        </div>
      )}
    </Q>
  );

  // ── Step 13: Seller credits ─────────────────────────────────────────
  if (step===13) return (
    <Q title="Are you requesting any seller credits?"
      titleTip={TIPS.sellerCredits}
      subtitle="Seller credits reduce your closing costs — the seller pays some of your fees."
      helper="Closing costs typically run 2–5% of the loan amount. You can ask the seller to cover some of these costs ('seller concessions'). This is more common in slower markets or when a home has been listed a while. In a very competitive market, asking for credits may weaken your offer."
      showHelper={showHelper} toggleHelper={toggleHelper}>
      <OptionCard icon="🙅" label="No seller credits"
        desc={`${property.dom<=14?"This market is competitive — skipping credits strengthens your offer.":"A clean offer is usually preferred."}`}
        badge={property.dom<=14?"Recommended":""}
        selected={d.sellerCredits===0}
        onClick={()=>set("sellerCredits",0)}/>
      <OptionCard icon="💰" label="Yes — request seller credits"
        desc="Ask the seller to cover some of my closing costs."
        selected={d.sellerCredits>0}
        onClick={()=>set("sellerCredits",5000)}/>
      {d.sellerCredits>0 && (
        <div style={{marginTop:12}}>
          <label style={{display:"block",fontSize:13,fontWeight:500,color:"var(--gray-700)",marginBottom:6}}>Credit amount requested</label>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",color:"var(--gray-400)",fontSize:15}}>$</span>
            <input type="number" value={d.sellerCredits} onChange={e=>set("sellerCredits",+e.target.value)}
              className="input-field" style={{paddingLeft:28}}/>
          </div>
          <p style={{fontSize:12,color:"var(--gray-500)",marginTop:6}}>Typical: $3,000–$10,000. Your max is often capped by lender rules.</p>
        </div>
      )}
    </Q>
  );

  // ── Step 14: Personal letter ────────────────────────────────────────
  if (step===14) return (
    <Q title="Add a personal letter to the seller?"
      subtitle="A heartfelt letter can sometimes tip a close decision in your favor."
      helper="Some sellers care deeply about who buys their home, especially if they've lived there for many years. A short, personal letter explaining who you are and why you love the home can create an emotional connection. Note: In some states, personal letters are discouraged to avoid fair housing issues — check with your attorney.">
      <OptionCard icon="✉️" label="Yes — add a personal letter"
        desc="I'll write a brief note about myself and why I love this home."
        selected={d.personalLetter===true}
        onClick={()=>set("personalLetter",true)}/>
      <OptionCard icon="📋" label="No — keep it business only"
        desc="Let the numbers speak. Clean, professional offer package."
        selected={d.personalLetter===false}
        onClick={()=>set("personalLetter",false)}/>
      {d.personalLetter===true && (
        <div style={{marginTop:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
            <span style={{fontSize:13,fontWeight:500,color:"var(--gray-700)"}}>Your personal letter</span>
            <span style={{fontSize:12,color:d.personalLetterText.length>=500?"var(--red)":d.personalLetterText.length>=400?"var(--amber)":"var(--gray-500)"}}>{d.personalLetterText.length} / 500</span>
          </div>
          <textarea rows={6} className="input-field" placeholder="Dear Seller, We are a family of four who fell in love with your home the moment we walked through the door..."
            style={{resize:"vertical",lineHeight:1.6}}
            value={d.personalLetterText}
            onChange={e=>set("personalLetterText",e.target.value)}
            maxLength={500}/>
          <p style={{fontSize:12,color:"var(--gray-500)",marginTop:6}}>Keep it to 3–4 short paragraphs. Mention your family, why this neighborhood matters, and how you'll care for the home.</p>
        </div>
      )}
    </Q>
  );

  // ── Step 15: Sign your offer ────────────────────────────────────────
  if (step===15) {
    const hasSig = d.signatureDataUrl !== "";
    return (
      <Q title="Sign your offer" subtitle="Draw your signature below to authorize this offer.">
        {/* Canvas signature pad */}
        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--gray-700)",marginBottom:8}}>
            Sign here
          </label>
          <div style={{
            border:"2px solid var(--gray-300)",borderRadius:10,overflow:"hidden",
            background:"#fff",position:"relative",cursor:"crosshair",
          }}>
            <SignatureCanvas
              ref={sigCanvasRef}
              canvasProps={{width:320,height:180,style:{display:"block",width:"100%",height:180,touchAction:"none"}}}
              backgroundColor="#ffffff"
              penColor="#1e293b"
              onEnd={() => {
                const canvas = sigCanvasRef.current;
                if (canvas && !canvas.isEmpty()) {
                  set("signatureDataUrl", canvas.toDataURL("image/png"));
                }
              }}
            />
            {/* Baseline guide */}
            <div style={{position:"absolute",bottom:36,left:16,right:16,borderBottom:"1px dashed var(--gray-300)",pointerEvents:"none"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
            <p style={{fontSize:12,color:"var(--gray-400)"}}>
              {hasSig ? "Signature captured" : "Draw your signature in the box above"}
            </p>
            <button
              type="button"
              onClick={() => {
                sigCanvasRef.current?.clear();
                set("signatureDataUrl","");
                set("signatureDate","");
              }}
              style={{fontSize:12,color:"var(--blue)",background:"none",border:"none",cursor:"pointer",padding:"4px 8px",borderRadius:6,fontWeight:500}}>
              Clear
            </button>
          </div>
        </div>

        {/* Printed name */}
        <div style={{marginBottom:16}}>
          <label style={{display:"block",fontSize:13,fontWeight:600,color:"var(--gray-700)",marginBottom:6}}>
            Printed full name
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="Your legal full name"
            value={d.signatureName}
            onChange={e=>set("signatureName",e.target.value)}
          />
        </div>

        {/* Validation message */}
        {(!hasSig || d.signatureName.trim()==="") && (
          <div className="warn-box" style={{marginTop:8}}>
            <p style={{fontSize:13,color:"#92400e",lineHeight:1.6}}>
              {!hasSig && d.signatureName.trim()===""
                ? "Please draw your signature and enter your printed name to continue."
                : !hasSig
                  ? "Please draw your signature to continue."
                  : "Please enter your printed name to continue."}
            </p>
          </div>
        )}

        {hasSig && d.signatureName.trim()!=="" && (
          <div className="good-box">
            <p style={{fontSize:13,color:"#065f46",lineHeight:1.6}}>
              Signature captured for <strong>{d.signatureName}</strong>. Click Continue to review your offer.
            </p>
          </div>
        )}
      </Q>
    );
  }

  // ── Step 16: Review ─────────────────────────────────────────────────
  if (step===16) {
    const rows = [
      {section:"Property",   items:[["Address",`${property.address}, ${property.city}, ${property.state}`],["List price",fmt(property.price)]]},
      {section:"Your Offer", items:[["Offer price",fmt(d.offerPrice)],["vs. asking price",d.offerPrice>=property.price?`+${fmt(d.offerPrice-property.price)} above`:`-${fmt(property.price-d.offerPrice)} below`],["Earnest money",`${d.earnestPct}% · ${fmt(Math.round(d.offerPrice*d.earnestPct/100))}`]]},
      {section:"Financing",  items:[[d.financeType==="cash"?"Payment":"Loan type",d.financeType==="cash"?"All cash":`${d.financeType} · ${d.downPct}% down`],["Pre-approved",d.financeType==="cash"?"N/A":d.preApproved?"Yes ✓":"No ⚠️"]]},
      {section:"Timeline",   items:[["Target closing",`${d.closingDays} days`]]},
      {section:"Contingencies", items:[["Inspection",d.inspectionContingency?`Yes · ${d.inspectionDays} days`:"Waived ⚠️"],["Appraisal",d.appraisalContingency?"Yes":"Waived ⚠️"],["Financing",d.financeType==="cash"?"N/A (cash)":d.financingContingency?`Yes · ${d.financingDays} days`:"Waived ⚠️"]]},
      {section:"Terms",      items:[["Escalation",d.escalation?`Yes · up to ${fmt(d.escMax)}`:"No"],["Seller credits",d.sellerCredits>0?fmt(d.sellerCredits):"None"],["Personal letter",d.personalLetter?"Yes":"No"]]},
      {section:"Signature",  items:[["Signed by",d.signatureName||"—"],["Signed on",d.signatureDate?new Date(d.signatureDate).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}):"—"]]},
    ];

    const tierColor = scoringResult.tier === "strong" ? "var(--green)" : scoringResult.tier === "competitive" ? "var(--amber)" : "var(--red)";
    const tierBg   = scoringResult.tier === "strong" ? "#d1fae5" : scoringResult.tier === "competitive" ? "#fef3c7" : "#fee2e2";
    const tierLabel = scoringResult.tier === "strong" ? "Strong" : scoringResult.tier === "competitive" ? "Competitive" : "Weak";

    return (
      <Q title="Review your offer" subtitle="Everything looks good. Confirm before generating your documents.">

        {/* ── Offer confidence score ── */}
        <div style={{border:`1.5px solid ${tierColor}`,borderRadius:12,padding:"16px 20px",marginBottom:20,background:tierBg}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div>
              <p style={{fontSize:12,fontWeight:700,color:tierColor,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}}>Offer Confidence Score</p>
              <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                <span style={{fontSize:36,fontWeight:800,color:tierColor,lineHeight:1}}>{scoringResult.score}</span>
                <span style={{fontSize:16,color:tierColor,fontWeight:600}}>/100</span>
                <span style={{marginLeft:8,fontSize:13,fontWeight:700,padding:"2px 10px",borderRadius:99,background:tierColor,color:"#fff"}}>{tierLabel}</span>
              </div>
            </div>
            {/* Mini score gauge */}
            <div style={{width:64,height:64,position:"relative",flexShrink:0}}>
              <svg viewBox="0 0 64 64" style={{width:64,height:64,transform:"rotate(-90deg)"}}>
                <circle cx="32" cy="32" r="26" fill="none" stroke="#e5e7eb" strokeWidth="6"/>
                <circle cx="32" cy="32" r="26" fill="none" stroke={tierColor} strokeWidth="6"
                  strokeDasharray={`${2*Math.PI*26*scoringResult.score/100} ${2*Math.PI*26*(1-scoringResult.score/100)}`}
                  strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          {/* Breakdown table */}
          <div style={{borderTop:`1px solid ${tierColor}`,paddingTop:10,marginTop:4}}>
            {scoringResult.breakdown.map(row => (
              <div key={row.label} style={{marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:12,fontWeight:600,color:"var(--gray-700)"}}>{row.label}</span>
                  <span style={{fontSize:12,fontWeight:700,color:row.points===row.maxPoints?tierColor:"var(--gray-500)"}}>
                    {row.points} / {row.maxPoints} pts
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{height:4,background:"rgba(0,0,0,0.08)",borderRadius:2,overflow:"hidden",marginBottom:row.tip&&row.points<row.maxPoints?4:0}}>
                  <div style={{height:4,background:tierColor,borderRadius:2,width:`${row.maxPoints>0?(row.points/row.maxPoints)*100:0}%`,transition:"width .4s"}}/>
                </div>
                {row.tip && row.points < row.maxPoints && (
                  <p style={{fontSize:11,color:"var(--gray-600)",lineHeight:1.5,marginTop:2}}>
                    {row.tip}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{overflow:"hidden",marginBottom:16}}>
          {rows.map(r=>(
            <div key={r.section}>
              <div style={{padding:"10px 20px",background:"var(--gray-50)",borderBottom:"1px solid var(--gray-200)"}}>
                <span style={{fontSize:11,fontWeight:700,color:"var(--gray-500)",textTransform:"uppercase",letterSpacing:"0.05em"}}>{r.section}</span>
              </div>
              {r.items.map(([k,v])=>(
                <div key={k} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1" style={{padding:"10px 20px",borderBottom:"1px solid var(--gray-100)"}}>
                  <span style={{fontSize:13,color:"var(--gray-500)",flexShrink:0}}>{k}</span>
                  <span style={{fontSize:13,fontWeight:600,color: String(v).includes("⚠️")?"var(--amber)":"var(--gray-900)",textAlign:"right"}}>{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="good-box">
          <p style={{fontSize:13,color:"#065f46",lineHeight:1.6}}>Your offer package is ready to generate. You&apos;ll receive a complete, professionally formatted PDF including the Illinois purchase agreement, all addendums, and a cover letter.</p>
        </div>
      </Q>
    );
  }

  // ── Step 17: Submit ─────────────────────────────────────────────────
  return (
    <Q title="Get your offer package" subtitle="Choose how you'd like to receive and deliver your offer.">
      {[
        {icon:"📄", title:"Download PDF package", desc:"Professional PDF with purchase agreement, addendums, and cover letter. You deliver it.", badge:"$29", href:"/pricing"},
        {icon:"✉️", title:"Send directly to listing agent", desc:`Email to ${property.agent} at ${property.brokerage} with read receipt tracking.`, badge:"$99 Premium", href:"/pricing", featured:true},
      ].map(o=>(
        <Link key={o.title} href={o.href}
          style={{display:"flex",alignItems:"flex-start",gap:16,padding:"20px",border:`1.5px solid ${o.featured?"var(--blue)":"var(--gray-200)"}`,
            borderRadius:12,background:o.featured?"var(--blue-light)":"#fff",textDecoration:"none",marginBottom:10,transition:"all .15s"}}>
          <span style={{fontSize:28,flexShrink:0}}>{o.icon}</span>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontSize:15,fontWeight:600,color:"var(--gray-900)"}}>{o.title}</span>
              <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:99,background:o.featured?"var(--blue)":"var(--gray-200)",color:o.featured?"#fff":"var(--gray-600)"}}>{o.badge}</span>
            </div>
            <p style={{fontSize:13,color:"var(--gray-500)",lineHeight:1.5}}>{o.desc}</p>
          </div>
          <ArrowRight style={{width:16,height:16,color:"var(--gray-300)",flexShrink:0,marginTop:2}}/>
        </Link>
      ))}
      <div className="warn-box" style={{marginTop:8}}>
        <p style={{fontSize:12,color:"#92400e",lineHeight:1.5}}>⚖️ HomeOfferDirect is not a law firm. We strongly recommend having a licensed Illinois real estate attorney review your offer before submitting.</p>
      </div>
    </Q>
  );
}
