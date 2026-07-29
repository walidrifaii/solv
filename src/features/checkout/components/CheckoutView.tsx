"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ROUTES } from "@/constants/routes";
import { useCart } from "@/features/cart/CartProvider";
import {
  FREE_SHIPPING_FROM,
  getDeliveryFee,
} from "@/features/checkout/data";
import { productPath } from "@/features/products/utils";
import type { Locale } from "@/i18n/config";
import { pickLocalized } from "@/lib/localized";
import {
  formatQatarPhoneForBackend,
  isValidQatarLocalPhone,
  QATAR_PHONE_MAX_DIGITS,
  sanitizeLocalPhoneDigits,
  stripQatarCountryCode,
} from "@/lib/phone";
import { getApiErrorMessage } from "@/store/api/errors";
import { CheckoutAuthModal } from "@/features/checkout/components/CheckoutAuthModal";
import { useCreateOrderMutation, useGetCitiesQuery, useGetMeQuery } from "@/store/slices";

const inputClass =
  "w-full rounded-md border border-[#ddd0c4] bg-white px-4 py-3 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] transition-colors focus:border-[#a5a196] sm:text-base";

const selectClass = `${inputClass} cursor-pointer`;

const labelClass =
  "mb-1.5 block text-[11px] font-medium tracking-[0.14em] text-[#8a7a6c] uppercase";

