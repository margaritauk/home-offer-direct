import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-bold text-gray-900">
            HomeOffer<span className="text-brand">Direct</span>
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" placeholder="you@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-blue-600 hover:underline">Forgot?</a>
              </div>
              <input type="password" placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
            </div>
            <button className="w-full flex items-center justify-center gap-2 brand-gradient text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity">
              Sign in <ArrowRight className="w-4 h-4"/>
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
        </div>
        <p className="text-center mt-5 text-sm text-gray-500">
          No account? <Link href="/signup" className="text-blue-600 font-medium hover:underline">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}
