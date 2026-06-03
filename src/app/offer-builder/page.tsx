"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, ChevronDown, ChevronUp, AlertTriangle, Info, Home } from "lucide-react";

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
  { id:"review",   label:"Review & Send",  steps:[15,16] },
];
const TOTAL = 17;

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
};

const PROPERTY = { address:"2847 N Clark St", city:"Chicago", state:"IL", zip:"60657",
  price:485000, beds:3, baths:2, sqft:1850, dom:12, agent:"Sarah Johnson",
  brokerage:"Coldwell Banker", img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&auto=format&fit=crop" };

const fmt = (n:number) => "$"+n.toLocaleString();

export default function OfferBuilder() {
  const [step, setStep] = useState(0);
  const [showHelper, setShowHelper] = useState(false);
  const [d, setD] = useState<D>({
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
  });

  const set = <K extends keyof D>(k:K, v:D[K]) => setD(p=>({...p,[k]:v}));
  const pct = Math.round((step/(TOTAL-1))*100);
  const activeSection = SECTIONS.find(s => s.steps.includes(step));

  const next = () => { setStep(s=>Math.min(TOTAL-1,s+1)); setShowHelper(false); };
  const back = () => { setStep(s=>Math.max(0,s-1)); setShowHelper(false); };

  return (
    <div style={{minHeight:"100vh",background:"var(--gray-50)"}}>
      {/* ── Top bar ── */}
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:50,background:"#fff",borderBottom:"1px solid var(--gray-200)",paddingTop:"env(safe-area-inset-top)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
          <Link href="/" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
            <div style={{width:28,height:28,borderRadius:7,background:"linear-gradient(135deg,#2563eb,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center"}}>
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
          <Link href="/search" style={{display:"flex",alignItems:"center",gap:4,fontSize:13,color:"var(--gray-500)",textDecoration:"none"}}>
            <ArrowLeft style={{width:14,height:14}}/> Exit
          </Link>
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
            <div style={{height:80,backgroundImage:`url(${PROPERTY.img})`,backgroundSize:"cover",backgroundPosition:"center"}}/>
            <div style={{padding:"10px 12px"}}>
              <p style={{fontSize:12,fontWeight:600,color:"var(--gray-900)"}}>{PROPERTY.address}</p>
              <p style={{fontSize:11,color:"var(--gray-500)"}}>{PROPERTY.city}, {PROPERTY.state}</p>
              <p style={{fontSize:15,fontWeight:700,color:"var(--gray-900)",marginTop:4}}>{fmt(PROPERTY.price)}</p>
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{maxWidth:560}}>
          <div key={step} className="fade-up">
            <StepView step={step} d={d} set={set} showHelper={showHelper} toggleHelper={()=>setShowHelper(v=>!v)}/>
          </div>

          {/* Nav buttons */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:32,paddingTop:24,borderTop:"1px solid var(--gray-200)"}}>
            <button onClick={back} disabled={step===0}
              style={{display:"flex",alignItems:"center",gap:8,padding:"12px 20px",background:"transparent",border:"1.5px solid var(--gray-200)",borderRadius:10,fontSize:14,fontWeight:500,color:"var(--gray-700)",cursor:step===0?"not-allowed":"pointer",opacity:step===0?.4:1}}>
              <ArrowLeft style={{width:15,height:15}}/> Back
            </button>

            <span style={{fontSize:12,color:"var(--gray-400)"}}>{step+1} of {TOTAL}</span>

            {step < TOTAL-1
              ? <button onClick={next}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"12px 28px",background:"var(--blue)",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>
                  Continue <ArrowRight style={{width:15,height:15}}/>
                </button>
              : <Link href="/pricing"
                  style={{display:"flex",alignItems:"center",gap:8,padding:"12px 28px",background:"var(--blue)",color:"#fff",borderRadius:10,fontSize:14,fontWeight:600,textDecoration:"none"}}>
                  Get my offer package <ArrowRight style={{width:15,height:15}}/>
                </Link>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   INDIVIDUAL STEP COMPONENTS
───────────────────────────────────────────────── */
type SetFn = <K extends keyof D>(k:K,v:D[K])=>void;

function Q({ title, subtitle, helper, children, showHelper, toggleHelper }:
  { title:string; subtitle?:string; helper?:string; children:React.ReactNode; showHelper?:boolean; toggleHelper?:()=>void }) {
  return (
    <div>
      <h1 style={{fontSize:26,fontWeight:700,color:"var(--gray-900)",lineHeight:1.25,marginBottom:subtitle?8:24}}>{title}</h1>
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

function StepView({ step, d, set, showHelper, toggleHelper }:
  { step:number; d:D; set:SetFn; showHelper:boolean; toggleHelper:()=>void }) {

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
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[
          {v:"IL",label:"Illinois 🏙️",note:"CAR forms"},
          {v:"TX",label:"Texas 🌵",note:"TREC forms"},
          {v:"NY",label:"New York 🗽",note:"NYSBA forms"},
          {v:"CA",label:"California ☀️",note:"CAR forms"},
          {v:"FL",label:"Florida 🌴",note:"FAR forms"},
        ].map(s=>(
          <button key={s.v} onClick={()=>set("state",s.v)}
            className={`option-card ${d.state===s.v?"selected":""}`}
            style={{flexDirection:"column",alignItems:"flex-start",gap:4}}>
            <span style={{fontSize:14,fontWeight:600,color:"var(--gray-900)"}}>{s.label}</span>
            <span style={{fontSize:11,color:"var(--gray-500)"}}>{s.note}</span>
            <div className="check" style={{position:"absolute" as const,top:12,right:12}}>
              {d.state===s.v&&<CheckCircle style={{width:13,height:13,color:"#fff"}}/>}
            </div>
          </button>
        ))}
      </div>
    </Q>
  );

  // ── Step 2: Pre-approval ────────────────────────────────────────────
  if (step===2) return (
    <Q title="Do you have a mortgage pre-approval?"
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
    </Q>
  );

  // ── Step 3: Property confirm ────────────────────────────────────────
  if (step===3) return (
    <Q title="Confirm the property" subtitle="Here's the home you're making an offer on.">
      <div className="card" style={{overflow:"hidden",marginBottom:16}}>
        <div style={{height:180,backgroundImage:`url(${PROPERTY.img})`,backgroundSize:"cover",backgroundPosition:"center"}}/>
        <div style={{padding:"16px 20px"}}>
          {[
            ["Address",`${PROPERTY.address}, ${PROPERTY.city}, ${PROPERTY.state} ${PROPERTY.zip}`],
            ["List price", fmt(PROPERTY.price)],
            ["Beds / Baths", `${PROPERTY.beds} bd · ${PROPERTY.baths} ba · ${PROPERTY.sqft.toLocaleString()} sqft`],
            ["Days on market", `${PROPERTY.dom} days`],
            ["Listing agent", `${PROPERTY.agent} · ${PROPERTY.brokerage}`],
            ["State forms", "Illinois Residential Purchase & Sale Agreement"],
          ].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--gray-100)"}}>
              <span style={{fontSize:13,color:"var(--gray-500)"}}>{k}</span>
              <span style={{fontSize:13,fontWeight:600,color:"var(--gray-900)",textAlign:"right",maxWidth:"60%"}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="good-box">
        <p style={{fontSize:13,color:"#065f46",lineHeight:1.6}}>
          ✓ This home has been on the market for {PROPERTY.dom} days. Comparable homes in this ZIP sold for 101–103% of asking price in the last 90 days.
        </p>
      </div>
    </Q>
  );

  // ── Step 4: Offer price ─────────────────────────────────────────────
  if (step===4) return (
    <Q title="How much do you want to offer?"
      subtitle={`The asking price is ${fmt(PROPERTY.price)}. Here's what the market data suggests.`}
      helper="Your offer price is the amount you're willing to pay for the home. Going above asking can win bidding wars but you don't want to overpay. Going below asking may save money but could lose the deal. The AI recommendation is based on recent nearby sales, days on market, and current inventory levels."
      showHelper={showHelper} toggleHelper={toggleHelper}>

      {/* AI recommendation banner */}
      <div style={{background:"var(--blue-light)",border:"1.5px solid #bfdbfe",borderRadius:12,padding:"14px 18px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <span style={{fontSize:14}}>🤖</span>
          <span style={{fontSize:13,fontWeight:600,color:"var(--blue)"}}>AI Recommendation for Chicago · Lincoln Park</span>
        </div>
        <p style={{fontSize:13,color:"var(--gray-700)",lineHeight:1.6}}>
          Based on 14 recent sales, homes here sell for <strong>1–3% above asking</strong> in 9 days average. I recommend <strong>{fmt(492000)}</strong> — competitive without overbidding.
        </p>
      </div>

      {/* Quick picks */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {[
          {p:PROPERTY.price-15000, label:"$15K below asking", note:"Low risk of winning"},
          {p:PROPERTY.price,       label:"At asking price",   note:"Moderate"},
          {p:492000,               label:"$7K above asking",  note:"AI recommended", ai:true},
          {p:PROPERTY.price+20000, label:"$20K above asking", note:"Very competitive"},
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
        <input type="number" value={d.offerPrice || ""} placeholder={String(PROPERTY.price)} onChange={e=>set("offerPrice",+e.target.value)}
          className="input-field" style={{paddingLeft:28}}/>
      </div>

      {/* Strength bar */}
      {d.offerPrice > 0 && <div style={{marginTop:16,padding:"14px 16px",background:"var(--gray-50)",borderRadius:10,border:"1px solid var(--gray-200)"}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:8}}>
          <span style={{color:"var(--gray-600)"}}>Offer strength vs. asking price</span>
          <span style={{fontWeight:700,color:d.offerPrice>=PROPERTY.price?"var(--green)":"var(--amber)"}}>
            {d.offerPrice>=PROPERTY.price
              ? `+${fmt(d.offerPrice-PROPERTY.price)} above (${((d.offerPrice/PROPERTY.price-1)*100).toFixed(1)}%)`
              : `-${fmt(PROPERTY.price-d.offerPrice)} below`}
          </span>
        </div>
        <div style={{height:6,background:"var(--gray-200)",borderRadius:3,overflow:"hidden"}}>
          <div style={{height:6,background:d.offerPrice>=PROPERTY.price?"var(--green)":"var(--amber)",
            borderRadius:3,transition:"width .4s",
            width:`${Math.min(100,Math.max(5,50+(d.offerPrice-PROPERTY.price)/PROPERTY.price*300))}%`}}/>
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
        {d.downPct<20 && (
          <div className="warn-box" style={{marginTop:12}}>
            <p style={{fontSize:13,color:"#92400e"}}>⚠️ Below 20% down means you'll pay Private Mortgage Insurance (PMI) until you reach 20% equity. This adds roughly ${Math.round(d.offerPrice*0.005/12)}/month to your payment.</p>
          </div>
        )}
      </Q>
    );
  }

  // ── Step 7: Earnest money ───────────────────────────────────────────
  if (step===7) return (
    <Q title="How much earnest money will you deposit?"
      subtitle="This is a good-faith deposit that shows you're serious."
      helper="Earnest money is a deposit you make when your offer is accepted. It's held in an escrow account and applied to your down payment at closing. If you back out for reasons not covered by contingencies, you may lose this money. In Illinois, 2% of the purchase price is standard."
      showHelper={showHelper} toggleHelper={toggleHelper}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
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
          <button key={o.d} onClick={()=>set("closingDays",o.d)}
            style={{padding:"14px 16px",border:`1.5px solid ${d.closingDays===o.d?"var(--blue)":"var(--gray-200)"}`,
              borderRadius:10,background:d.closingDays===o.d?"var(--blue-light)":"#fff",cursor:"pointer",textAlign:"left",transition:"all .15s"}}>
            <div style={{fontSize:15,fontWeight:700,color:d.closingDays===o.d?"var(--blue)":"var(--gray-900)"}}>{o.label}</div>
            <div style={{fontSize:12,color:o.best?"var(--green)":"var(--gray-500)",marginTop:3,fontWeight:o.best?600:400}}>{o.note}</div>
          </button>
        ))}
      </div>
      <label style={{display:"block",fontSize:13,fontWeight:500,color:"var(--gray-700)",marginBottom:6}}>Or pick a specific date</label>
      <input type="date" className="input-field"
        min={new Date(Date.now()+15*86400000).toISOString().split("T")[0]}/>
    </Q>
  );

  // ── Step 9: Inspection contingency ─────────────────────────────────
  if (step===9) return (
    <Q title="Do you want an inspection contingency?"
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
        desc="Strongest offer — but you accept the home in its current condition."
        warn={true}
        selected={d.inspectionContingency===false}
        onClick={()=>set("inspectionContingency",false)}/>
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
          <p style={{fontSize:13,color:"#92400e",lineHeight:1.6}}>⚠️ You offered {fmt(d.offerPrice)} ({fmt(d.offerPrice-PROPERTY.price)} above asking). If the home appraises at asking price, you'd need an extra <strong>{fmt(d.offerPrice-PROPERTY.price)} in cash at closing</strong>.</p>
        </div>
      )}
    </Q>
  );

  // ── Step 11: Financing contingency ─────────────────────────────────
  if (step===11) return (
    <Q title="Do you want a financing contingency?"
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
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div>
              <label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--gray-700)",marginBottom:6}}>Beat competing offers by</label>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--gray-400)",fontSize:13}}>$</span>
                <input type="number" value={d.escIncrement} onChange={e=>set("escIncrement",+e.target.value)}
                  className="input-field" style={{paddingLeft:24,fontSize:14}}/>
              </div>
            </div>
            <div>
              <label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--gray-700)",marginBottom:6}}>Up to my maximum</label>
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
        </div>
      )}
    </Q>
  );

  // ── Step 13: Seller credits ─────────────────────────────────────────
  if (step===13) return (
    <Q title="Are you requesting any seller credits?"
      subtitle="Seller credits reduce your closing costs — the seller pays some of your fees."
      helper="Closing costs typically run 2–5% of the loan amount. You can ask the seller to cover some of these costs ('seller concessions'). This is more common in slower markets or when a home has been listed a while. In a very competitive market, asking for credits may weaken your offer."
      showHelper={showHelper} toggleHelper={toggleHelper}>
      <OptionCard icon="🙅" label="No seller credits"
        desc={`${PROPERTY.dom<=14?"This market is competitive — skipping credits strengthens your offer.":"A clean offer is usually preferred."}`}
        badge={PROPERTY.dom<=14?"Recommended":""}
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
          <label style={{display:"block",fontSize:13,fontWeight:500,color:"var(--gray-700)",marginBottom:6}}>Your personal letter</label>
          <textarea rows={5} className="input-field" placeholder="Dear Seller, We are a family of four who fell in love with your home the moment we walked through the door..."
            style={{resize:"vertical",lineHeight:1.6}}/>
          <p style={{fontSize:12,color:"var(--gray-500)",marginTop:6}}>Keep it to 3–4 short paragraphs. Mention your family, why this neighborhood matters, and how you'll care for the home.</p>
        </div>
      )}
    </Q>
  );

  // ── Step 15: Review ─────────────────────────────────────────────────
  if (step===15) {
    const rows = [
      {section:"Property",   items:[["Address",`${PROPERTY.address}, ${PROPERTY.city}, ${PROPERTY.state}`],["List price",fmt(PROPERTY.price)]]},
      {section:"Your Offer", items:[["Offer price",fmt(d.offerPrice)],["vs. asking price",d.offerPrice>=PROPERTY.price?`+${fmt(d.offerPrice-PROPERTY.price)} above`:`-${fmt(PROPERTY.price-d.offerPrice)} below`],["Earnest money",`${d.earnestPct}% · ${fmt(Math.round(d.offerPrice*d.earnestPct/100))}`]]},
      {section:"Financing",  items:[[d.financeType==="cash"?"Payment":"Loan type",d.financeType==="cash"?"All cash":`${d.financeType} · ${d.downPct}% down`],["Pre-approved",d.financeType==="cash"?"N/A":d.preApproved?"Yes ✓":"No ⚠️"]]},
      {section:"Timeline",   items:[["Target closing",`${d.closingDays} days`]]},
      {section:"Contingencies", items:[["Inspection",d.inspectionContingency?`Yes · ${d.inspectionDays} days`:"Waived ⚠️"],["Appraisal",d.appraisalContingency?"Yes":"Waived ⚠️"],["Financing",d.financeType==="cash"?"N/A (cash)":d.financingContingency?`Yes · ${d.financingDays} days`:"Waived ⚠️"]]},
      {section:"Terms",      items:[["Escalation",d.escalation?`Yes · up to ${fmt(d.escMax)}`:"No"],["Seller credits",d.sellerCredits>0?fmt(d.sellerCredits):"None"],["Personal letter",d.personalLetter?"Yes":"No"]]},
    ];
    return (
      <Q title="Review your offer" subtitle="Everything looks good. Confirm before generating your documents.">
        <div className="card" style={{overflow:"hidden",marginBottom:16}}>
          {rows.map(r=>(
            <div key={r.section}>
              <div style={{padding:"10px 20px",background:"var(--gray-50)",borderBottom:"1px solid var(--gray-200)"}}>
                <span style={{fontSize:11,fontWeight:700,color:"var(--gray-500)",textTransform:"uppercase",letterSpacing:"0.05em"}}>{r.section}</span>
              </div>
              {r.items.map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 20px",borderBottom:"1px solid var(--gray-100)"}}>
                  <span style={{fontSize:13,color:"var(--gray-500)"}}>{k}</span>
                  <span style={{fontSize:13,fontWeight:600,color: String(v).includes("⚠️")?"var(--amber)":"var(--gray-900)"}}>{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="good-box">
          <p style={{fontSize:13,color:"#065f46",lineHeight:1.6}}>✓ Your offer package is ready to generate. You'll receive a complete, professionally formatted PDF including the Illinois purchase agreement, all addendums, and a cover letter.</p>
        </div>
      </Q>
    );
  }

  // ── Step 16: Submit ─────────────────────────────────────────────────
  return (
    <Q title="Get your offer package" subtitle="Choose how you'd like to receive and deliver your offer.">
      {[
        {icon:"📄", title:"Download PDF package", desc:"Professional PDF with purchase agreement, addendums, and cover letter. You deliver it.", badge:"$29", href:"/pricing"},
        {icon:"✉️", title:"Send directly to listing agent", desc:`Email to ${PROPERTY.agent} at ${PROPERTY.brokerage} with read receipt tracking.`, badge:"$99 Premium", href:"/pricing", featured:true},
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
