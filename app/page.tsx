import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Pricing } from "@/components/landing/pricing";
import { Demo } from "@/components/landing/demo";
import GoogleSignInButton from "./GoogleSignInButton";

type HomePageProps = {
  searchParams: Promise<{ error?: string }>;
};

function getAuthErrorMessage(error: string | undefined) {
  if (!error) return null;
  if (error === "google") {
    return "Google rejected the OAuth request. Check your Google OAuth redirect URI and test-user settings.";
  }
  return `Authentication failed (${error}). Please review your Google OAuth setup.`;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const authError = getAuthErrorMessage(params.error);
  const session = await getServerSession(authOptions);
  const isLoggedIn = Boolean(session?.user);

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={isLoggedIn} />
      <main>
        <Hero isLoggedIn={isLoggedIn} />

        <section className="mx-auto max-w-7xl px-6 pb-8">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              {isLoggedIn
                ? `Signed in as ${session?.user?.email ?? "your Google account"}.`
                : "Sign in with Google to access protected routes and API-key management."}
            </p>
            {!isLoggedIn ? (
              <div className="mt-4">
                <GoogleSignInButton />
              </div>
            ) : null}
            {authError ? (
              <p className="mt-4 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                {authError}
              </p>
            ) : null}
          </div>
        </section>

        <Features />
        <Demo />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
