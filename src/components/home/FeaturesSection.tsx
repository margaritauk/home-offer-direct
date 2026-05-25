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
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: FileCheck,
    title: "State-Compliant Documents",
    description:
      "Automatically select and fill the correct state-specific purchase agreement forms for IL, TX, NY, CA, FL and more.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: TrendingUp,
    title: "Offer Strength Meter",
    description:
      "See in real-time how competitive your offer is against current market conditions in the target neighborhood.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: MessageSquare,
    title: "Plain-English Explanations",
    description:
      "Every term, contingency, and clause explained in plain language — like having a real estate attorney on call.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: DollarSign,
    title: "Save Thousands",
    description:
      "Skip the buyer's agent commission (2-3%). On a $500K home, that's $10,000–$15,000 back in your pocket.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Shield,
    title: "Contingency Builder",
    description:
      "Easily add financing, inspection, appraisal, and sale contingencies with AI-guided recommendations for each.",
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    icon: Zap,
    title: "Escalation Clauses",
    description:
      "Build automatic escalation clauses to beat competing offers up to your maximum — without revealing your top number.",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    icon: MapPin,
    title: "Property Market Analysis",
    description:
      "AI-powered comps analysis shows price history, days on market trends, and suggested negotiation leverage.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: Clock,
    title: "Fast Document Generation",
    description:
      "Professional offer package with cover letter, purchase agreement, and addendums — generated in under 2 minutes.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Award,
    title: "Repair Request Builder",
    description:
      "Automatically build professional repair request documents based on inspection findings and seller psychology.",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    icon: Users,
    title: "Listing Agent Lookup",
    description:
      "Find and contact the listing agent directly. Send your offer package with a professional cover letter.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Bank-level encryption for all documents and personal data. Your offer details are never shared.",
    color: "text-slate-600",
    bg: "bg-slate-50",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full mb-4">
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
              <div className={`w-11 h-11 ${feature.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
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
