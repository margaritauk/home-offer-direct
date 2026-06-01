import {
  Brain, FileCheck, TrendingUp, Shield, MessageSquare, DollarSign,
  MapPin, Clock, Zap, Award, Users, Lock,
} from "lucide-react";

const features = [
  { icon: Brain,        title: "AI Negotiation Copilot",       description: "Real-time AI advice on offer strategy, pricing, and negotiation tactics based on local market data." },
  { icon: FileCheck,    title: "State-Compliant Documents",    description: "Automatically select and fill the correct state-specific purchase agreement for IL, TX, NY, CA, FL and more." },
  { icon: TrendingUp,   title: "Offer Strength Meter",         description: "See how competitive your offer is against current market conditions in the target neighborhood — in real time." },
  { icon: MessageSquare, title: "Plain-English Explanations",  description: "Every term, contingency, and clause explained clearly — like having a real estate attorney on speed dial." },
  { icon: DollarSign,   title: "Save $10K–$30K",               description: "Skip the buyer's agent commission (2-3%). On a $500K home, that's up to $15,000 back in your pocket." },
  { icon: Shield,       title: "Contingency Builder",          description: "Add financing, inspection, appraisal, and sale contingencies with AI-guided recommendations for each one." },
  { icon: Zap,          title: "Escalation Clauses",           description: "Beat competing offers automatically up to your maximum — without revealing your top number to the seller." },
  { icon: MapPin,       title: "Market Analysis",              description: "AI-powered comps show price history, days-on-market trends, and the right negotiation leverage for each home." },
  { icon: Clock,        title: "2-Minute Documents",           description: "Professional offer package — cover letter, purchase agreement, addendums — ready to send in under 2 minutes." },
  { icon: Award,        title: "Repair Request Builder",       description: "Build professional repair request letters based on inspection findings and seller psychology principles." },
  { icon: Users,        title: "Direct Agent Delivery",        description: "Find and contact the listing agent directly, and send your professional offer package with one click." },
  { icon: Lock,         title: "Bank-Level Security",          description: "Your documents and personal data are encrypted at rest and in transit. Your offer details are never shared." },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="section-label">Everything you need</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-5">
            Intelligent features.<br />
            <span className="gradient-text">Zero guesswork.</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Everything a buyer&apos;s agent does for you — plus AI insights they couldn&apos;t provide.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                <feature.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-[15px] font-semibold text-slate-900 mb-2.5">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
