"use client";

import type { ReactNode } from "react";
import { Preloader } from "@/components/common/Preloader";
import { LocaleSwitchProvider } from "@/components/providers/LocaleSwitchProvider";
import { CartProvider } from "@/features/cart/CartProvider";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { SearchProvider } from "@/features/search/SearchProvider";
import { SearchDrawer } from "@/features/search/components/SearchDrawer";
import { StoreProvider } from "@/store/StoreProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <CartProvider>
        <SearchProvider>
          <LocaleSwitchProvider>
            <Preloader>
              {children}
              <SearchDrawer />
              <CartDrawer />
            </Preloader>
          </LocaleSwitchProvider>
        </SearchProvider>
      </CartProvider>
    </StoreProvider>
  );
}
