import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: brand */}
        <div className="brand-gradient p-8 sm:p-10 text-white flex flex-col justify-between">
          <Link href="/" className="text-lg font-bold">HomeOfferDirect</Link>
          <div>
            <h2 className="text-2xl font-bold mb-3 leading-snug">Make your first offer for free</h2>
            <p className="text-blue-100 text-sm mb-8">Join 2,400+ buyers who saved an average of $12,400.</p>
            <ul className="space-y-3">
              {["No credit card required","Full offer preview before paying","State-compliant documents","AI explains every term"].map(b=>(
                <li key={b} className="flex items-center gap-2.5 text-sm text-blue-100">
                  <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0"/> {b}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-blue-200 mt-8">Not a law firm · Attorney review recommended</p>
        </div>
        {/* Right: form */}
        <div className="p-8 sm:p-10">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-sm text-gray-500 mb-6">Free to start</p>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <input type="text" placeholder="Jane Smith"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" placeholder="jane@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" placeholder="Min. 8 characters"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Buying in which state?</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select state</option>
                {["Illinois","Texas","New York","California","Florida"].map(s=>(
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600"/>
              <span className="text-xs text-gray-500">
                I agree to the <Link href="/legal/terms" className="text-blue-600 hover:underline">Terms</Link> and <Link href="/legal/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>. I understand this is not legal advice.
              </span>
            </label>
            <button className="w-full flex items-center justify-center gap-2 brand-gradient text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity">
              Create free account <ArrowRight className="w-4 h-4"/>
            </button>
          </form>
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100"/>
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100"/>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {["Google","Apple"].map(p=>(
              <button key={p} className="py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                {p}
              </button>
            ))}
          </div>
          <p className="text-center mt-5 text-sm text-gray-500">
            Have an account? <Link href="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
