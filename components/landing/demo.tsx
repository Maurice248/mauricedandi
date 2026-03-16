"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  GitPullRequest,
  Lightbulb,
  Loader2,
  Send,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";

const demoResponse = {
  summary:
    "GPT Researcher is an open-source deep research agent designed for comprehensive web and local research tasks. It generates detailed, factual, and unbiased reports with citations using a planner + execution architecture.",
  coolFacts: [
    "Supports both web and local document research, including PDF and Word.",
    "Can generate reports over 2,000 words from 20+ sources.",
    "Uses specialized agents for reliability and speed.",
  ],
  stats: {
    stars: 15420,
    forks: 1893,
  },
  latestRelease: "v3.1.2",
  prs: [
    { title: "Add multi-language support", number: 892, status: "merged" },
    { title: "Implement caching layer", number: 887, status: "open" },
    { title: "Fix memory leak in agent pool", number: 879, status: "merged" },
  ],
};

export function Demo() {
  const [url, setUrl] = useState("https://github.com/assafelovic/gpt-researcher");
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(true);
  const repoLabel = useMemo(() => {
    try {
      const parsed = new URL(url);
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (segments.length >= 2) {
        return `${segments[0]}/${segments[1]}`;
      }
      return "owner/repository";
    } catch {
      return "owner/repository";
    }
  }, [url]);

  const handleAnalyze = () => {
    setIsLoading(true);
    setShowResult(false);
    window.setTimeout(() => {
      setIsLoading(false);
      setShowResult(true);
    }, 1600);
  };

  return (
    <section id="demo" className="border-y border-border bg-card/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-accent">
            <Sparkles className="h-4 w-4" />
            Live Demo
          </span>
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            See it in action
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Test the repository analyzer experience directly from the landing page.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-2">
          <article className="h-full rounded-xl border border-border bg-card">
            <header className="border-b border-border bg-muted/30 px-5 py-4">
              <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Send className="h-4 w-4 text-accent" />
                Request
              </h3>
            </header>
            <div className="space-y-4 p-5">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Endpoint
                </p>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
                  <span className="rounded bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-500">
                    POST
                  </span>
                  <code className="text-sm text-foreground">/api/github-summarizer</code>
                </div>
              </div>

              <div>
                <label htmlFor="repo-url" className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  GitHub Repository URL
                </label>
                <input
                  id="repo-url"
                  type="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://github.com/owner/repository"
                  className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-accent"
                />
              </div>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading}
                className="inline-flex h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Repository
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </article>

          <article className="h-full rounded-xl border border-border bg-card">
            <header className="flex items-center justify-between border-b border-border bg-muted/30 px-5 py-4">
              <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Sparkles className="h-4 w-4 text-accent" />
                Response
              </h3>
              {showResult ? (
                <span className="rounded bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-500">
                  200 OK
                </span>
              ) : null}
            </header>

            <div className="p-5">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="mb-3 h-8 w-8 animate-spin text-accent" />
                  <p className="text-sm text-muted-foreground">Analyzing repository...</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <p className="font-semibold text-foreground">{repoLabel}</p>
                      <p className="text-xs text-muted-foreground">AI analysis complete</p>
                    </div>
                    <span className="rounded-full bg-accent/20 px-2 py-1 text-xs font-medium text-accent">
                      Ready
                    </span>
                  </div>

                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Sparkles className="h-4 w-4 text-accent" />
                      AI Summary
                    </h4>
                    <p className="text-sm leading-relaxed text-foreground">{demoResponse.summary}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <div className="mb-1 flex items-center justify-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-bold">{demoResponse.stats.stars.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Stars</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <div className="mb-1 flex items-center justify-center gap-1 text-accent">
                        <GitPullRequest className="h-4 w-4" />
                        <span className="font-bold">{demoResponse.stats.forks.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Forks</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <div className="mb-1 flex items-center justify-center gap-1 text-foreground">
                        <Tag className="h-4 w-4" />
                        <span className="font-bold">{demoResponse.latestRelease}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Latest</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      Cool Facts
                    </h4>
                    <ul className="space-y-2">
                      {demoResponse.coolFacts.map((fact, index) => (
                        <li key={fact} className="flex items-start gap-2 text-sm text-foreground">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-medium text-accent">
                            {index + 1}
                          </span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <GitPullRequest className="h-4 w-4 text-accent" />
                      Important Pull Requests
                    </h4>
                    <div className="space-y-2">
                      {demoResponse.prs.map((pr) => (
                        <div key={pr.number} className="flex items-center justify-between rounded-lg bg-muted/50 p-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">#{pr.number}</span>
                            <span className="text-foreground">{pr.title}</span>
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              pr.status === "merged"
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {pr.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
