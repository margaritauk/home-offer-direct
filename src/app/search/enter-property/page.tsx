"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Home } from "lucide-react";

const US_STATES = [
  {v:"AL",l:"Alabama"},{v:"AK",l:"Alaska"},{v:"AZ",l:"Arizona"},{v:"AR",l:"Arkansas"},
  {v:"CA",l:"California"},{v:"CO",l:"Colorado"},{v:"CT",l:"Connecticut"},{v:"DE",l:"Delaware"},
  {v:"FL",l:"Florida"},{v:"GA",l:"Georgia"},{v:"HI",l:"Hawaii"},{v:"ID",l:"Idaho"},
  {v:"IL",l:"Illinois"},{v:"IN",l:"Indiana"},{v:"IA",l:"Iowa"},{v:"KS",l:"Kansas"},
  {v:"KY",l:"Kentucky"},{v:"LA",l:"Louisiana"},{v:"ME",l:"Maine"},{v:"MD",l:"Maryland"},
  {v:"MA",l:"Massachusetts"},{v:"MI",l:"Michigan"},{v:"MN",l:"Minnesota"},{v:"MS",l:"Mississippi"},
  {v:"MO",l:"Missouri"},{v:"MT",l:"Montana"},{v:"NE",l:"Nebraska"},{v:"NV",l:"Nevada"},
  {v:"NH",l:"New Hampshire"},{v:"NJ",l:"New Jersey"},{v:"NM",l:"New Mexico"},{v:"NY",l:"New York"},
  {v:"NC",l:"North Carolina"},{v:"ND",l:"North Dakota"},{v:"OH",l:"Ohio"},{v:"OK",l:"Oklahoma"},
  {v:"OR",l:"Oregon"},{v:"PA",l:"Pennsylvania"},{v:"RI",l:"Rhode Island"},{v:"SC",l:"South Carolina"},
  {v:"SD",l:"South Dakota"},{v:"TN",l:"Tennessee"},{v:"TX",l:"Texas"},{v:"UT",l:"Utah"},
  {v:"VT",l:"Vermont"},{v:"VA",l:"Virginia"},{v:"WA",l:"Washington"},{v:"WV",l:"West Virginia"},
  {v:"WI",l:"Wisconsin"},{v:"WY",l:"Wyoming"},
];

