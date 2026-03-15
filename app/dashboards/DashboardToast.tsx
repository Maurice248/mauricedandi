import type { ToastState } from "./types";

type DashboardToastProps = {
  toast: ToastState | null;
  onClose: () => void;
};

export default function DashboardToast({ toast, onClose }: DashboardToastProps) {
  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto flex w-full max-w-md items-center justify-between rounded-md px-4 py-3 text-sm font-semibold text-white shadow-lg ${
          toast.tone === "success" ? "bg-emerald-600" : "bg-red-600"
        }`}
      >
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
            {toast.tone === "success" ? (
              <path
                d="M4.5 10.5L8.2 14.2L15.5 5.8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M10 5V11M10 14.2V14.3M3.8 16H16.2L10 4L3.8 16Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
          <span>{toast.message}</span>
        </div>
        <button
          type="button"
          aria-label="Close notification"
          onClick={onClose}
          className="rounded p-1 text-white/90 transition-colors hover:bg-white/15"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
