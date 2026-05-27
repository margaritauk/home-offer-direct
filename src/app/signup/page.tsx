"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const benefits = [
  "Free offer wizard preview",
  "AI-powered negotiation guidance",
  "State-compliant documents",
  "Save thousands in commissions",
];

const STATES = [
  { value:"IL", label:"Illinois" },
  { value:"TX", label:"Texas" },
  { value:"NY", label:"New York" },
  { value:"CA", label:"California" },
  { value:"FL", label:"Florida" },
];

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError("You must agree to the Terms to continue."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError("");
    setLoading(true);
    try {
      await register(name, email, password, state || "IL");
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    setError(`${provider} Sign-In requires OAuth credentials in .env. See docs/auth-setup.md.`);
  };

  return (
    <div className="min-h-screen gradient-bg-soft flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Left: branding */}
        <div className="gradient-bg p-8 sm:p-10 flex flex-col justify-between text-white">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-10">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">HomeOfferDirect</span>
            </Link>
            <h2 className="text-3xl font-extrabold leading-tight mb-4">
              Make your first professional offer for free
            </h2>
            <p className="text-blue-100 leading-relaxed mb-8">
              Join 2,400+ buyers who have saved an average of $12,400 in agent commissions.
            </p>
            <ul className="space-y-3">
              {benefits.map(b => (
                <li key={b} className="flex items-center gap-3 text-sm text-blue-100">
                  <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" /> {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/10 rounded-2xl p-5 mt-8">
            <p className="text-sm text-blue-100 leading-relaxed italic">
              &ldquo;I saved $14,500 on my home purchase. The entire process took less than 30 minutes.
              The offer looked more professional than anything I&apos;ve seen from agents.&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">JM</div>
              <div>
                <p className="text-sm font-semibold text-white">Jennifer Martinez</p>
                <p className="text-xs text-blue-200">Purchased in Chicago, IL</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="p-8 sm:p-10">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Create your account</h1>
          <p className="text-slate-500 mb-6 text-sm">Free to start — no credit card required</p>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"/>
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Jane Smith" required autoComplete="name"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="jane@email.com" required autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" required autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">What state are you buying in?</label>
              <select value={state} onChange={e => setState(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white">
                <option value="">Select a state</option>
                {STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="terms" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
              <label htmlFor="terms" className="text-xs text-slate-500 cursor-pointer leading-relaxed">
                I agree to the{" "}
                <Link href="/legal/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/legal/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                I understand HomeOfferDirect is not a law firm and does not provide legal advice.
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 gradient-bg text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all shadow-sm disabled:opacity-60">
              {loading ? "Creating account…" : <><span>Create Free Account</span><ArrowRight className="w-4 h-4"/></>}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or sign up with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label:"Google", logo:"G", color:"hover:bg-red-50" },
              { label:"Apple",  logo:"🍎", color:"hover:bg-slate-50" },
            ].map(p => (
              <button key={p.label} onClick={() => handleOAuth(p.label)}
                className={`flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-all ${p.color}`}>
                <span className="font-bold">{p.logo}</span> {p.label}
              </button>
            ))}
          </div>

          <p className="text-center mt-6 text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
