import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    details: "For individuals exploring open source.",
    points: [
      "5 repository analyses per day",
      "Basic AI summaries",
      "Star count tracking",
      "Latest release info",
      "Community support",
    ],
    cta: "Start for free",
  },
  {
    name: "Researcher",
    price: "$12",
    period: "/month",
    details: "For developers who need more power.",
    points: [
      "Unlimited repository analyses",
      "Advanced AI summaries",
      "Full star analytics and trends",
      "Important PR tracking",
      "Version update alerts",
      "Priority support",
    ],
    cta: "Upgrade to Researcher",
    featured: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/user/month",
    details: "For teams tracking multiple projects.",
    points: [
      "Everything in Researcher",
      "Team collaboration",
      "Shared dashboards",
      "Custom integrations",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact sales",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
            <span className="text-xs font-medium text-accent">New</span>
            <span className="text-xs text-muted-foreground">Flexible plans for every stage</span>
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Plans and pricing
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Start immediately for free and upgrade as your analysis needs grow.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-xl border p-6 md:p-8 ${plan.featured ? "border-accent bg-card shadow-lg shadow-accent/10" : "border-border bg-card"}`}
            >
              {plan.featured ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1">
                  <span className="text-xs font-medium text-accent-foreground">Recommended</span>
                </div>
              ) : null}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.details}</p>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <Check className={`h-5 w-5 shrink-0 ${plan.featured ? "text-accent" : "text-muted-foreground"}`} />
                    <span className="text-sm text-foreground">{point}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`w-full rounded-md px-4 py-2 text-sm font-medium transition-colors ${plan.featured ? "bg-accent text-accent-foreground hover:bg-accent/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              >
                {plan.cta}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
