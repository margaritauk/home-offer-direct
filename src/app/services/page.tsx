import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Phone, ExternalLink, AlertCircle } from "lucide-react";

interface Provider {
  name: string;
  specialty: string;
  description: string;
  costRange: string;
  phone: string;
  website: string;
}

interface Category {
  title: string;
  description: string;
  providers: Provider[];
}

const SERVICE_CATEGORIES: Category[] = [
  {
    title: "Real Estate Attorneys",
    description: "Illinois law requires a 5-business-day attorney review period after an offer is accepted. Retain an attorney as soon as possible.",
    providers: [
      {
        name: "Goldstein & Marsh Law",
        specialty: "Residential Real Estate — Illinois",
        description: "Chicago-area firm specializing in residential purchase and sale transactions, title review, and contract negotiation for buyers.",
        costRange: "$500 – $1,200 flat fee",
        phone: "(312) 555-0181",
        website: "#",
      },
      {
        name: "Patel & Associates",
        specialty: "Real Estate Law — Cook & DuPage Counties",
        description: "20+ years handling Illinois residential closings. Free initial consultation. Represents buyers exclusively to avoid conflicts of interest.",
        costRange: "$400 – $900 flat fee",
        phone: "(312) 555-0294",
        website: "#",
      },
      {
        name: "Chen Law Group",
        specialty: "Buyer Representation — Chicagoland",
        description: "Boutique firm focused on buyer-side real estate law. Condo, single-family, and multi-unit experience across all Chicago neighborhoods.",
        costRange: "$600 – $1,100 flat fee",
        phone: "(773) 555-0416",
        website: "#",
      },
    ],
  },
  {
    title: "Home Inspectors",
    description: "Schedule your home inspection within your contingency window — typically 5–10 business days after acceptance. Don't wait.",
    providers: [
      {
        name: "TrustPoint Home Inspections",
        specialty: "Full Home Inspection — Chicago & Suburbs",
        description: "InterNACHI-certified inspectors covering all major systems: foundation, roof, HVAC, plumbing, and electrical. Same-week availability.",
        costRange: "$350 – $550",
        phone: "(312) 555-0339",
        website: "#",
      },
      {
        name: "Lakefront Inspection Services",
        specialty: "Residential & Condo Inspections",
        description: "Specializes in high-rise condos and Chicago brownstones. Includes radon testing and sewer scope add-ons at competitive rates.",
        costRange: "$300 – $600",
        phone: "(312) 555-0528",
        website: "#",
      },
      {
        name: "Midwest Pro Inspectors",
        specialty: "Buyer Inspections — North Shore & Chicago",
        description: "ASHI-certified. Detailed written reports delivered within 24 hours. Thermal imaging included on all inspections.",
        costRange: "$375 – $575",
        phone: "(847) 555-0612",
        website: "#",
      },
    ],
  },
  {
    title: "Mortgage Lenders",
    description: "If you're using financing, submit your full mortgage application immediately after acceptance. Delays can jeopardize your closing timeline.",
    providers: [
      {
        name: "Great Lakes Mortgage Partners",
        specialty: "Conventional, FHA & Jumbo Loans",
        description: "Local Illinois lender offering competitive rates on conventional, FHA, and jumbo loans. Pre-approval letters issued within 24 hours.",
        costRange: "Rates from 6.2% APR (varies)",
        phone: "(312) 555-0745",
        website: "#",
      },
      {
        name: "Northshore Lending Group",
        specialty: "Purchase & Refinance — Chicago Metro",
        description: "Physician loans, first-time buyer programs, and down payment assistance available. Average 28-day close.",
        costRange: "Rates from 6.4% APR (varies)",
        phone: "(847) 555-0831",
        website: "#",
      },
      {
        name: "Lakeside Bank Mortgage",
        specialty: "Community Bank Lending — Illinois",
        description: "Portfolio lender that can hold unusual property types (mixed-use, non-warrantable condos). In-house underwriting for faster decisions.",
        costRange: "Rates from 6.3% APR (varies)",
        phone: "(312) 555-0967",
        website: "#",
      },
    ],
  },
  {
    title: "Title Companies",
    description: "A title company performs a title search and issues title insurance to protect you from ownership disputes or liens discovered after closing.",
    providers: [
      {
        name: "Metro Title & Escrow",
        specialty: "Residential Title Insurance — Illinois",
        description: "Full-service title and escrow company handling closings across the Chicago metro area. Owner's and lender's title policies available.",
        costRange: "$800 – $2,000 (based on purchase price)",
        phone: "(312) 555-0154",
        website: "#",
      },
      {
        name: "Clearview Title Services",
        specialty: "Title Search & Closing Services",
        description: "Independent title company known for fast turnaround on title searches. Remote and in-person closing options available.",
        costRange: "$750 – $1,800 (based on purchase price)",
        phone: "(312) 555-0278",
        website: "#",
      },
    ],
  },
  {
    title: "Moving Companies",
    description: "Start getting moving quotes 4–6 weeks before your closing date. In-home estimates are typically more accurate than phone quotes.",
    providers: [
      {
        name: "Windy City Movers",
        specialty: "Local & Long-Distance Moving — Chicago",
        description: "Licensed and insured mover serving Chicagoland since 2008. Free in-home estimates. Packing services available.",
        costRange: "$800 – $3,000 (local, varies by size)",
        phone: "(312) 555-0503",
        website: "#",
      },
      {
        name: "Lakeview Moving Co.",
        specialty: "Residential Moving — Chicago Metro",
        description: "Specializes in apartment and condo moves in city high-rises. Elevator reservation coordination included.",
        costRange: "$600 – $2,500 (local, varies by size)",
        phone: "(773) 555-0689",
        website: "#",
      },
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Service Providers
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl leading-relaxed">
            A curated list of professionals buyers typically need when purchasing a home in the Chicago area. Use this as a starting point — always do your own due diligence.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-10">
          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0"/>
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Disclaimer:</strong> HomeOfferDirect does not endorse or receive referral fees from any listed provider. This list is for informational purposes only. Always verify credentials, licensing, and reviews before hiring any service provider.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {SERVICE_CATEGORIES.map((category) => (
            <section key={category.title}>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-1">{category.title}</h2>
                <p className="text-sm text-slate-500 leading-relaxed">{category.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {category.providers.map((provider) => (
                  <div
                    key={provider.name}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-sm mb-0.5">{provider.name}</h3>
                      <p className="text-xs text-blue-600 font-medium mb-3">{provider.specialty}</p>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">{provider.description}</p>
                      <div className="bg-slate-50 rounded-lg px-3 py-2 mb-4">
                        <p className="text-xs text-slate-400 mb-0.5">Estimated cost</p>
                        <p className="text-xs font-semibold text-slate-700">{provider.costRange}</p>
                      </div>
                    </div>
                    <div className="space-y-2 pt-1">
                      <a
                        href={`tel:${provider.phone.replace(/\D/g, "")}`}
                        className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0"/>
                        {provider.phone}
                      </a>
                      <a
                        href={provider.website}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Visit website
                        <ExternalLink className="w-3 h-3"/>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom disclaimer */}
        <div className="mt-14 border-t border-slate-200 pt-8">
          <p className="text-xs text-slate-400 leading-relaxed text-center max-w-2xl mx-auto">
            HomeOfferDirect does not endorse or receive referral fees from any listed provider. This list is for informational purposes only. Provider availability, pricing, and services are subject to change. Always verify licensing and read reviews before engaging any professional.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
