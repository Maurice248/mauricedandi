"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import DashboardToast from "../dashboards/DashboardToast";
import type { ToastState } from "../dashboards/types";

export default function ProtectedPage() {
  const searchParams = useSearchParams();
  const submittedKey = useMemo(() => searchParams.get("apiKey")?.trim() || "", [searchParams]);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function validateApiKey() {
      if (!submittedKey) {
        if (!isMounted) return;
        setIsChecking(false);
        setIsValid(false);
        setToast({ tone: "error", message: "Invalid API key" });
        return;
      }

      try {
        const response = await fetch("/api/validate-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey: submittedKey }),
        });
        const payload = (await response.json()) as { valid?: boolean };
        const valid = Boolean(payload.valid);

        if (!isMounted) return;
        setIsValid(valid);
        setToast(
          valid
            ? { tone: "success", message: "valid API key" }
            : { tone: "error", message: "Invalid API key" },
        );
      } catch {
        if (!isMounted) return;
        setIsValid(false);
        setToast({ tone: "error", message: "Invalid API key" });
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    }

    validateApiKey();

    return () => {
      isMounted = false;
    };
  }, [submittedKey]);

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <DashboardToast toast={toast} onClose={() => setToast(null)} />

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Protected</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Access is allowed only for valid API keys.
            </p>
          </div>
          <Link
            href="/playground"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Back to Playground
          </Link>
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          {isChecking ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Validating API key...</p>
          ) : isValid ? (
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Access granted. This API key is valid.
            </p>
          ) : (
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Access denied. The provided API key is invalid.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
