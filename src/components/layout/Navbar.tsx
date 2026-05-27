"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Home, LogOut, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { label:"How It Works", href:"/#how-it-works" },
  { label:"Features",     href:"/#features" },
  { label:"Pricing",      href:"/pricing" },
  { label:"FAQ",          href:"/faq" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setUserOpen(false);
    setMobileOpen(false);
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/60"
      style={{paddingTop:"env(safe-area-inset-top)"}}>
      <div className="max-w-7xl mx-auto"
        style={{paddingLeft:"max(16px,env(safe-area-inset-left))",paddingRight:"max(16px,env(safe-area-inset-right))"}}>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0" onClick={() => setMobileOpen(false)}>
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg leading-none">
              HomeOffer<span className="gradient-text">Direct</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                {link.label}
              </Link>
            ))}
            {user && (
              <Link href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                My Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setUserOpen(o => !o)}
                  className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all">
                  <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-medium">{user.name.split(" ")[0]}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold capitalize">{user.tier}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400"/>
                </button>
                {userOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg py-1 w-44 z-50">
                    <Link href="/dashboard" onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                      <User className="w-4 h-4 text-slate-400"/> My Dashboard
                    </Link>
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4"/> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all">
                  Log in
                </Link>
                <Link href="/signup"
                  className="text-sm font-semibold text-white gradient-bg px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition-all hover:opacity-90">
                  Start Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-testid="mobile-menu-btn">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/60"
          data-testid="mobile-menu"
          style={{paddingLeft:"max(16px,env(safe-area-inset-left))",paddingRight:"max(16px,env(safe-area-inset-right))"}}>
          <div className="py-4 space-y-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="block px-4 py-3 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            {user && (
              <Link href="/dashboard"
                className="block px-4 py-3 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                onClick={() => setMobileOpen(false)}>
                My Dashboard
              </Link>
            )}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 mt-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{user.tier} plan</p>
                    </div>
                  </div>
                  <button onClick={handleLogout}
                    className="block text-center py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-all">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login"
                    className="block text-center py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg border border-slate-200 transition-all"
                    onClick={() => setMobileOpen(false)}>
                    Log in
                  </Link>
                  <Link href="/signup"
                    className="block text-center py-2.5 text-sm font-semibold text-white gradient-bg rounded-lg shadow-sm transition-all"
                    onClick={() => setMobileOpen(false)}>
                    Start Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
