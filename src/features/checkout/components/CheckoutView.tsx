"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ROUTES } from "@/constants/routes";
import { useCart } from "@/features/cart/CartProvider";
import {
  checkoutContent,
  FREE_SHIPPING_FROM,
  getDeliveryFee,
  paymentMethods,
  type PaymentMethodId,
} from "@/features/checkout/data";
import { productPath } from "@/features/products/utils";
import { getApiErrorMessage } from "@/store/api/errors";
import { useCreateOrderMutation } from "@/store/slices";

const inputClass =
  "w-full rounded-md border border-[#ddd0c4] bg-white px-4 py-3 text-sm text-[#2a1f16] outline-none placeholder:text-[#a39486] transition-colors focus:border-[#c4a574] sm:text-base";

const labelClass =
  "mb-1.5 block text-[11px] font-medium tracking-[0.14em] text-[#8a7a6c] uppercase";

export function CheckoutView() {
  const router = useRouter();
  const { items, subtotal, currency, itemCount, clearCart, hydrated, closeCart } =
    useCart();
  const [createOrder, { isLoading: placing }] = useCreateOrderMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Doha");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<PaymentMethodId>("cod");
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState(false);
  const [orderRef, setOrderRef] = useState("");

  useEffect(() => {
    closeCart();
  }, [closeCart]);

  const deliveryFee = useMemo(() => getDeliveryFee(subtotal), [subtotal]);
  const total = subtotal + deliveryFee;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      const order = (await createOrder({
        guestName: name.trim(),
        guestEmail: email.trim(),
        guestPhone: phone.trim(),
        deliveryCity: city.trim() || "Doha",
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
      setError(getApiErrorMessage(err, "Could not place order. Try again."));
    }
  }

  if (!hydrated) {
    return (
      <div className="bg-[#FEF9F6] px-4 py-24 text-center text-sm text-[#7a6b5d]">
        Loading checkout…
      </div>
    );
  }

  if (placed) {
    return (
      <section className="bg-[#FEF9F6] px-4 py-16 text-[#2a1f16] sm:px-6 sm:py-20 md:px-8 lg:px-10">
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
            Confirmed
          </p>
          <h1 className="font-serif text-4xl font-medium text-[#2a1f16] sm:text-5xl">
            {checkoutContent.successTitle}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#7a6b5d] sm:text-base">
            {checkoutContent.successDescription}
          </p>
          <p className="mt-6 font-serif text-xl text-[#c4a574]">
            Order {orderRef}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={ROUTES.shop}
              className="inline-flex rounded-md bg-[#c4a574] px-6 py-3 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584]"
            >
              Continue shopping
            </Link>
            <Link
              href={ROUTES.home}
              className="inline-flex rounded-md border border-[#ddd0c4] px-6 py-3 text-sm font-medium text-[#2a1f16] transition-colors hover:border-[#c4a574]"
            >
              Back home
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
            {checkoutContent.emptyTitle}
          </h1>
          <p className="mt-4 text-sm text-[#7a6b5d] sm:text-base">
            {checkoutContent.emptyDescription}
          </p>
          <Link
            href={ROUTES.shop}
            className="mt-8 inline-flex rounded-md bg-[#c4a574] px-6 py-3 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584]"
          >
            Browse Shop
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FEF9F6] text-[#2a1f16]">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 md:px-8 lg:px-10 lg:py-14">
        <nav className="mb-8 text-sm text-[#8a7a6c]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={ROUTES.home} className="transition-colors hover:text-[#2a1f16]">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <button
                type="button"
                onClick={() => router.push(ROUTES.shop)}
                className="transition-colors hover:text-[#2a1f16]"
              >
                Shop
              </button>
            </li>
            <li aria-hidden>/</li>
            <li className="text-[#2a1f16]">Checkout</li>
          </ol>
        </nav>

        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#b0895b] uppercase sm:text-xs">
            {checkoutContent.eyebrow}
          </p>
          <h1 className="font-serif text-4xl leading-tight font-medium text-[#2a1f16] sm:text-5xl">
            {checkoutContent.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#7a6b5d] sm:mt-4 sm:text-base">
            {checkoutContent.description}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 xl:gap-16"
          noValidate
        >
          <div className="space-y-10">
            <section>
              <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
                Contact
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-name" className={labelClass}>
                    Full name *
                  </label>
                  <input
                    id="checkout-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    placeholder="Your name"
                    required
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-email" className={labelClass}>
                    Email *
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@email.com"
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-phone" className={labelClass}>
                    Phone *
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="+974 …"
                    required
                    autoComplete="tel"
                  />
                </div>
              </div>
            </section>

            <section className="border-t border-[#e8ddd2] pt-10">
              <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
                Delivery
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="checkout-city" className={labelClass}>
                    City *
                  </label>
                  <input
                    id="checkout-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={inputClass}
                    placeholder="Doha"
                    required
                    autoComplete="address-level2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-address" className={labelClass}>
                    Address *
                  </label>
                  <input
                    id="checkout-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={inputClass}
                    placeholder="Building, street, zone"
                    required
                    autoComplete="street-address"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-notes" className={labelClass}>
                    Order notes
                  </label>
                  <textarea
                    id="checkout-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={`${inputClass} min-h-[5.5rem] resize-y`}
                    placeholder="Delivery timing, landmark, special requests…"
                  />
                </div>
              </div>
            </section>

            <section className="border-t border-[#e8ddd2] pt-10">
              <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
                Payment
              </h2>
              <p className="mt-2 text-sm text-[#7a6b5d]">
                Choose how you'd like to pay. Online card checkout can be added later.
              </p>
              <fieldset className="mt-5 space-y-3">
                <legend className="sr-only">Payment method</legend>
                {paymentMethods.map((method) => {
                  const selected = payment === method.id;
                  return (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3.5 transition-colors ${
                        selected
                          ? "border-[#c4a574] bg-white"
                          : "border-[#e8ddd2] bg-transparent hover:border-[#ddd0c4]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selected}
                        onChange={() => setPayment(method.id)}
                        className="mt-1 size-4 accent-[#c4a574]"
                      />
                      <span>
                        <span className="block text-sm font-medium text-[#2a1f16]">
                          {method.label}
                        </span>
                        <span className="mt-0.5 block text-sm text-[#7a6b5d]">
                          {method.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </fieldset>
            </section>

            {error ? (
              <p className="text-sm text-[#a35d5d]" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={placing}
              className="hidden w-full rounded-md bg-[#c4a574] px-6 py-3.5 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584] disabled:opacity-60 lg:inline-flex lg:w-auto lg:px-10 lg:text-base"
            >
              {placing
                ? "Placing order…"
                : `Place order · ${currency} ${total.toFixed(2)}`}
            </button>
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-2xl border border-[#e8ddd2] bg-[#F6EDE6]">
              <div className="border-b border-[#e8ddd2] px-5 py-4 sm:px-6">
                <p className="text-[11px] font-medium tracking-[0.16em] text-[#b0895b] uppercase">
                  Order summary
                </p>
                <p className="mt-1 font-serif text-xl font-medium text-[#2a1f16]">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
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
                        Qty {item.quantity}
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
                  <span className="text-[#7a6b5d]">Subtotal</span>
                  <span className="font-medium text-[#2a1f16]">
                    {currency} {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7a6b5d]">Delivery</span>
                  <span className="font-medium text-[#2a1f16]">
                    {deliveryFee === 0
                      ? "Free"
                      : `${currency} ${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {deliveryFee > 0 ? (
                  <p className="text-xs text-[#8a7a6c]">
                    Free delivery from {currency} {FREE_SHIPPING_FROM.toFixed(0)}
                  </p>
                ) : (
                  <p className="text-xs text-[#6f8f5a]">
                  You've unlocked free delivery
                </p>
                )}
                <div className="flex items-baseline justify-between border-t border-[#e8ddd2] pt-3">
                  <span className="text-sm font-medium text-[#2a1f16]">Total</span>
                  <span className="font-serif text-2xl font-medium text-[#c4a574]">
                    {currency} {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#e8ddd2] px-5 py-5 sm:px-6">
                <button
                  type="submit"
                  disabled={placing}
                  className="flex w-full items-center justify-center rounded-md bg-[#c4a574] px-5 py-3.5 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584] disabled:opacity-60 sm:text-base"
                >
                  {placing ? "Placing order…" : "Place order"}
                </button>
                <p className="mt-3 text-center text-xs leading-relaxed text-[#8a7a6c]">
                  By placing your order you agree to be contacted for confirmation.
                </p>
                <Link
                  href={ROUTES.shop}
                  className="mt-4 block text-center text-sm text-[#7a6b5d] transition-colors hover:text-[#2a1f16]"
                >
                  Return to shop
                </Link>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}
