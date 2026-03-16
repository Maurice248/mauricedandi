import { GitPullRequest, Sparkles, Star, Tag, TrendingUp, Zap } from "lucide-react";

const items = [
  {
    icon: Sparkles,
    title: "AI-powered repository summaries",
    description: "Understand what a project does and how it is structured without reading every file first.",
  },
  {
    icon: Star,
    title: "Recent pull-request highlights",
    description: "See meaningful PR activity quickly, including merged work and momentum.",
  },
  {
    icon: Tag,
    title: "Release and version tracking",
    description: "Keep up with tags and release notes so upgrades are less risky.",
  },
  {
    icon: GitPullRequest,
    title: "Protected account workflows",
    description: "Google login secures access to your personal dashboard and key management pages.",
  },
  {
    icon: TrendingUp,
    title: "API-key dashboard",
    description: "Create, view, edit, and revoke your API keys from a single screen.",
  },
  {
    icon: Zap,
    title: "Supabase-backed persistence",
    description: "Store account and app data reliably with a managed PostgreSQL backend.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything you need to analyze repositories
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Powerful tools to help you understand any open-source project at a glance.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/50 hover:bg-card/80"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/20">
                <item.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
