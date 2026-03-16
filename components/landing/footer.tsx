import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Github className="h-6 w-6 text-accent" />
              <span className="text-lg font-semibold text-foreground">Maurice</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Analyze open-source GitHub repositories with secure auth, AI summaries, and dashboard-based tools.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#demo" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">App</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboards" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/playground" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Playground
                </Link>
              </li>
              <li>
                <Link href="/protected" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Protected
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Account</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/api/auth/signin?callbackUrl=/dashboards" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/api/auth/signout?callbackUrl=/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Sign out
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Maurice. All rights reserved.
          </p>
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Home"
          >
            <Github className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
