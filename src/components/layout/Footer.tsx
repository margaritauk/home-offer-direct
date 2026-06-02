import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <div>
            <Link href="/" className="font-bold text-gray-900 text-base">
              HomeOffer<span className="text-brand">Direct</span>
            </Link>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              Make a professional home offer without a realtor.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-500">
            <Link href="/prepare-to-buy"    className="hover:text-gray-900 transition-colors">Prepare to Buy</Link>
            <Link href="/pricing"          className="hover:text-gray-900 transition-colors">Pricing</Link>
            <Link href="/faq"              className="hover:text-gray-900 transition-colors">FAQ</Link>
            <Link href="/about"            className="hover:text-gray-900 transition-colors">About</Link>
            <Link href="/legal/terms"      className="hover:text-gray-900 transition-colors">Terms</Link>
            <Link href="/legal/privacy"    className="hover:text-gray-900 transition-colors">Privacy</Link>
            <Link href="/legal/disclaimer" className="hover:text-gray-900 transition-colors">Disclaimer</Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-3">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} HomeOfferDirect.org. All rights reserved.</p>
          <p className="text-xs text-gray-400 max-w-sm">
            Not a law firm. Documents are for informational use. Always consult a licensed real estate attorney before submitting an offer.
          </p>
        </div>
      </div>
    </footer>
  );
}
