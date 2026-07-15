"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ROUTES } from "@/constants/routes";
import { statusLabel, statusTone } from "@/features/dashboard/data";
import { getApiErrorMessage } from "@/store/api/errors";
import {
  useChangePasswordMutation,
  useConfirmEmailChangeMutation,
  useGetMeQuery,
  useGetMyOrdersQuery,
  useLogoutMutation,
  useRequestEmailChangeMutation,
  useUpdateProfileMutation,
} from "@/store/slices";

const inputClass =
  "w-full rounded-md border border-[#ddd0c4] bg-white px-4 py-2.5 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] transition-colors focus:border-[#c4a574]";

const labelClass =
  "mb-1.5 block text-[11px] font-medium tracking-[0.14em] text-[#8a7a6c] uppercase";

type AccountTab = "settings" | "orders";

function parseTab(raw: string | null): AccountTab {
  return raw === "orders" ? "orders" : "settings";
}

export function AccountView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = parseTab(searchParams.get("tab"));

  const { data: client, isLoading, isError } = useGetMeQuery();
  const { data: orders = [], isLoading: ordersLoading } = useGetMyOrdersQuery(
    { limit: 20 },
    { skip: !client },
  );
  const [logout, { isLoading: loggingOut }] = useLogoutMutation();
  const [updateProfile, { isLoading: savingName }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: savingPassword }] =
    useChangePasswordMutation();
  const [requestEmailChange, { isLoading: requestingEmail }] =
    useRequestEmailChangeMutation();
  const [confirmEmailChange, { isLoading: confirmingEmail }] =
    useConfirmEmailChangeMutation();

  const [name, setName] = useState("");
  const [nameMsg, setNameMsg] = useState("");
  const [nameErr, setNameErr] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [emailErr, setEmailErr] = useState("");

  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (client?.name) setName(client.name);
  }, [client?.name]);

  function setTab(next: AccountTab) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "settings") params.delete("tab");
    else params.set("tab", next);
    const query = params.toString();
    router.replace(query ? `${ROUTES.account}?${query}` : ROUTES.account, {
      scroll: false,
    });
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#FEF9F6] px-4 py-24 text-[#7a6b5d]">
        Loading account…
      </div>
    );
  }

  if (isError || !client) {
    router.replace(ROUTES.login);
    return (
      <div className="flex flex-1 items-center justify-center bg-[#FEF9F6] px-4 py-24 text-[#7a6b5d]">
        Redirecting to login…
      </div>
    );
  }

  async function handleLogout() {
    await logout();
    router.push(ROUTES.login);
    router.refresh();
  }

  async function handleSaveName(event: FormEvent) {
    event.preventDefault();
    setNameErr("");
    setNameMsg("");
    try {
      await updateProfile({ name: name.trim() }).unwrap();
      setNameMsg("Name updated.");
    } catch (err) {
      setNameErr(getApiErrorMessage(err, "Could not update name."));
    }
  }

  async function handleSavePassword(event: FormEvent) {
    event.preventDefault();
    setPasswordErr("");
    setPasswordMsg("");
    if (newPassword.length < 8) {
      setPasswordErr("New password must be at least 8 characters.");
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      setCurrentPassword("");
      setNewPassword("");
      setPasswordMsg("Password updated.");
    } catch (err) {
      setPasswordErr(getApiErrorMessage(err, "Could not update password."));
    }
  }

  async function handleRequestEmail(event: FormEvent) {
    event.preventDefault();
    setEmailErr("");
    setEmailMsg("");
    try {
      const result = await requestEmailChange({
        email: newEmail.trim(),
      }).unwrap();
      setPendingEmail(result.pendingEmail);
      setEmailMsg(result.message);
    } catch (err) {
      setEmailErr(getApiErrorMessage(err, "Could not start email change."));
    }
  }

  async function handleConfirmEmail(event: FormEvent) {
    event.preventDefault();
    setEmailErr("");
    setEmailMsg("");
    try {
      await confirmEmailChange({
        email: pendingEmail || newEmail.trim(),
        code: emailCode.trim(),
      }).unwrap();
      setNewEmail("");
      setEmailCode("");
      setPendingEmail("");
      setEmailMsg("Email updated.");
    } catch (err) {
      setEmailErr(getApiErrorMessage(err, "Could not confirm email."));
    }
  }

  const crumbCurrent = tab === "orders" ? "Order history" : "Settings";

  return (
    <main className="flex flex-1 flex-col bg-[#FEF9F6] text-[#2a1f16]">
      <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14 md:px-8">
        <nav className="mb-6 text-sm text-[#8a7a6c]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href={ROUTES.home}
                className="transition-colors hover:text-[#2a1f16]"
              >
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={ROUTES.account}
                className="transition-colors hover:text-[#2a1f16]"
              >
                Profile
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-[#2a1f16]">{crumbCurrent}</li>
          </ol>
        </nav>

        <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase">
          Account
        </p>
        <h1 className="font-serif text-3xl font-medium sm:text-4xl">
          Hello, {client.name}
        </h1>
        <p className="mt-2 text-sm text-[#7a6b5d]">{client.email}</p>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-6 rounded-md border border-[#ddd0c4] px-4 py-2 text-sm text-[#2a1f16] transition-colors hover:border-[#c4a574] disabled:opacity-60"
        >
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>

        <div
          className="mt-10 flex gap-1 border-b border-[#efe4da]"
          role="tablist"
          aria-label="Account sections"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "settings"}
            onClick={() => setTab("settings")}
            className={`-mb-px border-b-2 px-4 py-3 text-sm transition-colors ${
              tab === "settings"
                ? "border-[#c4a574] text-[#2a1f16]"
                : "border-transparent text-[#8a7a6c] hover:text-[#2a1f16]"
            }`}
          >
            Settings
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "orders"}
            onClick={() => setTab("orders")}
            className={`-mb-px border-b-2 px-4 py-3 text-sm transition-colors ${
              tab === "orders"
                ? "border-[#c4a574] text-[#2a1f16]"
                : "border-transparent text-[#8a7a6c] hover:text-[#2a1f16]"
            }`}
          >
            Order history
            {orders.length > 0 ? (
              <span className="ml-2 text-[#b0895b]">({orders.length})</span>
            ) : null}
          </button>
        </div>

        {tab === "settings" ? (
          <div className="mt-8 space-y-6" role="tabpanel">
            <form
              onSubmit={handleSaveName}
              className="rounded-xl border border-[#efe4da] bg-white p-5"
            >
              <h2 className="text-sm font-medium text-[#2a1f16]">
                Display name
              </h2>
              <div className="mt-4">
                <label htmlFor="account-name" className={labelClass}>
                  Name
                </label>
                <input
                  id="account-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              {nameErr ? (
                <p className="mt-2 text-sm text-[#a35d5d]">{nameErr}</p>
              ) : null}
              {nameMsg ? (
                <p className="mt-2 text-sm text-[#4f6b45]">{nameMsg}</p>
              ) : null}
              <button
                type="submit"
                disabled={savingName}
                className="mt-4 rounded-md bg-[#c4a574] px-4 py-2 text-sm font-medium text-[#17100a] disabled:opacity-60"
              >
                {savingName ? "Saving…" : "Save name"}
              </button>
            </form>

            <form
              onSubmit={handleSavePassword}
              className="rounded-xl border border-[#efe4da] bg-white p-5"
            >
              <h2 className="text-sm font-medium text-[#2a1f16]">Password</h2>
              <div className="mt-4 space-y-3">
                <div>
                  <label htmlFor="current-password" className={labelClass}>
                    Current password
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="new-password" className={labelClass}>
                    New password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass}
                    placeholder="At least 8 characters"
                  />
                </div>
              </div>
              {passwordErr ? (
                <p className="mt-2 text-sm text-[#a35d5d]">{passwordErr}</p>
              ) : null}
              {passwordMsg ? (
                <p className="mt-2 text-sm text-[#4f6b45]">{passwordMsg}</p>
              ) : null}
              <button
                type="submit"
                disabled={savingPassword}
                className="mt-4 rounded-md bg-[#c4a574] px-4 py-2 text-sm font-medium text-[#17100a] disabled:opacity-60"
              >
                {savingPassword ? "Updating…" : "Update password"}
              </button>
            </form>

            <div className="rounded-xl border border-[#efe4da] bg-white p-5">
              <h2 className="text-sm font-medium text-[#2a1f16]">Email</h2>
              <p className="mt-1 text-sm text-[#7a6b5d]">
                Current: {client.email}
              </p>
              <form onSubmit={handleRequestEmail} className="mt-4 space-y-3">
                <div>
                  <label htmlFor="new-email" className={labelClass}>
                    New email
                  </label>
                  <input
                    id="new-email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className={inputClass}
                    placeholder="new@email.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={requestingEmail}
                  className="rounded-md border border-[#ddd0c4] px-4 py-2 text-sm disabled:opacity-60"
                >
                  {requestingEmail ? "Sending code…" : "Send code to new email"}
                </button>
              </form>

              {pendingEmail ? (
                <form onSubmit={handleConfirmEmail} className="mt-4 space-y-3">
                  <p className="text-sm text-[#7a6b5d]">
                    Enter the code sent to {pendingEmail}
                  </p>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={emailCode}
                    onChange={(e) =>
                      setEmailCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className={inputClass}
                    placeholder="6-digit code"
                  />
                  <button
                    type="submit"
                    disabled={confirmingEmail}
                    className="rounded-md bg-[#c4a574] px-4 py-2 text-sm font-medium text-[#17100a] disabled:opacity-60"
                  >
                    {confirmingEmail ? "Confirming…" : "Confirm email"}
                  </button>
                </form>
              ) : null}

              {emailErr ? (
                <p className="mt-2 text-sm text-[#a35d5d]">{emailErr}</p>
              ) : null}
              {emailMsg ? (
                <p className="mt-2 text-sm text-[#4f6b45]">{emailMsg}</p>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="mt-8" role="tabpanel">
            {ordersLoading ? (
              <p className="text-sm text-[#7a6b5d]">Loading orders…</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-[#7a6b5d]">
                No orders yet.{" "}
                <Link href={ROUTES.shop} className="text-[#c4a574] underline">
                  Browse the shop
                </Link>
              </p>
            ) : (
              <ul className="space-y-3">
                {orders.map((order) => {
                  const open = openOrderId === order.id;
                  return (
                    <li
                      key={order.id}
                      className="rounded-xl border border-[#efe4da] bg-white px-4 py-4"
                    >
                      <button
                        type="button"
                        className="flex w-full flex-wrap items-center justify-between gap-2 text-left"
                        onClick={() =>
                          setOpenOrderId(open ? null : order.id)
                        }
                      >
                        <div>
                          <p className="font-medium text-[#2a1f16]">
                            {order.orderNumber}
                          </p>
                          <p className="mt-1 text-sm text-[#7a6b5d]">
                            {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                            {order.itemCount} item
                            {order.itemCount === 1 ? "" : "s"} · QAR{" "}
                            {(order.total ?? 0).toFixed(2)}
                          </p>
                        </div>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusTone(order.status)}`}
                        >
                          {statusLabel(order.status)}
                        </span>
                      </button>

                      {open ? (
                        <div className="mt-4 border-t border-[#efe4da] pt-4">
                          {(order.items ?? []).length > 0 ? (
                            <ul className="space-y-2">
                              {(order.items ?? []).map((item) => (
                                <li
                                  key={item.id}
                                  className="flex justify-between gap-3 text-sm text-[#5c5046]"
                                >
                                  <span>
                                    {item.productName} × {item.quantity}
                                  </span>
                                  <span>
                                    QAR {(item.total ?? 0).toFixed(2)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                          {(order.deliveryAddress || order.deliveryCity) && (
                            <p className="mt-3 text-sm text-[#7a6b5d]">
                              Delivery: {order.deliveryAddress}
                              {order.deliveryCity
                                ? `, ${order.deliveryCity}`
                                : ""}
                            </p>
                          )}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
