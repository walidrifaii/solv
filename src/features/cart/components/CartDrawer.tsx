"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { ROUTES } from "@/constants/routes";
import { useCart } from "@/features/cart/CartProvider";
import { productPath } from "@/features/products/data/catalog";

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    currency,
    isOpen,
    closeCart,
    removeItem,
    setQuantity,
  } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeCart();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  return (
    <div
      className={`fixed inset-0 z-[80] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-[#17100a]/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Close cart"
        onClick={closeCart}
      />

      <aside
        className={`absolute inset-y-0 right-0 flex h-full w-full max-w-md flex-col bg-[#FEF9F6] text-[#2a1f16] shadow-[-12px_0_40px_rgba(23,16,10,0.18)] transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <header className="flex items-center justify-between border-b border-[#e8ddd2] px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-[#b0895b] uppercase">
              Your Cart
            </p>
            <h2 className="font-serif text-2xl font-medium text-[#2a1f16]">
              {itemCount === 0
                ? "Empty"
                : `${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex size-10 items-center justify-center rounded-md text-[#2a1f16] transition-colors hover:bg-[#F6EDE6]"
            aria-label="Close cart"
          >
            <CloseIcon className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {items.length === 0 ? (
            <div className="flex h-full min-h-[16rem] flex-col items-center justify-center text-center">
              <p className="font-serif text-xl text-[#2a1f16]">Your cart is empty</p>
              <p className="mt-2 max-w-xs text-sm text-[#7a6b5d]">
                Add coffee, tea, or accessories from the shop to get started.
              </p>
              <Link
                href={ROUTES.shop}
                onClick={closeCart}
                className="mt-6 inline-flex rounded-md bg-[#c4a574] px-5 py-2.5 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584]"
              >
                Browse Shop
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-3 border-b border-[#e8ddd2] pb-5 last:border-b-0 last:pb-0"
                >
                  <Link
                    href={productPath(item.slug)}
                    onClick={closeCart}
                    className="relative size-20 shrink-0 overflow-hidden rounded-md bg-[#E7DDD2] sm:size-24"
                  >
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={productPath(item.slug)}
                        onClick={closeCart}
                        className="block min-w-0"
                      >
                        <h3 className="truncate text-sm font-semibold text-[#1a120c] sm:text-[15px]">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-[#c4a574]">
                          {item.currency} {item.price.toFixed(2)}
                        </p>
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="shrink-0 text-xs text-[#8a7a6c] transition-colors hover:text-[#a35d5d]"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-md border border-[#ddd0c4] bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(item.productId, item.quantity - 1)
                          }
                          className="px-2.5 py-1.5 text-base leading-none text-[#2a1f16] transition-colors hover:bg-[#F6EDE6]"
                          aria-label={`Decrease ${item.name}`}
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(item.productId, item.quantity + 1)
                          }
                          className="px-2.5 py-1.5 text-base leading-none text-[#2a1f16] transition-colors hover:bg-[#F6EDE6]"
                          aria-label={`Increase ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-[#2a1f16]">
                        {item.currency}{" "}
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <footer className="border-t border-[#e8ddd2] bg-[#FEF9F6] px-5 py-5 sm:px-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-sm text-[#7a6b5d]">Subtotal</span>
              <span className="font-serif text-xl font-medium text-[#2a1f16]">
                {currency} {subtotal.toFixed(2)}
              </span>
            </div>
            <Link
              href={ROUTES.checkout}
              onClick={closeCart}
              className="flex w-full items-center justify-center rounded-md bg-[#c4a574] px-5 py-3 text-sm font-medium text-[#17100a] transition-colors hover:bg-[#d4b584]"
            >
              Checkout
            </Link>
            <button
              type="button"
              onClick={closeCart}
              className="mt-3 w-full text-center text-sm text-[#7a6b5d] transition-colors hover:text-[#2a1f16]"
            >
              Continue shopping
            </button>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
