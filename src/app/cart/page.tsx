"use client";

import { useEffect } from "react";
import { useCart } from "@/features/cart/CartProvider";

/** Opens the cart drawer when visiting /cart */
export default function CartPage() {
  const { openCart } = useCart();

  useEffect(() => {
    openCart();
  }, [openCart]);

  return (
    <main className="flex flex-1 flex-col bg-[#FEF9F6]">
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 items-center justify-center px-4 py-20 text-center">
        <p className="text-sm text-[#7a6b5d]">Opening your cart…</p>
      </div>
    </main>
  );
}
