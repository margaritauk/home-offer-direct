"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles, ChevronDown, AlertCircle, Lock } from "lucide-react";

const STEPS = ["Property","Price","Financing","Timeline","Contingencies","Terms","Review","Submit"];

const property = { address:"2847 N Clark St", city:"Chicago", state:"IL", price:485000, beds:3, baths:2, agent:"Sarah Johnson", brokerage:"Coldwell Banker", dom:12 };
const fmt = (n:number) => "$"+n.toLocaleString();

type OfferData = {
  price: number; financeType: string; downPct: number; preApproved: boolean;
  closingDays: number; earnest: number; inspection: boolean; inspDays: number;
  appraisal: boolean; financing: boolean; finDays: number;
  escalation: boolean; escIncrement: number; escMax: number;
  sellerCredits: number; attorneyDays: number;
};

export default function OfferBuilder() {
  const [step, setStep] = useState(0);
  const [aiOpen, setAiOpen] = useState(true);
  const [d, setD] = useState<OfferData>({
    price:492000, financeType:"conventional", downPct:20, preApproved:true,
    closingDays:30, earnest:9840, inspection:true, inspDays:10,
    appraisal:true, financing:true, finDays:21,
    escalation:false, escIncrement:2500, escMax:510000,
    sellerCredits:0, attorneyDays:5,
  });

  const set = (k: keyof OfferData, v: unknown) => setD(p=>({...p,[k]:v}));
  const pct = Math.round((step / (STEPS.length-1))*100);

  const aiTips = [
    `This home has been listed for ${property.dom} days. Chicago's Lincoln Park area is selling fast — expect competition.`,
    `Homes nearby sold for 101–104% of asking. I recommend offering ${fmt(492000)} to stay competitive while leaving negotiating room.`,
    `Conventional loans with 20%+ down are preferred by sellers. Having a pre-approval letter attached strengthens your offer significantly.`,
    `30–45 day close is standard in IL. Offering flexibility on the move-out date can differentiate your offer at no cost.`,
    `Keep the inspection contingency — waiving it is risky. Shortening to 7–10 days shows good faith without losing your protection.`,
    `An escalation clause is smart in a competitive market. It beats other offers automatically up to your cap without revealing your max.`,
    `Your offer looks strong. Review everything carefully — once accepted, earnest money must be deposited within 24–48 hours.`,
    `Your offer package is ready. Send it professionally or download the PDF. Include a brief personal note if you want to stand out.`,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="fixed inset-x-0 top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link href="/search" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <span className="text-sm font-semibold text-gray-900">Offer Builder</span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Lock className="w-3 h-3" /> Auto-saved
          </span>
        </div>
        {/* Progress */}
        <div className="w-full h-1 bg-gray-100">
          <div className="h-1 brand-gradient transition-all duration-500" style={{width:`${pct}%`}} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-20 pb-24">
        {/* Step pills */}
        <div className="flex items-center gap-2 py-5 overflow-x-auto scrollbar-hide">
          {STEPS.map((s,i) => (
            <button key={s} onClick={()=>i<step&&setStep(i)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                i===step ? "brand-gradient text-white" :
                i<step   ? "bg-green-50 text-green-700 cursor-pointer" :
                           "bg-gray-100 text-gray-400 cursor-default"
              }`}>
              {i<step ? "✓ " : ""}{s}
            </button>
          ))}
        </div>

        {/* AI tip */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl mb-5">
          <button onClick={()=>setAiOpen(!aiOpen)}
            className="flex items-center gap-2.5 w-full px-4 py-3 text-left">
            <div className="w-7 h-7 brand-gradient rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 flex-1">AI Advisor</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${aiOpen?"rotate-180":""}`} />
          </button>
          {aiOpen && (
            <div className="px-4 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-blue-100">
              {aiTips[step]}
            </div>
          )}
        </div>

        {/* Step card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <StepContent step={step} d={d} set={set} />
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between mt-5">
          <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}
            className="flex items-center gap-1.5 px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-xs text-gray-400">{step+1} / {STEPS.length}</span>
          {step < STEPS.length-1 ? (
            <button onClick={()=>setStep(s=>Math.min(STEPS.length-1,s+1))}
              className="flex items-center gap-1.5 px-6 py-2.5 brand-gradient text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link href="/pricing"
              className="flex items-center gap-1.5 px-6 py-2.5 brand-gradient text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity">
              Generate offer <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Step content ──────────────────────────────────────────────────── */
function StepContent({ step, d, set }: { step:number; d:OfferData; set:(k:keyof OfferData,v:unknown)=>void }) {
  const fmt = (n:number) => "$"+n.toLocaleString();

  if (step===0) return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Confirm property</h2>
      <p className="text-sm text-gray-500 mb-6">Review the home you're making an offer on.</p>
      <div className="space-y-0">
        {[
          ["Address", `${property.address}, ${property.city}, ${property.state}`],
          ["List price", fmt(property.price)],
          ["Beds / Baths", `${property.beds} bd · ${property.baths} ba`],
          ["Listing agent", `${property.agent}, ${property.brokerage}`],
          ["Days on market", `${property.dom} days`],
          ["State forms", "Illinois CAR purchase contract"],
        ].map(([k,v])=>(
          <div key={k} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-500">{k}</span>
            <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (step===1) {
    const listPrice = property.price;
    const pct = Math.round(((d.price - listPrice)/listPrice)*100*10)/10;
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Offer price</h2>
        <p className="text-sm text-gray-500 mb-6">List price is <strong className="text-gray-900">{fmt(listPrice)}</strong></p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[listPrice-10000, listPrice, listPrice+7000, listPrice+15000].map((p,i)=>(
            <button key={p} onClick={()=>set("price",p)}
              className={`p-3 rounded-lg border text-left transition-all ${d.price===p?"border-blue-500 bg-blue-50":"border-gray-200 hover:border-gray-300"}`}>
              <p className={`font-bold text-sm ${d.price===p?"text-blue-700":"text-gray-900"}`}>{fmt(p)}</p>
              <p className="text-xs text-gray-400 mt-0.5">{p===listPrice?"List price":p<listPrice?`${fmt(listPrice-p)} under`:`${fmt(p-listPrice)} over`}</p>
              {i===2&&<span className="text-xs text-blue-500 font-medium">AI recommended</span>}
            </button>
          ))}
        </div>
        <div className="relative mb-5">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <input type="number" value={d.price} onChange={e=>set("price",+e.target.value)}
            className="w-full pl-7 pr-4 py-3 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Offer strength</span>
            <span className={`font-semibold ${d.price>=listPrice?"text-green-600":"text-amber-500"}`}>
              {d.price>=listPrice ? `${pct}% above asking ↑` : `${Math.abs(pct)}% below asking ↓`}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-2 rounded-full transition-all ${d.price>=listPrice?"bg-green-500":"bg-amber-400"}`}
              style={{width:`${Math.min(100,Math.max(10,50+(d.price-listPrice)/listPrice*200))}%`}} />
          </div>
        </div>
      </div>
    );
  }

  if (step===2) return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Financing</h2>
      <p className="text-sm text-gray-500 mb-6">How are you paying for this home?</p>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {[
          {v:"conventional",l:"Conventional",note:"Most common"},
          {v:"fha",l:"FHA",note:"Low down payment"},
          {v:"va",l:"VA Loan",note:"Veterans only"},
          {v:"cash",l:"All Cash",note:"Strongest offer"},
        ].map(o=>(
          <button key={o.v} onClick={()=>set("financeType",o.v)}
            className={`p-3 rounded-lg border text-left transition-all ${d.financeType===o.v?"border-blue-500 bg-blue-50":"border-gray-200 hover:border-gray-300"}`}>
            <p className={`font-semibold text-sm ${d.financeType===o.v?"text-blue-700":"text-gray-900"}`}>{o.l}</p>
            <p className="text-xs text-gray-400 mt-0.5">{o.note}</p>
          </button>
        ))}
      </div>
      {d.financeType!=="cash" && (
        <>
          <label className="block text-sm font-medium text-gray-700 mb-2">Down payment</label>
          <div className="flex flex-wrap gap-2 mb-5">
            {[5,10,20,25].map(p=>(
              <button key={p} onClick={()=>set("downPct",p)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${d.downPct===p?"border-blue-500 bg-blue-50 text-blue-700":"border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                {p}% {p===20&&<span className="text-xs">(ideal)</span>}
              </button>
            ))}
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={d.preApproved} onChange={e=>set("preApproved",e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">I have a pre-approval letter</p>
              <p className="text-xs text-gray-500 mt-0.5">Attaching this significantly strengthens your offer.</p>
            </div>
          </label>
        </>
      )}
    </div>
  );

  if (step===3) return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Timeline</h2>
      <p className="text-sm text-gray-500 mb-6">When do you want to close?</p>
      <label className="block text-sm font-medium text-gray-700 mb-2">Target closing</label>
      <div className="flex flex-wrap gap-2 mb-5">
        {[21,30,45,60].map(days=>(
          <button key={days} onClick={()=>set("closingDays",days)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${d.closingDays===days?"border-blue-500 bg-blue-50 text-blue-700":"border-gray-200 text-gray-600 hover:border-gray-300"}`}>
            {days} days {days===30&&<span className="text-xs">(typical)</span>}
          </button>
        ))}
      </div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Earnest money deposit</label>
      <div className="relative mb-2">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
        <input type="number" value={d.earnest} onChange={e=>set("earnest",+e.target.value)}
          className="w-full pl-7 pr-4 py-3 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="flex gap-2">
        {[1,2,3].map(pct=>(
          <button key={pct} onClick={()=>set("earnest",Math.round(d.price*pct/100))}
            className="flex-1 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-all">
            {pct}% {pct===2&&"(standard)"}
          </button>
        ))}
      </div>
    </div>
  );

  if (step===4) {
    const contingencies = [
      {key:"inspection" as const, daysKey:"inspDays" as const, label:"Inspection", desc:"Back out if inspection finds issues.", rec:true},
      {key:"appraisal" as const, daysKey:null, label:"Appraisal", desc:"Back out if home appraises below offer.", rec:true},
      {key:"financing" as const, daysKey:"finDays" as const, label:"Financing", desc:"Back out if your mortgage falls through.", rec:true},
    ];
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Contingencies</h2>
        <p className="text-sm text-gray-500 mb-6">These protect you if something goes wrong.</p>
        <div className="space-y-3">
          {contingencies.map(c=>(
            <div key={c.key} className={`rounded-lg border p-4 transition-all ${d[c.key]?"border-blue-200 bg-blue-50/50":"border-gray-200"}`}>
              <div className="flex items-start gap-3">
                <button onClick={()=>set(c.key,!d[c.key])}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${d[c.key]?"border-blue-500 bg-blue-500":"border-gray-300"}`}>
                  {d[c.key]&&<CheckCircle className="w-4 h-4 text-white"/>}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{c.label}</p>
                    {c.rec&&<span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Recommended</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
                  {c.daysKey && !!d[c.key] && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {[7,10,14,21].map(n=>(
                        <button key={n} onClick={()=>set(c.daysKey!,n)}
                          className={`px-2.5 py-1 text-xs rounded border transition-all ${d[c.daysKey!]===n?"border-blue-500 bg-blue-100 text-blue-700":"border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                          {n} days
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step===5) return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Additional terms</h2>
      <p className="text-sm text-gray-500 mb-6">Optional features to strengthen or customize your offer.</p>
      <div className="space-y-4">
        {/* Escalation */}
        <div className={`rounded-lg border p-4 transition-all ${d.escalation?"border-blue-200 bg-blue-50/50":"border-gray-200"}`}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-sm font-semibold text-gray-900">Escalation clause</p>
              <p className="text-xs text-gray-500 mt-0.5">Automatically beat competing offers up to your max</p>
            </div>
            <button onClick={()=>set("escalation",!d.escalation)}
              className={`relative w-10 h-5 rounded-full transition-colors ${d.escalation?"bg-blue-500":"bg-gray-200"}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${d.escalation?"translate-x-5":"translate-x-0.5"}`}/>
            </button>
          </div>
          {!!d.escalation && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Beat by</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                  <input type="number" value={d.escIncrement} onChange={e=>set("escIncrement",+e.target.value)}
                    className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Up to max</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                  <input type="number" value={d.escMax} onChange={e=>set("escMax",+e.target.value)}
                    className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Seller credits */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seller credits (optional)</label>
          <p className="text-xs text-gray-500 mb-2">Ask seller to cover closing costs — common in slower markets.</p>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" value={d.sellerCredits} onChange={e=>set("sellerCredits",+e.target.value)}
              placeholder="0"
              className="w-full pl-7 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        {/* Attorney review */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Attorney review period</label>
          <p className="text-xs text-gray-500 mb-2">Standard in Illinois — gives attorneys time to review the contract.</p>
          <div className="flex gap-2">
            {[3,5,7].map(n=>(
              <button key={n} onClick={()=>set("attorneyDays",n)}
                className={`flex-1 py-2 text-sm border rounded-lg font-medium transition-all ${d.attorneyDays===n?"border-blue-500 bg-blue-50 text-blue-700":"border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                {n} days {n===5&&<span className="text-xs">(typical)</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (step===6) return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Review your offer</h2>
      <p className="text-sm text-gray-500 mb-6">Everything looks good — confirm the key terms.</p>
      <div className="space-y-1">
        {[
          ["Offer price", "$"+d.price.toLocaleString()],
          ["Financing", d.financeType==="cash"?"All cash":`${d.financeType} · ${d.downPct}% down`],
          ["Closing", `${d.closingDays} days`],
          ["Earnest money", "$"+d.earnest.toLocaleString()],
          ["Inspection", d.inspection?`Yes · ${d.inspDays} days`:"Waived ⚠️"],
          ["Appraisal", d.appraisal?"Yes":"Waived ⚠️"],
          ["Financing contingency", d.financing?`Yes · ${d.finDays} days`:"Waived ⚠️"],
          ["Escalation", d.escalation?`Yes · up to $${d.escMax.toLocaleString()}`:"No"],
          ["Seller credits", d.sellerCredits>0?"$"+d.sellerCredits.toLocaleString():"None"],
          ["Attorney review", `${d.attorneyDays} business days`],
        ].map(([k,v])=>(
          <div key={k} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-500">{k}</span>
            <span className="text-sm font-semibold text-gray-900">{v}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 bg-green-50 border border-green-100 rounded-lg p-3 flex gap-2.5">
        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"/>
        <p className="text-sm text-green-700">Your offer is ready. Click Continue to download or send.</p>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Submit your offer</h2>
      <p className="text-sm text-gray-500 mb-6">Choose how to deliver your professional offer package.</p>
      <div className="space-y-3">
        {[
          {title:"Download PDF", desc:"Get your complete offer package as a professional PDF.", badge:"Free preview", href:"/pricing"},
          {title:"Send to listing agent", desc:`Email directly to ${property.agent} at ${property.brokerage} with a professional cover letter and read receipt.`, badge:"Recommended", href:"/pricing"},
        ].map(o=>(
          <Link key={o.title} href={o.href}
            className="flex items-start justify-between p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all bg-white group">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{o.title}</p>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">{o.badge}</span>
              </div>
              <p className="text-xs text-gray-500">{o.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 flex-shrink-0 mt-1 ml-3 transition-colors"/>
          </Link>
        ))}
      </div>
      <div className="mt-5 bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"/>
        <p className="text-xs text-amber-700">HomeOfferDirect is not a law firm. We strongly recommend attorney review before submitting.</p>
      </div>
    </div>
  );
}
