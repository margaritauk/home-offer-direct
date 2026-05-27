"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

        {/* Logo */}
        <Link href="/" className="font-bold text-gray-900 text-base tracking-tight" onClick={() => setOpen(false)}>
          HomeOffer<span className="text-brand">Direct</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-500">
          <Link href="/#how-it-works" className="hover:text-gray-900 transition-colors">How it works</Link>
          <Link href="/pricing"        className="hover:text-gray-900 transition-colors">Pricing</Link>
          <Link href="/faq"            className="hover:text-gray-900 transition-colors">FAQ</Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login"  className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Log in</Link>
          <Link href="/signup" className="text-sm font-semibold text-white brand-gradient px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            Get started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1">
          {[
            { href: "/#how-it-works", label: "How it works" },
            { href: "/pricing",       label: "Pricing" },
            { href: "/faq",           label: "FAQ" },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className="py-3 text-sm text-gray-700 border-b border-gray-50 hover:text-blue-600 transition-colors"
              onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-3">
            <Link href="/login"  onClick={() => setOpen(false)} className="w-full text-center py-3 text-sm border border-gray-200 rounded-lg text-gray-700">Log in</Link>
            <Link href="/signup" onClick={() => setOpen(false)} className="w-full text-center py-3 text-sm font-semibold text-white brand-gradient rounded-lg">Get started free</Link>
          </div>
        </div>
      )}
    </header>
  );
}