export function CheckoutView() {
  const t = useTranslations("checkout");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { items, subtotal, currency, itemCount, clearCart, hydrated, closeCart } =
    useCart();
  const [createOrder, { isLoading: placing }] = useCreateOrderMutation();
  const { data: cities = [], isLoading: citiesLoading } = useGetCitiesQuery();
  const { data: client, isLoading: authLoading } = useGetMeQuery();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState(false);
  const [orderRef, setOrderRef] = useState("");

  useEffect(() => {
    if (city || cities.length === 0) return;
    setCity(cities[0].name);
  }, [cities, city]);

  useEffect(() => {
    if (!client) return;
    setName(client.name);
    setEmail(client.email);
    if (client.phone) setPhone(stripQatarCountryCode(client.phone));
  }, [client]);

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  const deliveryFee = useMemo(() => getDeliveryFee(subtotal), [subtotal]);
  const total = subtotal + deliveryFee;
  const loginNext = `${ROUTES.login}?next=${encodeURIComponent(ROUTES.checkout)}`;
  const registerNext = `${ROUTES.register}?next=${encodeURIComponent(ROUTES.checkout)}`;
  const isLoggedIn = Boolean(client);

  function handlePhoneChange(value: string) {
    setPhone(sanitizeLocalPhoneDigits(value));
  }

  function validateCheckoutForm() {
    if (!name.trim() || !email.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      setError(t("requiredFields"));
      return false;
    }

    if (!isValidQatarLocalPhone(phone)) {
      setError(t("invalidPhone"));
      return false;
    }

    if (items.length === 0) {
      setError(t("cartEmptyError"));
      return false;
    }

    return true;
  }

  async function placeOrder() {
    setError("");

    try {
      const order = (await createOrder({
        guestName: name.trim(),
        guestEmail: email.trim(),
        guestPhone: formatQatarPhoneForBackend(phone),
        deliveryCity: city.trim(),
        deliveryAddress: address.trim(),
        notes: notes.trim() || null,
        deliveryFee,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }).unwrap()) as { orderNumber?: string };

      setOrderRef(order.orderNumber ?? `SOLV-${Date.now().toString().slice(-8)}`);
      setPlaced(true);
      clearCart();
    } catch (err) {
      setError(getApiErrorMessage(err, t("placeError")));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!validateCheckoutForm()) return;

    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    await placeOrder();
  }

  function handleGuestCheckout() {
    setShowAuthModal(false);
    void placeOrder();
  }

  if (!hydrated) {
    return (
      <div className="bg-[#FEF9F6] px-4 py-24 text-center text-sm text-[#7a6b5d]">
        {t("loading")}
      </div>
    );
  }

  if (placed) {
    return (
      <section className="bg-[#FEF9F6] px-4 py-16 text-[#2a1f16] sm:px-6 sm:py-20 md:px-8 lg:px-10">
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
            {t("confirmed")}
          </p>
          <h1 className="font-serif text-4xl font-medium text-[#2a1f16] sm:text-5xl">
            {t("successTitle")}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#7a6b5d] sm:text-base">
            {t("successDescription")}
          </p>
          <p className="mt-6 font-serif text-xl text-[#a5a196]">
            {t("orderLabel", { ref: orderRef })}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={ROUTES.shop}
              className="inline-flex rounded-md bg-[#a5a196] px-6 py-3 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#b5b1a6]"
            >
              {t("continueShopping")}
            </Link>
            <Link
              href={ROUTES.home}
              className="inline-flex rounded-md border border-[#ddd0c4] px-6 py-3 text-sm font-medium text-[#2a1f16] transition-colors hover:border-[#a5a196]"
            >
              {t("backHome")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (itemCount === 0) {
    return (
      <section className="bg-[#FEF9F6] px-4 py-16 text-[#2a1f16] sm:px-6 sm:py-20 md:px-8 lg:px-10">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="font-serif text-4xl font-medium sm:text-5xl">
            {t("emptyTitle")}
          </h1>
          <p className="mt-4 text-sm text-[#7a6b5d] sm:text-base">
            {t("emptyDescription")}
          </p>
          <Link
            href={ROUTES.shop}
            className="mt-8 inline-flex rounded-md bg-[#a5a196] px-6 py-3 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#b5b1a6]"
          >
            {t("browseShop")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FEF9F6] text-[#2a1f16]">
      <CheckoutAuthModal
        open={showAuthModal}
        onGuest={handleGuestCheckout}
        onClose={() => setShowAuthModal(false)}
        loginHref={loginNext}
        registerHref={registerNext}
      />

      <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 md:px-8 lg:px-10 lg:py-14">
        <nav className="mb-8 text-sm text-[#8a7a6c]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={ROUTES.home} className="transition-colors hover:text-[#2a1f16]">
                {t("home")}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <button
                type="button"
                onClick={() => router.push(ROUTES.shop)}
                className="transition-colors hover:text-[#2a1f16]"
              >
                {t("shop")}
              </button>
            </li>
            <li aria-hidden>/</li>
            <li className="text-[#2a1f16]">{t("checkout")}</li>
          </ol>
        </nav>

        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
            {t("eyebrow")}
          </p>
          <h1 className="font-serif text-4xl leading-tight font-medium text-[#2a1f16] sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#7a6b5d] sm:mt-4 sm:text-base">
            {t("description")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 xl:gap-16"
          noValidate
        >
          <div className="space-y-10">
            {client ? (
              <div className="rounded-md border border-[#a5a196] bg-white px-4 py-4 sm:px-5">
                <p className="text-sm font-medium text-[#2a1f16]">
                  {t("authChoice.signedInAs", { name: client.name })}
                </p>
                <p className="mt-1 text-sm text-[#7a6b5d]">
                  {t("authChoice.signedInHint")}
                </p>
              </div>
            ) : null}

            <section>
              <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
                {t("contactSection")}
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-name" className={labelClass}>
                    {t("fields.name")}
                  </label>
                  <input
                    id="checkout-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder={t("placeholders.name")}
                    required
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-email" className={labelClass}>
                    {t("fields.email")}
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder={t("placeholders.email")}
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-phone" className={labelClass}>
                    {t("fields.phone")}
                  </label>
                  <div className="flex overflow-hidden rounded-md border border-[#ddd0c4] bg-white transition-colors focus-within:border-[#a5a196]">
                    <span className="flex shrink-0 items-center border-e border-[#ddd0c4] bg-[#F6EDE6] px-3 text-sm text-[#7a6b5d] sm:px-4 sm:text-base">
                      +974
                    </span>
                    <input
                      id="checkout-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      maxLength={QATAR_PHONE_MAX_DIGITS}
                      className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] sm:text-base"
                      placeholder={t("placeholders.phone")}
                      required
                      aria-describedby="checkout-phone-hint"
                    />
                  </div>
                  <p id="checkout-phone-hint" className="mt-1.5 text-xs text-[#8a7a6c]">
                    {t("phoneHint")}
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-[#e8ddd2] pt-10">
              <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
                {t("deliverySection")}
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="checkout-city" className={labelClass}>
                    {t("fields.city")}
                  </label>
                  <select
                    id="checkout-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={selectClass}
                    required
                    disabled={citiesLoading || cities.length === 0}
                    autoComplete="address-level2"
                  >
                    {cities.length === 0 ? (
                      <option value="">
                        {citiesLoading ? t("loadingCities") : t("noCities")}
                      </option>
                    ) : (
                      cities.map((option) => (
                        <option key={option.id} value={option.name}>
                          {pickLocalized(locale, option.name, option.nameAr)}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-address" className={labelClass}>
                    {t("fields.address")}
                  </label>
                  <input
                    id="checkout-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={inputClass}
                    placeholder={t("placeholders.address")}
                    required
                    autoComplete="street-address"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-notes" className={labelClass}>
                    {t("fields.notes")}
                  </label>
                  <textarea
                    id="checkout-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={`${inputClass} min-h-[5.5rem] resize-y`}
                    placeholder={t("placeholders.notes")}
                  />
                </div>
              </div>
            </section>

            <section className="border-t border-[#e8ddd2] pt-10">
              <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
                {t("paymentSection")}
              </h2>
              <p className="mt-2 text-sm text-[#7a6b5d]">
                {t("paymentNote")}
              </p>
              <div className="mt-5 rounded-md border border-[#a5a196] bg-white px-4 py-3.5">
                <p className="text-sm font-medium text-[#2a1f16]">
                  {t("payment.cod.label")}
                </p>
                <p className="mt-0.5 text-sm text-[#7a6b5d]">
                  {t("payment.cod.description")}
                </p>
              </div>
            </section>

            {error ? (
              <p className="text-sm text-[#a35d5d]" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={placing || authLoading}
              className="hidden w-full cursor-pointer rounded-md bg-[#a5a196] px-6 py-3.5 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#b5b1a6] disabled:cursor-not-allowed disabled:opacity-60 lg:inline-flex lg:w-auto lg:px-10 lg:text-base"
            >
              {placing
                ? t("summary.placing")
                : t("summary.placeOrderWithTotal", {
                    currency,
                    total: total.toFixed(2),
                  })}
            </button>
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-2xl border border-[#e8ddd2] bg-[#F6EDE6]">
              <div className="border-b border-[#e8ddd2] px-5 py-4 sm:px-6">
                <p className="text-[11px] font-medium tracking-[0.16em] text-[#b0895b] uppercase">
                  {t("summary.title")}
                </p>
                <p className="mt-1 font-serif text-xl font-medium text-[#2a1f16]">
                  {itemCount}{" "}
                  {itemCount === 1 ? t("item") : t("items")}
                </p>
              </div>

              <ul className="max-h-[22rem] space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-3">
                    <Link
                      href={productPath(item.slug)}
                      className="relative size-16 shrink-0 overflow-hidden rounded-md bg-[#E7DDD2]"
                    >
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={productPath(item.slug)}
                        className="block truncate text-sm font-semibold text-[#1a120c]"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-[#8a7a6c]">
                        {t("qty", { count: item.quantity })}
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#2a1f16]">
                        {item.currency}{" "}
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="space-y-2.5 border-t border-[#e8ddd2] px-5 py-5 sm:px-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#7a6b5d]">{t("summary.subtotal")}</span>
                  <span className="font-medium text-[#2a1f16]">
                    {currency} {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7a6b5d]">{t("summary.delivery")}</span>
                  <span className="font-medium text-[#2a1f16]">
                    {deliveryFee === 0
                      ? t("summary.freeDelivery")
                      : `${currency} ${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {deliveryFee > 0 ? (
                  <p className="text-xs text-[#8a7a6c]">
                    {t("freeFrom", {
                      currency,
                      amount: FREE_SHIPPING_FROM.toFixed(0),
                    })}
                  </p>
                ) : (
                  <p className="text-xs text-[#6f8f5a]">
                    {t("unlockedFree")}
                  </p>
                )}
                <div className="flex items-baseline justify-between border-t border-[#e8ddd2] pt-3">
                  <span className="text-sm font-medium text-[#2a1f16]">
                    {t("summary.total")}
                  </span>
                  <span className="font-serif text-2xl font-medium text-[#a5a196]">
                    {currency} {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#e8ddd2] px-5 py-5 sm:px-6">
                <button
                  type="submit"
                  disabled={placing || authLoading}
                  className="flex w-full cursor-pointer items-center justify-center rounded-md bg-[#a5a196] px-5 py-3.5 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#b5b1a6] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                >
                  {placing ? t("summary.placing") : t("summary.placeOrder")}
                </button>
                <p className="mt-3 text-center text-xs leading-relaxed text-[#8a7a6c]">
                  {t("agree")}
                </p>
                <Link
                  href={ROUTES.shop}
                  className="mt-4 block text-center text-sm text-[#7a6b5d] transition-colors hover:text-[#2a1f16]"
                >
                  {t("returnToShop")}
                </Link>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}
