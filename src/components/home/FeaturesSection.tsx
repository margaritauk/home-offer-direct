import {
  Brain,
  FileCheck,
  TrendingUp,
  Shield,
  MessageSquare,
  DollarSign,
  MapPin,
  Clock,
  Zap,
  Award,
  Users,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Negotiation Copilot",
    description:
      "Get real-time AI advice on offer strategy, pricing, and negotiation tactics based on local market data.",
  },
  {
    icon: FileCheck,
    title: "State-Compliant Documents",
    description:
      "Automatically select and fill the correct state-specific purchase agreement forms for IL, TX, NY, CA, FL and more.",
  },
  {
    icon: TrendingUp,
    title: "Offer Strength Meter",
    description:
      "See in real-time how competitive your offer is against current market conditions in the target neighborhood.",
  },
  {
    icon: MessageSquare,
    title: "Plain-English Explanations",
    description:
      "Every term, contingency, and clause explained in plain language — like having a real estate attorney on call.",
  },
  {
    icon: DollarSign,
    title: "Save Thousands",
    description:
      "Skip the buyer's agent commission (2-3%). On a $500K home, that's $10,000–$15,000 back in your pocket.",
  },
  {
    icon: Shield,
    title: "Contingency Builder",
    description:
      "Easily add financing, inspection, appraisal, and sale contingencies with AI-guided recommendations for each.",
  },
  {
    icon: Zap,
    title: "Escalation Clauses",
    description:
      "Build automatic escalation clauses to beat competing offers up to your maximum — without revealing your top number.",
  },
  {
    icon: MapPin,
    title: "Property Market Analysis",
    description:
      "AI-powered comps analysis shows price history, days on market trends, and suggested negotiation leverage.",
  },
  {
    icon: Clock,
    title: "Fast Document Generation",
    description:
      "Professional offer package with cover letter, purchase agreement, and addendums — generated in under 2 minutes.",
  },
  {
    icon: Award,
    title: "Repair Request Builder",
    description:
      "Automatically build professional repair request documents based on inspection findings and seller psychology.",
  },
  {
    icon: Users,
    title: "Listing Agent Lookup",
    description:
      "Find and contact the listing agent directly. Send your offer package with a professional cover letter.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Bank-level encryption for all documents and personal data. Your offer details are never shared.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
            Everything You Need
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5">
            Packed with{" "}
            <span className="gradient-text">intelligent features</span>
          </h2>
          <p className="text-xl text-slate-500 leading-relaxed">
            Everything a buyer&apos;s agent would do for you — plus AI-powered insights they
            couldn&apos;t give you.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 text-sm">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
