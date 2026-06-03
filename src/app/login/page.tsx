"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const TEST_ACCOUNTS = [
  { email: "free@test.com",    label: "Free tier"    },
  { email: "basic@test.com",   label: "Basic tier"   },
  { email: "premium@test.com", label: "Premium tier" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md group-hover:bg-blue-700 transition-colors">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-xl tracking-tight">
              HomeOffer<span className="text-blue-600">Direct</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1.5 tracking-tight">Welcome back</h1>
          <p className="text-[15px] text-slate-500 mb-8">Sign in to continue your offers</p>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3.5 mb-6">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[15px] text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                {forgotSent ? (
                  <span className="text-xs text-green-600 font-medium">Email hello@homeofferdirect.org</span>
                ) : (
                  <button type="button" onClick={() => setForgotSent(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 border border-slate-200 rounded-xl text-[15px] text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-xl transition-all shadow-sm shadow-blue-200 text-[15px] mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Google", logo: "G" },
              { label: "Apple",  logo: "⌘" },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => setError(`${p.label} Sign-In requires OAuth credentials in .env`)}
                className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
              >
                <span className="font-bold text-base">{p.logo}</span>
                {p.label}
              </button>
            ))}
          </div>

          {/* Test accounts */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 mb-2.5">Demo accounts — password: test123</p>
            <div className="space-y-1.5">
              {TEST_ACCOUNTS.map((a) => (
                <button
                  key={a.email}
                  onClick={() => { setEmail(a.email); setPassword("test123"); setError(""); }}
                  className="block text-left w-full text-xs text-blue-600 hover:text-blue-800 hover:underline py-0.5"
                >
                  {a.email}
                  <span className="text-blue-400 ml-1">· {a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-slate-500">
          No account?{" "}
          <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-700">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
