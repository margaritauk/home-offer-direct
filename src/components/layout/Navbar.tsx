"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Home, LogOut, User, ChevronDown, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Prepare to Buy", href: "/prepare-to-buy" },
  { label: "Pricing",      href: "/pricing" },
  { label: "FAQ",          href: "/faq" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userOpen) return;
    const handle = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [userOpen]);

  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    setUserOpen(false);
    setMobileOpen(false);
    router.push("/");
  };

  const isActive = (href: string) =>
    href !== "/" && pathname === href ? true : false;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/50"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div
        className="max-w-7xl mx-auto"
        style={{
          paddingLeft: "max(24px,env(safe-area-inset-left))",
          paddingRight: "max(24px,env(safe-area-inset-right))",
        }}
      >
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group flex-shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-[15px] tracking-tight">
              HomeOffer<span className="text-blue-600">Direct</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive(link.href)
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/dashboard"
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                  pathname === "/dashboard"
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserOpen((o) => !o)}
                  className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-medium">{user.name.split(" ")[0]}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold capitalize border border-blue-100">
                    {user.tier}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userOpen ? "rotate-180" : ""}`} />
                </button>
                {userOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 w-48 z-50 animate-scale-in">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      My Dashboard
                    </Link>
                    <div className="mx-3 my-1.5 h-px bg-slate-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-200"
                >
                  Get started free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden bg-white border-t border-slate-100"
          style={{
            paddingLeft: "max(16px,env(safe-area-inset-left))",
            paddingRight: "max(16px,env(safe-area-inset-right))",
            paddingBottom: "max(16px,env(safe-area-inset-bottom))",
          }}
        >
          <nav className="pt-2 pb-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center px-3 py-2.5 text-[15px] font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 px-3 py-2.5 text-[15px] font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                Dashboard
              </Link>
            )}
          </nav>

          <div className="h-px bg-slate-100 mx-1 mb-3" />

          {user ? (
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.tier} plan</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-[15px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 pb-1">
              <Link
                href="/login"
                className="flex items-center justify-center py-2.5 text-[15px] font-medium text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="flex items-center justify-center py-2.5 text-[15px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
                onClick={() => setMobileOpen(false)}
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
