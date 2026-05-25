import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  Home,
  Target,
  Heart,
  Shield,
  Mail,
  Send,
  Share2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const team = [
  {
    name: "Alex Rodriguez",
    role: "CEO & Co-Founder",
    bio: "Former VP of Product at Zillow. 12 years in PropTech. Lost $22K in buyer agent commissions before building HomeOfferDirect.",
    initials: "AR",
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "Sarah Kim",
    role: "CTO & Co-Founder",
    bio: "Ex-Stripe engineer, MIT CS grad. Built the AI document generation engine that powers our state-compliant form system.",
    initials: "SK",
    color: "from-purple-500 to-purple-700",
  },
  {
    name: "Marcus Thompson",
    role: "Head of Legal & Compliance",
    bio: "15 years as a real estate attorney in Illinois and Texas. Ensures every document meets state compliance requirements.",
    initials: "MT",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    name: "Priya Patel",
    role: "Head of AI Product",
    bio: "Previously led AI product at OpenAI and Redfin. Designed the negotiation copilot and market analysis engine.",
    initials: "PP",
    color: "from-orange-500 to-orange-700",
  },
];

const values = [
  {
    icon: Target,
    title: "Empowering Buyers",
    desc: "We believe every home buyer deserves the same professional tools and knowledge that used to require expensive agents.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Heart,
    title: "Radical Transparency",
    desc: "No hidden fees, no confusing contracts. Plain English in everything we do — from our pricing to your offer documents.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    desc: "Your financial information and offer details are handled with bank-level security and never sold to third parties.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Sparkles,
    title: "AI for Good",
    desc: "We use AI to level the playing field, giving everyday buyers the same data-driven insights as the most experienced agents.",
    color: "bg-purple-50 text-purple-600",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-20 gradient-bg-soft">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-bg rounded-2xl mb-6 shadow-lg">
            <Home className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            We&apos;re making home buying{" "}
            <span className="gradient-text">fair for everyone</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto mb-8">
            HomeOfferDirect was built by a team of frustrated home buyers and PropTech veterans who
            believed that spending 2-3% on buyer agent commissions was an outdated, unnecessary cost
            — and set out to eliminate it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/search"
              className="flex items-center gap-2 gradient-bg text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:opacity-90 transition-all"
            >
              Try It Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#contact"
              className="flex items-center gap-2 bg-white text-slate-700 font-semibold px-8 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">
                Our Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                Saving buyers{" "}
                <span className="gradient-text">$10K–$30K</span>{" "}
                on every home purchase
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                The traditional real estate transaction was designed in the 1970s. The internet
                changed everything — buyers can now find properties themselves, research
                neighborhoods, and understand market data better than ever.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                What buyers still struggled with was the legal paperwork, negotiation strategy, and
                professional presentation. That&apos;s exactly what HomeOfferDirect solves.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our AI-powered platform gives every buyer — first-timer or seasoned investor — the
                tools, knowledge, and confidence to make professional, competitive offers without
                paying an agent&apos;s commission.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "$28M+", label: "Total buyer savings" },
                { value: "2,400+", label: "Successful offers" },
                { value: "5", label: "States covered" },
                { value: "4.9/5", label: "User satisfaction" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center"
                >
                  <p className="text-4xl font-black text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
              What we believe
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <div className={`w-12 h-12 ${value.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Meet the team</h2>
            <p className="text-slate-500 text-lg">
              Real estate veterans, technologists, and lawyers — all on your side.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center hover:shadow-lg transition-all">
                <div className={`w-16 h-16 bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-md`}>
                  {member.initials}
                </div>
                <h3 className="font-bold text-slate-900 mb-0.5">{member.name}</h3>
                <p className="text-xs font-semibold text-blue-600 mb-3">{member.role}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Get in touch</h2>
            <p className="text-slate-500 text-lg">
              Questions, partnerships, press, or just want to say hello — we&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Mail, title: "Email", value: "hello@homeofferdirect.org", href: "mailto:hello@homeofferdirect.org" },
              { icon: Send, title: "Twitter / X", value: "@HomeOfferDirect", href: "#" },
              { icon: Share2, title: "LinkedIn", value: "HomeOfferDirect", href: "#" },
            ].map(({ icon: Icon, title, value, href }) => (
              <a
                key={title}
                href={href}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-center hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">{title}</p>
                <p className="text-sm text-blue-600">{value}</p>
              </a>
            ))}
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Send us a message</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
              <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white">
                <option>General Question</option>
                <option>Support Request</option>
                <option>Partnership Inquiry</option>
                <option>Press / Media</option>
                <option>Investor Relations</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
              <textarea
                rows={5}
                placeholder="Tell us how we can help..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>
            <button className="flex items-center gap-2 gradient-bg text-white font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-sm">
              Send Message
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
