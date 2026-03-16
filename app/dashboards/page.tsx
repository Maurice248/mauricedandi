"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import ApiKeysTable from "./ApiKeysTable";
import DashboardToast from "./DashboardToast";
import DashboardSidebar from "./DashboardSidebar";
import type { ApiKeyItem, ToastState } from "./types";
import { useApiKeys } from "./useApiKeys";

export default function DashboardPage() {
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [nameError, setNameError] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const { items, error, isLoading, isSubmitting, clearError, createKey, updateKey, removeKey } = useApiKeys();
  const canCreate = useMemo(() => newName.trim().length > 0, [newName]);
  const usageCredits = useMemo(
    () => items.reduce((total, item) => total + item.usage, 0),
    [items],
  );

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session", { method: "GET" });
        const session = (await response.json()) as { user?: { email?: string } };
        if (!isMounted) return;

        if (session?.user?.email) {
          setIsAuthorized(true);
          setIsAuthResolved(true);
          return;
        }

        window.location.href = "/api/auth/signin?callbackUrl=/dashboards";
      } catch {
        if (!isMounted) return;
        window.location.href = "/api/auth/signin?callbackUrl=/dashboards";
      }
    };

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (nextToast: ToastState) => {
    setToast(nextToast);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 2600);
  };

  const handleCreate = async () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setNameError("API key name is required.");
      return;
    }
    setNameError("");
    const created = await createKey(trimmed);
    if (created) {
      setNewName("");
      showToast({ tone: "success", message: "API Key created successfully" });
      return;
    }
    showToast({ tone: "error", message: "Failed to create API Key" });
  };

  const startEditing = (item: ApiKeyItem) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEditing = async (id: string) => {
    const trimmed = editingName.trim();
    if (!trimmed) {
      return;
    }
    const updated = await updateKey(id, trimmed);
    if (updated) {
      cancelEditing();
      showToast({ tone: "success", message: "API Key updated successfully" });
      return;
    }
    showToast({ tone: "error", message: "Failed to update API Key" });
  };

  const deleteItem = async (id: string) => {
    const deleted = await removeKey(id);
    if (deleted) {
      setVisibleKeys((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });

      if (editingId === id) {
        cancelEditing();
      }
      showToast({ tone: "error", message: "API Key deleted successfully" });
      return;
    }
    showToast({ tone: "error", message: "Failed to delete API Key" });
  };

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      showToast({ tone: "success", message: "Copied API Key to clipboard" });
    } catch {
      showToast({ tone: "error", message: "Failed to copy API Key" });
    }
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) return;
    if (window.matchMedia("(min-width: 1024px)").matches) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  if (!isAuthResolved || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-10 text-zinc-900 dark:bg-black dark:text-zinc-50">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Checking your session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <DashboardToast toast={toast} onClose={() => setToast(null)} />
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      ) : null}
      <main className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          <section className="flex-1">
            <div className="flex flex-col gap-8">
              <header className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    aria-label="Open sidebar"
                    onClick={() => setIsSidebarOpen(true)}
                    className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900 lg:hidden"
                  >
                    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
                      <path
                        d="M4 6H16M4 10H16M4 14H16"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight">API Key Dashboard</h1>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      Create, view, update, and delete API keys for your integrations.
                    </p>
                  </div>
                </div>
                <Link
                  href="/"
                  className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  Back Home
                </Link>
              </header>

              <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Current Plan
                    </p>
                    <h2 className="mt-1 text-3xl font-semibold tracking-tight">Researcher</h2>
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  >
                    Manage Plan
                  </button>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-zinc-600 dark:text-zinc-400">API Usage</p>
                    <p className="font-medium">
                      {usageCredits} / 1000 <span className="text-zinc-500 dark:text-zinc-400">Credits</span>
                    </p>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-zinc-900 transition-all dark:bg-zinc-100"
                      style={{ width: `${(usageCredits / 1000) * 100}%` }}
                    />
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                    Usage increases each time your API keys are used to call the API.
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                <h2 className="text-lg font-medium">Create API Key</h2>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="w-full">
                    <label htmlFor="keyName" className="mb-2 block text-sm font-medium">
                      Key Name
                    </label>
                    <input
                      id="keyName"
                      type="text"
                      value={newName}
                      onChange={(event) => {
                        setNewName(event.target.value);
                        if (nameError) setNameError("");
                        if (error) clearError();
                      }}
                      placeholder="e.g. Production payment service"
                      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm outline-none transition-colors focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
                    />
                    {nameError ? <p className="mt-2 text-sm text-red-600">{nameError}</p> : null}
                  </div>
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={!canCreate || isSubmitting}
                    className="mt-7 h-10 rounded-full bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    {isSubmitting ? "Saving..." : "Generate Key"}
                  </button>
                </div>
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                <h2 className="text-lg font-medium">Saved Keys</h2>
                {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
                {isLoading ? (
                  <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Loading API keys...</p>
                ) : items.length === 0 ? (
                  <p className="mt-4 rounded-xl border border-dashed border-zinc-300 px-4 py-6 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                    No API keys created yet. Add your first key above.
                  </p>
                ) : (
                  <ApiKeysTable
                    items={items}
                    editingId={editingId}
                    editingName={editingName}
                    isSubmitting={isSubmitting}
                    visibleKeys={visibleKeys}
                    onStartEditing={startEditing}
                    onCancelEditing={cancelEditing}
                    onSaveEditing={saveEditing}
                    onEditingNameChange={setEditingName}
                    onToggleVisibility={toggleVisibility}
                    onCopyKey={copyKey}
                    onDeleteItem={deleteItem}
                  />
                )}
              </section>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
