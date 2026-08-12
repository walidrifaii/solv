import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex cursor-pointer items-center justify-center rounded px-4 py-2 text-sm font-medium disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
