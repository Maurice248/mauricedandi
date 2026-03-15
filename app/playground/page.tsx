"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function PlaygroundPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");

  const canSubmit = useMemo(() => apiKey.trim().length > 0, [apiKey]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    router.push(`/protected?apiKey=${encodeURIComponent(apiKey.trim())}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">API Playground</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Submit an API key to test protected route access.
            </p>
          </div>
          <Link
            href="/dashboards"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Back to Dashboard
          </Link>
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="apiKeyInput" className="mb-2 block text-sm font-medium">
                API Key
              </label>
              <input
                id="apiKeyInput"
                type="text"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="Paste API key here"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm outline-none transition-colors focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <button
              type="submit"
              disabled={!canSubmit}
              className="h-10 rounded-full bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Validate in /protected
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
