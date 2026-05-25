import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Jennifer Martinez",
    location: "Chicago, IL",
    saved: "$14,500",
    rating: 5,
    photo: "JM",
    color: "bg-blue-500",
    quote:
      "I was terrified to buy a home without an agent but HomeOfferDirect held my hand through every single step. The AI explained each term so clearly. We closed in 45 days and saved over $14K!",
    home: "Purchased $485,000 home in Lincoln Park",
  },
  {
    name: "David & Sarah Kim",
    location: "Austin, TX",
    saved: "$18,200",
    rating: 5,
    photo: "DK",
    color: "bg-purple-500",
    quote:
      "As engineers, we wanted to understand everything we were signing. The plain-English explanations were incredible. The AI negotiation tips helped us get $12K off asking price!",
    home: "Purchased $607,000 home in South Austin",
  },
  {
    name: "Marcus Thompson",
    location: "Los Angeles, CA",
    saved: "$22,800",
    rating: 5,
    photo: "MT",
    color: "bg-emerald-500",
    quote:
      "Made three offers before finding our home. The dashboard made tracking everything so easy. On our third offer, the AI escalation clause builder is what got us the house in a bidding war.",
    home: "Purchased $760,000 home in Burbank",
  },
  {
    name: "Priya Patel",
    location: "New York, NY",
    saved: "$31,500",
    rating: 5,
    photo: "PP",
    color: "bg-orange-500",
    quote:
      "I'm a first-time buyer with zero real estate experience. HomeOfferDirect felt like having a knowledgeable friend guide me. The document generation is flawless and incredibly professional.",
    home: "Purchased $1.05M condo in Brooklyn",
  },
  {
    name: "Robert & Lisa Chen",
    location: "Miami, FL",
    saved: "$16,800",
    rating: 5,
    photo: "RC",
    color: "bg-sky-500",
    quote:
      "The listing agent was impressed by how professional our offer package looked. She told us it was better than most agent-submitted offers she receives. Closed in 30 days!",
    home: "Purchased $560,000 home in Coral Gables",
  },
  {
    name: "Amanda Johnson",
    location: "Dallas, TX",
    saved: "$9,300",
    rating: 5,
    photo: "AJ",
    color: "bg-pink-500",
    quote:
      "The AI suggestions for contingencies literally saved me from a nightmare — it flagged that I should include an inspection contingency when I almost waived it in a hot market. Worth every penny.",
    home: "Purchased $310,000 home in Plano",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full mb-4">
            Real Success Stories
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5">
            Buyers love{" "}
            <span className="gradient-text">HomeOfferDirect</span>
          </h2>
          <p className="text-xl text-slate-500">
            Join thousands of buyers who skipped the agent and kept their commissions.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="break-inside-avoid bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <Quote className="w-6 h-6 text-slate-200 mb-2" />
              <p className="text-slate-700 leading-relaxed text-sm mb-5">{t.quote}</p>

              {/* Property */}
              <div className="bg-slate-50 rounded-xl px-3 py-2 mb-4">
                <p className="text-xs text-slate-500">{t.home}</p>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                  >
                    {t.photo}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-green-600">{t.saved}</p>
                  <p className="text-xs text-slate-500">saved</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust stats */}
        <div className="mt-16 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "2,400+", label: "Offers submitted", sub: "and counting" },
              { value: "$28M+", label: "Total savings", sub: "in commissions" },
              { value: "4.9/5", label: "Average rating", sub: "from verified buyers" },
              { value: "5 States", label: "State coverage", sub: "expanding monthly" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl font-black text-slate-900 mb-1">{stat.value}</p>
                <p className="text-sm font-semibold text-slate-700">{stat.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
