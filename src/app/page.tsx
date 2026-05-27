import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  ArrowRight, CheckCircle, Search, FileText, Send,
  DollarSign, Shield, Zap, Star,
} from "lucide-react";

/* ─── Hero ─────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="pt-28 pb-20 px-4 sm:px-6 text-center bg-white">
      <div className="max-w-3xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-6">
          <Zap className="w-3 h-3" />
          AI-powered · No agent needed · State-compliant forms
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-5">
          Make a home offer<br />
          <span className="text-gradient">without a realtor</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
          We walk you through every step in plain English, generate the legal documents, and help you send a professional offer directly to the listing agent.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link href="/search"
            className="flex items-center justify-center gap-2 text-white brand-gradient font-semibold px-8 py-4 rounded-xl text-base hover:opacity-90 transition-opacity shadow-sm">
            Start my offer — it&apos;s free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/#how-it-works"
            className="flex items-center justify-center gap-2 text-gray-700 bg-gray-50 border border-gray-200 font-medium px-8 py-4 rounded-xl text-base hover:bg-gray-100 transition-colors">
            See how it works
          </Link>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
          {["No credit card required", "Preview free before paying", "Attorney-grade documents"].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Social proof bar ──────────────────────────────────────────────── */
function SocialProof() {
  return (
    <div className="bg-gray-50 border-y border-gray-100 py-5 px-4">
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
        <div className="flex items-center gap-2">
          <div className="flex">
            {["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444"].map((c,i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-white -ml-1 first:ml-0 flex items-center justify-center text-white text-xs font-bold" style={{background:c}}>
                {["J","S","T","A","M"][i]}
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-600 font-medium">2,400+ buyers</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[1,2,3,4,5].map(i=><Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400"/>)}
          <span className="text-sm text-gray-600 font-medium ml-1">4.9 / 5 rating</span>
        </div>
        <div className="text-sm text-gray-600 font-medium">
          <span className="text-gray-900 font-bold">$28M+</span> saved in commissions
        </div>
        <div className="text-sm text-gray-600">
          Covers <span className="text-gray-900 font-semibold">IL · TX · NY · CA · FL</span>
        </div>
      </div>
    </div>
  );
}

/* ─── How it works ──────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      icon: Search,
      step: "1",
      title: "Find your property",
      desc: "Search any address or paste a Zillow / Redfin URL. We pull in photos, price history, and market data automatically.",
    },
    {
      icon: FileText,
      step: "2",
      title: "Build your offer",
      desc: "Our guided wizard asks simple questions. AI explains every term in plain English and recommends the best strategy for your market.",
    },
    {
      icon: Send,
      step: "3",
      title: "Submit with confidence",
      desc: "Download a professional offer package or send it directly to the listing agent — looks exactly like an agent-submitted offer.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">Simple process</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            From listing to offer in 3 steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="relative">
                {/* Connector */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gray-200 z-0" style={{width:'calc(100% - 3rem)',left:'calc(50% + 1.5rem)'}} />
                )}
                <div className="relative z-10 flex flex-col items-start sm:items-center text-left sm:text-center">
                  <div className="w-12 h-12 rounded-xl brand-gradient flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xs font-bold text-gray-300 mb-1">STEP {s.step}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/search"
            className="inline-flex items-center gap-2 text-white brand-gradient font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm">
            Try it free — no account needed
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Savings ───────────────────────────────────────────────────────── */
function Savings() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left */}
            <div className="p-8 sm:p-10">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">Real savings</p>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
                Keep the commission.<br />It&apos;s yours.
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                A buyer&apos;s agent typically costs 2–3% of the purchase price. On a $500K home that&apos;s up to $15,000 out of your pocket. We charge $99.
              </p>
              <div className="space-y-3">
                {[
                  { home: "$400K home", agent: "$12,000", us: "$99", saved: "$11,901" },
                  { home: "$600K home", agent: "$18,000", us: "$99", saved: "$17,901" },
                  { home: "$800K home", agent: "$24,000", us: "$99", saved: "$23,901" },
                ].map(row => (
                  <div key={row.home} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500 w-24">{row.home}</span>
                    <span className="text-gray-400 line-through">{row.agent}</span>
                    <span className="text-blue-600 font-medium">{row.us}</span>
                    <span className="text-green-600 font-bold">{row.saved}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Right */}
            <div className="brand-gradient p-8 sm:p-10 flex flex-col justify-center text-white">
              <DollarSign className="w-10 h-10 mb-5 opacity-80" />
              <p className="text-white/70 text-sm font-medium uppercase tracking-wide mb-1">Average savings</p>
              <p className="text-5xl font-bold mb-2">$12,400</p>
              <p className="text-white/70 text-sm mb-8">per home purchase</p>
              <Link href="/pricing"
                className="w-full text-center py-3.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm">
                See pricing →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Features (simple 3-col) ───────────────────────────────────────── */
function Features() {
  const items = [
    { icon: "🤖", title: "AI explains everything", desc: "Every clause, contingency, and term explained in plain English as you go." },
    { icon: "📋", title: "State-compliant forms", desc: "Correct legal forms for Illinois, Texas, New York, California, and Florida." },
    { icon: "📈", title: "Offer strategy", desc: "AI analyzes local market data and recommends a competitive offer price." },
    { icon: "⚡", title: "Escalation clauses", desc: "Beat competing offers automatically up to your max — without showing your hand." },
    { icon: "🔒", title: "Contingency builder", desc: "Inspection, appraisal, and financing contingencies with risk explanations." },
    { icon: "✉️", title: "Send to agent", desc: "Email your professional offer package directly to the listing agent from the platform." },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Everything your agent would do
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(item => (
            <div key={item.title} className="p-6 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all bg-white">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ──────────────────────────────────────────────────── */
function Testimonials() {
  const quotes = [
    { name: "Jennifer M.", location: "Chicago, IL", saved: "$14,500", quote: "I was terrified to buy without an agent. HomeOfferDirect held my hand through every step. Closed in 45 days and saved over $14K.", color: "#3b82f6" },
    { name: "David & Sarah K.", location: "Austin, TX", saved: "$18,200", quote: "The AI negotiation tips helped us get $12K off asking price. The plain-English explanations were incredible.", color: "#8b5cf6" },
    { name: "Marcus T.", location: "Los Angeles, CA", saved: "$22,800", quote: "Made three offers. On our third, the escalation clause builder is what got us the house in a bidding war.", color: "#10b981" },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">Stories</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Real buyers, real savings
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quotes.map(q => (
            <div key={q.name} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex gap-0.5 mb-4">
                {[1,2,3,4,5].map(i=><Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400"/>)}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">"{q.quote}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{background: q.color}}>
                    {q.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{q.name}</p>
                    <p className="text-xs text-gray-400">{q.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-green-600">{q.saved}</p>
                  <p className="text-xs text-gray-400">saved</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ───────────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
          Ready to make your offer?
        </h2>
        <p className="text-gray-500 mb-8">
          Start free. No credit card, no account required to preview your offer.
        </p>
        <Link href="/search"
          className="inline-flex items-center gap-2 text-white brand-gradient font-semibold px-10 py-4 rounded-xl text-base hover:opacity-90 transition-opacity shadow-sm">
          Start my offer free
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" />
          Not a law firm · Attorney review recommended before submitting
        </p>
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <Savings />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
