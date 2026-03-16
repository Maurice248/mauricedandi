"use client";

import Link from "next/link";
import { Github, Menu, X } from "lucide-react";
import { useState } from "react";

type HeaderProps = {
  isLoggedIn: boolean;
};

export function Header({ isLoggedIn }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Github className="h-6 w-6 text-accent" />
          <span className="text-lg font-semibold text-foreground">Maurice</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="#demo" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Demo
          </Link>
          <Link href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </Link>
          <Link href="/playground" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Playground
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboards"
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Dashboard
              </Link>
              <Link
                href="/api/auth/signout?callbackUrl=/"
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Sign out
              </Link>
            </>
          ) : (
            <Link
              href="/api/auth/signin?callbackUrl=/dashboards"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Get started
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-muted md:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileMenuOpen ? (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm text-muted-foreground">
              Features
            </Link>
            <Link href="#demo" onClick={() => setMobileMenuOpen(false)} className="text-sm text-muted-foreground">
              Demo
            </Link>
            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm text-muted-foreground">
              Pricing
            </Link>
            <Link href="/playground" onClick={() => setMobileMenuOpen(false)} className="text-sm text-muted-foreground">
              Playground
            </Link>
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboards"
                    className="rounded-md bg-accent px-4 py-2 text-center text-sm font-medium text-accent-foreground"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/api/auth/signout?callbackUrl=/"
                    className="rounded-md px-4 py-2 text-center text-sm font-medium text-muted-foreground hover:bg-muted"
                  >
                    Sign out
                  </Link>
                </>
              ) : (
                <Link
                  href="/api/auth/signin?callbackUrl=/dashboards"
                  className="rounded-md bg-accent px-4 py-2 text-center text-sm font-medium text-accent-foreground"
                >
                  Get started
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
