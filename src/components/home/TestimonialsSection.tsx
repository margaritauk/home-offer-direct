import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Jennifer Martinez",
    location: "Chicago, IL",
    saved: "$14,500",
    photo: "JM",
    quote:
      "I was terrified to buy without an agent but HomeOfferDirect guided me through every step. The AI explained each term so clearly. We closed in 45 days and saved over $14K.",
    home: "$485,000 home in Lincoln Park",
  },
  {
    name: "David & Sarah Kim",
    location: "Austin, TX",
    saved: "$18,200",
    photo: "DK",
    quote:
      "As engineers, we wanted to understand every clause we signed. The plain-English explanations were incredible. The AI negotiation tips helped us get $12K off asking.",
    home: "$607,000 home in South Austin",
  },
  {
    name: "Marcus Thompson",
    location: "Los Angeles, CA",
    saved: "$22,800",
    photo: "MT",
    quote:
      "Made three offers before finding our home. The dashboard made tracking everything effortless. The AI escalation clause builder is what won us the home in a bidding war.",
    home: "$760,000 home in Burbank",
  },
  {
    name: "Priya Patel",
    location: "New York, NY",
    saved: "$31,500",
    photo: "PP",
    quote:
      "First-time buyer with zero real estate experience. HomeOfferDirect felt like a knowledgeable friend walking me through everything. The document quality is genuinely flawless.",
    home: "$1.05M condo in Brooklyn",
  },
  {
    name: "Robert & Lisa Chen",
    location: "Miami, FL",
    saved: "$16,800",
    photo: "RC",
    quote:
      "The listing agent told us our offer package was better than most agent-submitted offers she sees. That's a direct quote. We closed in 30 days.",
    home: "$560,000 home in Coral Gables",
  },
  {
    name: "Amanda Johnson",
    location: "Dallas, TX",
    saved: "$9,300",
    photo: "AJ",
    quote:
      "The AI flagged that I should keep my inspection contingency when I almost waived it in a hot market. That advice alone was worth far more than the $99 I paid.",
    home: "$310,000 home in Plano",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <p className="section-label">Real results</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-5">
            Buyers love{" "}
            <span className="gradient-text">HomeOfferDirect</span>
          </h2>
          <p className="text-lg text-slate-600">
            Thousands of buyers skipped the agent and kept their commission.
          </p>
        </div>

        {/* Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="break-inside-avoid bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-[15px] text-slate-700 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>

              {/* Property tag */}
              <div className="text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2 mb-5 inline-block">
                Purchased {t.home}
              </div>

              {/* Author + savings */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.photo}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-slate-900">{t.saved}</p>
                  <p className="text-xs text-slate-400">saved</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust row */}
        <div className="mt-20 bg-slate-50 rounded-2xl border border-slate-100 p-8 lg:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-200">
            {[
              { value: "2,400+", label: "Offers submitted" },
              { value: "$28M+",  label: "Commissions saved" },
              { value: "4.9/5",  label: "Average rating" },
              { value: "5",      label: "States covered" },
            ].map((s, i) => (
              <div key={s.label} className={i > 0 ? "pl-8" : ""}>
                <p className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-1">{s.value}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
