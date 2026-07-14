import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 ${className}`}
      {...props}
    />
  );
}
