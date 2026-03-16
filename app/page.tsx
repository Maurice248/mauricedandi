import Image from "next/image";
import { getServerSession } from "next-auth";
import Link from "next/link";

import { authOptions } from "@/lib/auth";
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

function getDisplayName(name: string | null | undefined, email: string | null | undefined) {
  if (name?.trim()) return name.trim();
  if (email?.trim()) return email.trim().split("@")[0];
  return "Google user";
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const authError = getAuthErrorMessage(params.error);
  const session = await getServerSession(authOptions);
  const isLoggedIn = Boolean(session?.user);
  const displayName = getDisplayName(session?.user?.name, session?.user?.email);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-24 dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xl text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Google SSO is ready for this app.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {isLoggedIn
              ? `Signed in as ${session?.user?.email ?? "your Google account"}.`
              : "Sign in with Google to access protected routes and API-key management."}
          </p>
          {isLoggedIn ? (
            <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={`${displayName} profile picture`}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Welcome back</p>
                <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{displayName}</p>
              </div>
            </div>
          ) : null}
          {authError ? (
            <p className="max-w-md rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
              {authError}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          {isLoggedIn ? (
            <>
              <a
                className="flex h-12 w-full items-center justify-center rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[220px]"
                href="/dashboards"
              >
                Go to Dashboard
              </a>
              <Link
                className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[220px]"
                href="/api/auth/signout?callbackUrl=/"
              >
                Sign out
              </Link>
            </>
          ) : (
            <GoogleSignInButton />
          )}
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="/dashboards"
          >
            API Dashboard
          </a>
        </div>
      </main>
    </div>
  );
}
