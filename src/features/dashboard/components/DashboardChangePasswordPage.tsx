"use client";

import { useState, type FormEvent } from "react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { getApiErrorMessage } from "@/store/api/errors";
import {
  useAdminConfirmPasswordChangeMutation,
  useAdminRequestPasswordChangeMutation,
  useAdminResendPasswordChangeOtpMutation,
  useGetAdminMeQuery,
} from "@/store/slices";

const inputClass =
  "w-full rounded-xl border border-[#ddd0c4] bg-[#FEF9F6] px-3.5 py-2.5 text-sm text-[#a5a196] outline-none placeholder:text-[#a39486] focus:border-[#C9A962]";

const labelClass =
  "mb-1.5 block text-[11px] font-medium tracking-[0.14em] text-[#8a7a6c] uppercase";

type Step = "password" | "verify";

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${"•".repeat(Math.max(local.length - 2, 3))}@${domain}`;
}

export function DashboardChangePasswordPage() {
  const { data: admin } = useGetAdminMeQuery();
  const [requestChange, { isLoading: requesting }] =
    useAdminRequestPasswordChangeMutation();
  const [confirmChange, { isLoading: confirming }] =
    useAdminConfirmPasswordChangeMutation();
  const [resendOtp, { isLoading: resending }] =
    useAdminResendPasswordChangeOtpMutation();

  const [step, setStep] = useState<Step>("password");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRequestChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const result = await requestChange({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();
      setSentTo(result.email);
      setStep("verify");
      setInfo(result.message);
      setCode("");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not start password change."));
    }
  }

  async function handleConfirmChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");

    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    try {
      await confirmChange({ code: code.trim() }).unwrap();
      setSuccess(true);
      setStep("password");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setCode("");
      setInfo("Password updated successfully.");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not verify code."));
    }
  }

  async function handleResend() {
    setError("");
    setInfo("");
    try {
      const result = await resendOtp().unwrap();
      setInfo(result.message);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not resend code."));
    }
  }

  function handleStartOver() {
    setStep("password");
    setError("");
    setInfo("");
    setSuccess(false);
    setCode("");
  }

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div>
        <h2 className="font-serif text-2xl font-medium text-[#a5a196]">
          Change password
        </h2>
        <p className="mt-1 text-sm text-[#7a6b5d]">
          Two-step verification: enter your new password, then confirm with a
          code sent to your admin email on file.
        </p>
        {admin?.email ? (
          <p className="mt-2 text-sm text-[#a5a196]">
            Admin email (from database):{" "}
            <span className="font-medium">{admin.email}</span>
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-[#8a7a6c] uppercase">
        <span
          className={`rounded-full px-3 py-1 ${
            step === "password"
-white"
              : "bg-[#efe4da] text-[#7a6b5d]"
          }`}
        >
          1. New password
        </span>
        <span aria-hidden className="text-[#c4b5a8]">
          →
        </span>
        <span
          className={`rounded-full px-3 py-1 ${
            step === "verify"
-white"
              : "bg-[#efe4da] text-[#7a6b5d]"
          }`}
        >
          2. Verify code
        </span>
      </div>

      {step === "password" ? (
        <form
          onSubmit={handleRequestChange}
          className="space-y-4 rounded-2xl border border-[#e8ddd2] bg-white p-5 sm:p-6"
          noValidate
        >
          <div>
            <label htmlFor="admin-current-password" className={labelClass}>
              Current password
            </label>
            <PasswordInput
              id="admin-current-password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="admin-new-password" className={labelClass}>
              New password
            </label>
            <PasswordInput
              id="admin-new-password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              placeholder="At least 8 characters"
              required
            />
          </div>

          <div>
            <label htmlFor="admin-confirm-password" className={labelClass}>
              Confirm new password
            </label>
            <PasswordInput
              id="admin-confirm-password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          {error ? (
            <p className="text-sm text-[#a35d5d]" role="alert">
              {error}
            </p>
          ) : null}
          {info && !error ? (
            <p className="text-sm text-[#4f6b45]" role="status">
              {info}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={requesting}
-white transition-colors hover:bg-[#D9BC82] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {requesting ? "Sending code…" : "Continue to verification"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleConfirmChange}
          className="space-y-4 rounded-2xl border border-[#e8ddd2] bg-white p-5 sm:p-6"
          noValidate
        >
          <p className="text-sm leading-relaxed text-[#7a6b5d]">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-[#a5a196]">
              {maskEmail(sentTo || admin?.email || "")}
            </span>
            . Enter it below to save your new password.
          </p>

          <div>
            <label htmlFor="admin-password-code" className={labelClass}>
              Verification code
            </label>
            <input
              id="admin-password-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className={`${inputClass} text-center tracking-[0.35em]`}
              placeholder="000000"
              required
            />
          </div>

          {error ? (
            <p className="text-sm text-[#a35d5d]" role="alert">
              {error}
            </p>
          ) : null}
          {info && !error ? (
            <p className="text-sm text-[#4f6b45]" role="status">
              {info}
            </p>
          ) : null}
          {success ? (
            <p className="text-sm text-[#4f6b45]" role="status">
              Your password was updated.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={confirming}
-white transition-colors hover:bg-[#D9BC82] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {confirming ? "Verifying…" : "Confirm new password"}
          </button>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleStartOver}
              className="cursor-pointer text-sm text-[#7a6b5d] transition-colors hover:text-[#a5a196]"
            >
              Start over
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="cursor-pointer text-sm text-[#8a7a6c] transition-colors hover:text-[#a5a196] disabled:opacity-60"
            >
              {resending ? "Sending…" : "Resend code"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
