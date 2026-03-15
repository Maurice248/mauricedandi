import type { ReactNode } from "react";

type IconButtonProps = {
  label: string;
  children: ReactNode;
  danger?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({ label, children, className = "", danger = false, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        danger
          ? "border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
          : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
