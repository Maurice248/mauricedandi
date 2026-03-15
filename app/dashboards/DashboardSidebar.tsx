"use client";

import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
  active?: boolean;
};

type DashboardSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const primaryItems: NavItem[] = [
  { label: "Overview", href: "/dashboards", active: true },
  { label: "API Playground", href: "/playground" },
  { label: "Use Cases", href: "#" },
  { label: "Billing", href: "#" },
];

const secondaryItems: NavItem[] = [
  { label: "Settings", href: "#" },
  { label: "Certification", href: "#" },
  { label: "Documentation", href: "#" },
];

function SidebarItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
        item.active
          ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          item.active ? "bg-emerald-500" : "bg-zinc-400 group-hover:bg-zinc-600 dark:bg-zinc-600 dark:group-hover:bg-zinc-300"
        }`}
      />
      <span>{item.label}</span>
    </Link>
  );
}

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto border-r border-zinc-200 bg-white p-4 shadow-xl transition-transform dark:border-zinc-800 dark:bg-zinc-950 lg:sticky lg:top-6 lg:z-auto lg:h-[calc(100vh-3rem)] lg:w-64 lg:rounded-2xl lg:border lg:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="mb-5 flex items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-xs font-semibold text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
            M
          </div>
          <p className="text-lg font-semibold tracking-tight">Maurice</p>
        </div>
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="rounded-lg p-1 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 lg:hidden"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
            <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="mb-5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
        Personal
      </div>

      <nav className="space-y-1">
        {primaryItems.map((item) => (
          <SidebarItem key={item.label} item={item} onNavigate={onClose} />
        ))}
      </nav>

      <div className="my-4 border-t border-zinc-200 dark:border-zinc-800" />

      <nav className="space-y-1">
        {secondaryItems.map((item) => (
          <SidebarItem key={item.label} item={item} onNavigate={onClose} />
        ))}
      </nav>
    </aside>
  );
}
