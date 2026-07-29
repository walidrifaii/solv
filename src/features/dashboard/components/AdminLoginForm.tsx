"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { ROUTES } from "@/constants/routes";
import { getApiErrorMessage } from "@/store/api/errors";
import { useAdminLoginMutation } from "@/store/slices";

const inputClass =
  "w-full rounded-xl border border-[#ddd0c4] bg-white px-4 py-3 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] transition-colors focus:border-[#a5a196]";

const labelClass =
  "mb-1.5 block text-[11px] font-medium tracking-[0.14em] text-[#8a7a6c] uppercase";

export function AdminLoginForm() {
  const router = useRouter();
  const [login, { isLoading }] = useAdminLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      await login({ email: email.trim(), password }).unwrap();
      router.replace(ROUTES.dashboard);
      router.refresh();
    } catch (err) {
      setError(getApiErrorMessage(err, "Invalid admin credentials."));
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-[#e8ddd2] bg-white px-6 py-8 shadow-[0_18px_50px_rgba(23,16,10,0.08)] sm:px-8">
      <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase">
        Admin access
      </p>
      <h1 className="font-serif text-3xl font-medium text-[#2a1f16]">
        Sign in to dashboard
      </h1>
      <p className="mt-2 text-sm text-[#7a6b5d]">
        Sign in with your admin email and password to manage the store.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label htmlFor="admin-email" className={labelClass}>
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            className={inputClass}
            placeholder="admin@solv.qa"
          />
        </div>

        <div>
          <label htmlFor="admin-password" className={labelClass}>
            Password
          </label>
          <PasswordInput
            id="admin-password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            className={inputClass}
            placeholder="Your password"
          />
        </div>

        {error ? (
          <p className="text-sm text-[#a35d5d]" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#a5a196] px-6 py-3 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#b5b1a6] disabled:opacity-60"
        >
          {isLoading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#7a6b5d]">
        <Link href={ROUTES.home} className="text-[#2a1f16] hover:text-[#a5a196]">
          Back to store
        </Link>
      </p>
    </div>
  );
}
