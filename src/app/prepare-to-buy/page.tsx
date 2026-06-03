"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  Mail,
  Calendar,
  CheckCircle,
  Copy,
  Check,
  ArrowRight,
  Phone,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Home,
} from "lucide-react";

/* ── Contact Agent ──────────────────────────────────────── */

function ContactAgentCard() {
  const [form, setForm] = useState({
    yourName: "",
    agentName: "",
    agentEmail: "",
    propertyAddress: "",
  });
  const [copied, setCopied] = useState(false);

  const emailBody = `Hi ${form.agentName || "[Agent Name]"},

My name is ${form.yourName || "[Your Name]"} and I'm interested in the property at ${form.propertyAddress || "[Property Address]"}.

I'd love to schedule a showing at your earliest convenience. I'm pre-approved for a mortgage and ready to move quickly if the property is a good fit.

Please let me know your available times. I'm flexible and can accommodate your schedule.

Thank you for your time,
${form.yourName || "[Your Name]"}`;

  const mailtoLink = `mailto:${form.agentEmail}?subject=Showing Request — ${form.propertyAddress || "Property"}&body=${encodeURIComponent(emailBody)}`;

  const copyTemplate = async () => {
    await navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Contact the Listing Agent</h3>
            <p className="text-sm text-slate-500">Generate a professional email in seconds</p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Your name</label>
            <input
              type="text"
              placeholder="Alex Johnson"
              value={form.yourName}
              onChange={(e) => setForm({ ...form, yourName: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Agent name</label>
            <input
              type="text"
              placeholder="Sarah Williams"
              value={form.agentName}
              onChange={(e) => setForm({ ...form, agentName: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Agent email</label>
            <input
              type="email"
              placeholder="agent@realty.com"
              value={form.agentEmail}
              onChange={(e) => setForm({ ...form, agentEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Property address</label>
            <input
              type="text"
              placeholder="123 Maple St, Austin, TX 78701"
              value={form.propertyAddress}
              onChange={(e) => setForm({ ...form, propertyAddress: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email preview</label>
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed h-[220px] overflow-y-auto font-mono text-xs">
            {emailBody}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={copyTemplate}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
              {copied ? "Copied!" : "Copy template"}
            </button>
            {copied && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg animate-fade-in-up pointer-events-none">
                <Check className="w-4 h-4 text-green-400" /> Copied to clipboard
              </div>
            )}
            {form.agentEmail && (
              <a
                href={mailtoLink}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
              >
                <Mail className="w-4 h-4" />
                Open in email
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Schedule Viewing ───────────────────────────────────── */

const timeSlots = [
  "Morning (9am–12pm)",
  "Afternoon (12pm–4pm)",
  "Evening (4pm–7pm)",
];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function ScheduleViewingCard() {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const requestText = `Hi,

I'd like to schedule a showing for this property. I'm available on: ${
    selectedDays.length > 0 ? selectedDays.join(", ") : "[select days above]"
  } during the ${selectedTime || "[select time preference]"}.

${notes ? `Additional notes: ${notes}\n\n` : ""}Please let me know what works best for you.

Thank you!`;

  const copyText = async () => {
    await navigator.clipboard.writeText(requestText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Schedule a Home Tour</h3>
            <p className="text-sm text-slate-500">Pick your availability and generate a request</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Day selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2.5">Preferred days</label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                  selectedDays.includes(day)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Time preference */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2.5">Time preference</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                  selectedTime === slot
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Notes <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Accessible entrance required, bringing spouse"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Request preview */}
        {(selectedDays.length > 0 || selectedTime) && (
          <div>
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-xs text-slate-600 whitespace-pre-wrap font-mono leading-relaxed mb-3">
              {requestText}
            </div>
            <button
              onClick={copyText}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
              {copied ? "Copied!" : "Copy showing request"}
            </button>
            {copied && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg animate-fade-in-up pointer-events-none">
                <Check className="w-4 h-4 text-green-400" /> Copied to clipboard
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Pre-Approval ───────────────────────────────────────── */

const preApprovalChecklist = [
  {
    category: "Income documentation",
    items: [
      "Last 2 years of W-2 or 1099 forms",
      "Last 30 days of pay stubs",
      "Last 2 years of federal tax returns",
      "If self-employed: profit & loss statement",
    ],
  },
  {
    category: "Asset documentation",
    items: [
      "Last 2–3 months of bank statements (all accounts)",
      "Investment/retirement account statements",
      "Gift letter if receiving down payment help",
    ],
  },
  {
    category: "Identity & credit",
    items: [
      "Government-issued photo ID",
      "Social Security number",
      "Pull your credit report (free at annualcreditreport.com)",
      "Explain any late payments or collections",
    ],
  },
  {
    category: "Liabilities",
    items: [
      "List of monthly debt obligations (car, student loans, etc.)",
      "Rental history / landlord contact",
    ],
  },
];

const lenders = [
  { name: "Better Mortgage", desc: "100% online, instant pre-approval", tag: "Fastest" },
  { name: "Rocket Mortgage", desc: "Large lender, great rates", tag: "Popular" },
  { name: "LoanDepot", desc: "Competitive rates for first-time buyers", tag: "First-time buyer" },
  { name: "Local Credit Union", desc: "Often lowest rates, personalized service", tag: "Best rates" },
];

function PreApprovalCard() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [openSection, setOpenSection] = useState<string | null>("Income documentation");

  const allItems = preApprovalChecklist.flatMap((c) => c.items);
  const progress = Math.round((checked.size / allItems.length) * 100);

  const toggle = (item: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Get Mortgage Pre-Approval</h3>
            <p className="text-sm text-slate-500">Check off what you have ready</p>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>{checked.size} of {allItems.length} items ready</span>
            <span className="font-semibold text-slate-700">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {preApprovalChecklist.map((section) => (
          <div key={section.category}>
            <button
              onClick={() => setOpenSection(openSection === section.category ? null : section.category)}
              className="w-full flex items-center justify-between px-6 py-3.5 text-left hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-semibold text-slate-800">{section.category}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  {section.items.filter((i) => checked.has(i)).length}/{section.items.length}
                </span>
                {openSection === section.category ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>
            {openSection === section.category && (
              <ul className="px-6 pb-4 space-y-2.5">
                {section.items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => toggle(item)}
                      className="flex items-start gap-3 text-left w-full group"
                    >
                      <div
                        className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                          checked.has(item)
                            ? "bg-blue-600 border-blue-600"
                            : "border-slate-300 group-hover:border-blue-400"
                        }`}
                      >
                        {checked.has(item) && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span
                        className={`text-sm leading-relaxed transition-colors ${
                          checked.has(item) ? "text-slate-400 line-through" : "text-slate-700"
                        }`}
                      >
                        {item}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Lender suggestions */}
      <div className="p-6 border-t border-slate-100 bg-slate-50">
        <p className="text-sm font-semibold text-slate-800 mb-3">Recommended lenders</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {lenders.map((lender) => (
            <div key={lender.name} className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{lender.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{lender.desc}</p>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                {lender.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────── */

export default function PrepareToBuyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 bg-slate-50 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-5 border border-blue-100">
            <span className="text-xs">STEP 2 OF 4</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Prepare to Buy
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto">
            Before writing your offer, connect with the listing agent, tour the home, and lock in your pre-approval. These three steps set you up to win.
          </p>
        </div>
      </section>

      {/* Progress steps */}
      <section className="border-b border-slate-100 bg-white sticky top-16 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-6 py-4 text-sm overflow-x-auto">
            {[
              { n: 1, label: "Contact agent", icon: Mail },
              { n: 2, label: "Schedule tour", icon: Calendar },
              { n: 3, label: "Get pre-approved", icon: FileText },
            ].map(({ n, label, icon: Icon }) => (
              <a
                key={n}
                href={`#step-${n}`}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {n}
                </div>
                <Icon className="w-3.5 h-3.5" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">

          {/* Tip banner */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Pro tip:</strong> Sellers favor buyers who are pre-approved and have already toured the home. Complete all three steps before making your offer to significantly increase your chances of acceptance.
            </p>
          </div>

          {/* Step 1 */}
          <div id="step-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</div>
              <h2 className="text-xl font-bold text-slate-900">Contact the Listing Agent</h2>
            </div>
            <ContactAgentCard />
          </div>

          {/* Step 2 */}
          <div id="step-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</div>
              <h2 className="text-xl font-bold text-slate-900">Schedule a Home Tour</h2>
            </div>
            <ScheduleViewingCard />
          </div>

          {/* Step 3 */}
          <div id="step-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</div>
              <h2 className="text-xl font-bold text-slate-900">Get Mortgage Pre-Approval</h2>
            </div>
            <PreApprovalCard />
          </div>

          {/* Next step CTA */}
          <div className="bg-slate-900 rounded-2xl p-8 text-center text-white">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Ready to write your offer?</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm">
              Once you&apos;ve toured the home and have your pre-approval letter, use our AI wizard to build a winning offer in minutes.
            </p>
            <Link
              href="/offer-builder"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all"
            >
              Build My Offer
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
