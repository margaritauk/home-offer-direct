import Link from "next/link";
import { Home, Share2, ExternalLink, Mail, Send } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Search Properties", href: "/search" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/about#contact" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Disclaimer", href: "/legal/disclaimer" },
    { label: "Cookie Policy", href: "/legal" },
  ],
  Support: [
    { label: "FAQ", href: "/faq" },
    { label: "Help Center", href: "#" },
    { label: "State Guides", href: "#" },
    { label: "Buying Checklist", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                HomeOffer<span className="text-blue-400">Direct</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
              The easiest way for home buyers to create and submit professional, legally-compliant offers — without a realtor.
            </p>
            <div className="flex gap-3">
              {[Send, Share2, ExternalLink].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all hover:text-blue-400"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
              <a
                href="mailto:hello@homeofferdirect.org"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all hover:text-blue-400"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            <strong className="text-slate-400">Legal Disclaimer:</strong> HomeOfferDirect.org is not a law firm and does not provide legal advice. The platform provides document automation tools and educational resources only. Users are strongly encouraged to have all real estate documents reviewed by a licensed real estate attorney before submission. HomeOfferDirect does not represent buyers or sellers as a real estate agent. Forms and documents are for informational purposes only and may not be appropriate for all situations or jurisdictions. Consult a qualified real estate attorney in your state for advice specific to your transaction.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} HomeOfferDirect.org. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/legal/terms" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Terms
              </Link>
              <Link href="/legal/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Privacy
              </Link>
              <Link href="/legal/disclaimer" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