export default function EnterPropertyPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [price, setPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [sqft, setSqft] = useState("");
  const [agentName, setAgentName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!address.trim() || address.trim().length < 5) e.address = "Enter a valid street address";
    if (!city.trim()) e.city = "City is required";
    if (!state) e.state = "Select a state";
    if (!/^\d{5}$/.test(zip)) e.zip = "Enter a 5-digit ZIP code";
    const p = parseInt(price.replace(/[^0-9]/g, ""), 10);
    if (!p || p <= 0) e.price = "Enter a valid list price";
    return e;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const rawPrice = parseInt(price.replace(/[^0-9]/g, ""), 10);
    const customProperty = {
      id: `custom-${Date.now()}`,
      address: address.trim(),
      city: city.trim(),
      state,
      zip,
      price: rawPrice,
      beds: parseInt(beds || "3", 10),
      baths: parseFloat(baths || "2"),
      sqft: sqft ? parseInt(sqft.replace(/[^0-9]/g, ""), 10) : 0,
      type: "Single Family",
      dom: 0,
      priceHistory: "same",
      priceChange: 0,
      photos: [],
      aiScore: 0,
      aiLabel: "",
      aiColor: "",
      suggestedOffer: [rawPrice * 0.97, rawPrice * 1.02],
      marketTrend: "unknown",
      listingAgent: agentName.trim() || "Listing Agent",
      agentPhone: "",
      agentEmail: "",
      brokerage: "",
      img: "",
    };

    try {
      sessionStorage.setItem("hod-custom-property", JSON.stringify(customProperty));
    } catch {}

    router.push(`/offer-builder?property=${customProperty.id}&from=/search`);
  };

  const fieldError = (field: string) => errors[field] ? (
    <p role="alert" style={{fontSize:12,color:"var(--red)",marginTop:4}}>{errors[field]}</p>
  ) : null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div style={{maxWidth:600,margin:"0 auto",padding:"100px 24px 80px"}}>
        <Link href="/search" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:14,color:"var(--gray-500)",textDecoration:"none",marginBottom:32}}>
          <ArrowLeft style={{width:14,height:14}}/> Back to search
        </Link>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{width:36,height:36,borderRadius:10,background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Home style={{width:18,height:18,color:"#fff"}}/>
          </div>
          <h1 style={{fontSize:26,fontWeight:700,color:"var(--gray-900)"}}>Enter your property</h1>
        </div>
        <p style={{fontSize:15,color:"var(--gray-500)",marginBottom:32,lineHeight:1.6}}>Found a home on Zillow, Redfin, or MLS? Enter the details below and we&apos;ll build your offer around it.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="card" style={{padding:28}}>
            {/* Street address */}
            <div style={{marginBottom:20}}>
              <label style={{display:"block",fontSize:14,fontWeight:500,color:"var(--gray-700)",marginBottom:6}}>
                Street address <span style={{color:"var(--red)"}}>*</span>
              </label>
              <input type="text" className="input-field" value={address} onChange={e=>setAddress(e.target.value)}
                placeholder="2847 N Clark St" autoComplete="address-line1"
                aria-invalid={!!errors.address} aria-describedby={errors.address ? "err-address" : undefined}/>
              {fieldError("address")}
            </div>

            {/* City / State / ZIP */}
            <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:12,marginBottom:20}}>
              <div>
                <label style={{display:"block",fontSize:14,fontWeight:500,color:"var(--gray-700)",marginBottom:6}}>
                  City <span style={{color:"var(--red)"}}>*</span>
                </label>
                <input type="text" className="input-field" value={city} onChange={e=>setCity(e.target.value)}
                  placeholder="Chicago" autoComplete="address-level2"
                  aria-invalid={!!errors.city}/>
                {fieldError("city")}
              </div>
              <div>
                <label style={{display:"block",fontSize:14,fontWeight:500,color:"var(--gray-700)",marginBottom:6}}>
                  State <span style={{color:"var(--red)"}}>*</span>
                </label>
                <select className="input-field" value={state} onChange={e=>setState(e.target.value)}
                  style={{minWidth:120}} aria-invalid={!!errors.state}>
                  <option value="">State</option>
                  {US_STATES.map(s=><option key={s.v} value={s.v}>{s.l}</option>)}
                </select>
                {fieldError("state")}
              </div>
              <div>
                <label style={{display:"block",fontSize:14,fontWeight:500,color:"var(--gray-700)",marginBottom:6}}>
                  ZIP <span style={{color:"var(--red)"}}>*</span>
                </label>
                <input type="text" className="input-field" value={zip} onChange={e=>setZip(e.target.value.replace(/\D/g,"").slice(0,5))}
                  placeholder="60614" inputMode="numeric" maxLength={5} style={{width:90}}
                  aria-invalid={!!errors.zip}/>
                {fieldError("zip")}
              </div>
            </div>

            {/* List price */}
            <div style={{marginBottom:20}}>
              <label style={{display:"block",fontSize:14,fontWeight:500,color:"var(--gray-700)",marginBottom:6}}>
                List price <span style={{color:"var(--red)"}}>*</span>
              </label>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",fontSize:15,color:"var(--gray-500)",pointerEvents:"none"}}>$</span>
                <input type="text" className="input-field" value={price}
                  onChange={e=>setPrice(e.target.value.replace(/[^0-9]/g,"").replace(/\B(?=(\d{3})+(?!\d))/g,","))}
                  placeholder="485,000" inputMode="numeric" style={{paddingLeft:28}}
                  aria-invalid={!!errors.price}/>
              </div>
              {fieldError("price")}
            </div>

            {/* Beds / Baths / Sqft */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
              <div>
                <label style={{display:"block",fontSize:14,fontWeight:500,color:"var(--gray-700)",marginBottom:6}}>Bedrooms</label>
                <input type="number" className="input-field" value={beds} onChange={e=>setBeds(e.target.value)}
                  placeholder="3" min="1" max="20"/>
              </div>
              <div>
                <label style={{display:"block",fontSize:14,fontWeight:500,color:"var(--gray-700)",marginBottom:6}}>Bathrooms</label>
                <input type="number" className="input-field" value={baths} onChange={e=>setBaths(e.target.value)}
                  placeholder="2" min="1" max="20" step="0.5"/>
              </div>
              <div>
                <label style={{display:"block",fontSize:14,fontWeight:500,color:"var(--gray-700)",marginBottom:6}}>Sq ft <span style={{color:"var(--gray-400)",fontWeight:400}}>(optional)</span></label>
                <input type="text" className="input-field" value={sqft}
                  onChange={e=>setSqft(e.target.value.replace(/[^0-9]/g,"").replace(/\B(?=(\d{3})+(?!\d))/g,","))}
                  placeholder="1,850" inputMode="numeric"/>
              </div>
            </div>

            {/* Agent name */}
            <div style={{marginBottom:8}}>
              <label style={{display:"block",fontSize:14,fontWeight:500,color:"var(--gray-700)",marginBottom:6}}>
                Listing agent name <span style={{color:"var(--gray-400)",fontWeight:400}}>(optional)</span>
              </label>
              <input type="text" className="input-field" value={agentName} onChange={e=>setAgentName(e.target.value)}
                placeholder="Jane Smith"/>
            </div>
            <div className="helper-box" style={{marginBottom:20}}>
              <p style={{fontSize:12,color:"var(--gray-700)"}}>We won&apos;t contact this person on your behalf. Their name is used only to address your cover letter correctly.</p>
            </div>

            <button type="submit"
              style={{width:"100%",padding:"15px",background:"var(--blue)",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:600,cursor:"pointer"}}>
              Use this property →
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
