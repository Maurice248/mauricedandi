import Link from "next/link";
import { ArrowRight, GitPullRequest, Star, Tag } from "lucide-react";

type HeroProps = {
  isLoggedIn: boolean;
};

export function Hero({ isLoggedIn }: HeroProps) {
  return (
    <section className="relative pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
            <span className="text-xs font-medium text-accent">New</span>
            <span className="text-xs text-muted-foreground">Now with secure Google SSO</span>
          </div>

          <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Get instant insights on any GitHub repository
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Analyze open source projects with AI-powered summaries, star trends, important PRs, and release updates from one dashboard.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {isLoggedIn ? (
              <Link
                href="/dashboards"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/api/auth/signin?callbackUrl=/dashboards"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Continue with Google
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <Link
              href="/playground"
              className="inline-flex items-center rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Watch demo
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-8 md:grid-cols-4 md:gap-16">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-foreground md:text-3xl">50K+</span>
              <span className="text-sm text-muted-foreground">Repos analyzed</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-foreground md:text-3xl">10K+</span>
              <span className="text-sm text-muted-foreground">Active users</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-foreground md:text-3xl">99.9%</span>
              <span className="text-sm text-muted-foreground">Uptime</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-foreground md:text-3xl">4.9/5</span>
              <span className="text-sm text-muted-foreground">User rating</span>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-xl border border-border bg-card p-4 shadow-2xl md:p-6">
          <div className="rounded-lg bg-secondary/60 p-4 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                <Star className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">vercel/next.js</p>
                <p className="text-sm text-muted-foreground">The React Framework for the Web</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">Stars</span>
                </div>
                <p className="text-2xl font-bold text-foreground">128.5K</p>
                <p className="text-xs text-accent">+2.3K this month</p>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <div className="mb-2 flex items-center gap-2">
                  <GitPullRequest className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">Latest PR</span>
                </div>
                <p className="truncate text-sm font-medium text-foreground">Fix: Improved caching</p>
                <p className="text-xs text-muted-foreground">Merged 2h ago</p>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">Latest Release</span>
                </div>
                <p className="text-sm font-medium text-foreground">v15.2.0</p>
                <p className="text-xs text-muted-foreground">Released 3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
