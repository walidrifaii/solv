"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { BagIcon } from "@/components/icons/BagIcon";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { MenuIcon } from "@/components/icons/MenuIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { UserIcon } from "@/components/icons/UserIcon";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { images } from "@/constants/images";
import { ROUTES } from "@/constants/routes";
import { navigation } from "@/data/navigation";
import { useCart } from "@/features/cart/CartProvider";
import { useSearch } from "@/features/search/SearchProvider";
import { useGetMeQuery } from "@/store/slices";

type NavItem = (typeof navigation)[number];

function hasChildren(
  item: NavItem,
): item is NavItem & {
  children: readonly { key: string; href: string }[];
} {
  return "children" in item && Array.isArray(item.children);
}

export function Navbar() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { openSearch } = useSearch();
  const { data: client } = useGetMeQuery();
  const cartCount = itemCount;
  const accountHref = client ? ROUTES.account : ROUTES.login;
  const accountLabel = client ? t("profile") : t("signIn");

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
        setMobileShopOpen(false);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#17100a]/90 text-[#d1d1d1] backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-6 md:h-20 md:px-8 lg:grid lg:h-24 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-6 lg:px-10 xl:gap-8">
        <Link
          href={ROUTES.home}
          className="relative z-10 shrink-0 justify-self-start"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src={images.logo}
            alt={t("logoAlt")}
            className="h-11 w-auto object-contain sm:h-14 md:h-16 lg:h-[5.25rem] xl:h-24"
            priority
          />
        </Link>

        <nav className="hidden min-w-0 items-center justify-center gap-4 lg:flex xl:gap-6 2xl:gap-8">
          {navigation.map((item) =>
            hasChildren(item) ? (
              <div
                key={item.key}
                className="relative shrink-0"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-normal transition-colors hover:text-white xl:text-base"
                  aria-expanded={shopOpen}
                  aria-haspopup="true"
                  onClick={() => setShopOpen((open) => !open)}
                >
                  {t(item.key)}
                  <ChevronDownIcon
                    className={`size-3.5 shrink-0 transition-transform xl:size-4 ${shopOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {shopOpen ? (
                  <div className="absolute top-full left-1/2 z-20 min-w-48 -translate-x-1/2 pt-3">
                    <div className="rounded-md border border-white/10 bg-[#17100a]/95 py-2 shadow-xl backdrop-blur-md">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-[#d1d1d1] transition-colors hover:bg-white/5 hover:text-white"
                        >
                          {t(child.key)}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className="shrink-0 whitespace-nowrap text-sm font-normal transition-colors hover:text-white xl:text-base"
              >
                {t(item.key)}
              </Link>
            ),
          )}
        </nav>

        <div className="relative z-10 flex shrink-0 items-center justify-end gap-1 sm:gap-2 md:gap-3 lg:justify-self-end">
          <LanguageSwitcher className="hidden sm:block" />
          <button
            type="button"
            onClick={openSearch}
            className="inline-flex shrink-0 p-1.5 transition-colors hover:text-white"
            aria-label={t("search")}
          >
            <SearchIcon className="size-5 lg:size-6" />
          </button>
          <Link
            href={accountHref}
            className="hidden shrink-0 p-1.5 transition-colors hover:text-white md:inline-flex"
            aria-label={accountLabel}
            title={accountLabel}
          >
            <UserIcon className="size-5 lg:size-6" />
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative hidden shrink-0 p-1.5 transition-colors hover:text-white sm:inline-flex"
            aria-label={t("cart", { count: cartCount })}
          >
            <BagIcon className="size-5 lg:size-6" />
            <span className="absolute -top-0.5 -end-0.5 flex size-4 items-center justify-center rounded-full bg-[#c4a574] text-[10px] leading-none font-semibold text-white lg:size-5 lg:text-[11px]">
              {cartCount}
            </span>
          </button>

          <Link
            href={ROUTES.order}
            className="shrink-0 rounded-md bg-[#c4a574] px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white transition-colors hover:bg-[#d4b584] sm:px-4 sm:py-2 sm:text-sm md:px-5 md:text-base"
          >
            {t("orderNow")}
          </Link>

          <button
            type="button"
            className="inline-flex shrink-0 p-1.5 text-[#d1d1d1] transition-colors hover:text-white lg:hidden"
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <CloseIcon className="size-6" />
            ) : (
              <MenuIcon className="size-6" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/10 bg-[#17100a]/98 px-4 py-5 backdrop-blur-md sm:px-6 lg:hidden">
          <div className="mb-4 sm:hidden">
            <LanguageSwitcher />
          </div>
          <nav className="flex flex-col">
            {navigation.map((item) =>
              hasChildren(item) ? (
                <div key={item.key} className="border-b border-white/5">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-3.5 text-start text-base transition-colors hover:text-white"
                    aria-expanded={mobileShopOpen}
                    onClick={() => setMobileShopOpen((open) => !open)}
                  >
                    {t(item.key)}
                    <ChevronDownIcon
                      className={`size-4 shrink-0 transition-transform ${mobileShopOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileShopOpen
                    ? item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block py-2.5 ps-3 text-sm text-[#a3a3a3] transition-colors hover:text-white"
                          onClick={() => setMobileOpen(false)}
                        >
                          {t(child.key)}
                        </Link>
                      ))
                    : null}
                </div>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className="border-b border-white/5 py-3.5 text-base transition-colors hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(item.key)}
                </Link>
              ),
            )}
          </nav>

          <div className="mt-5 flex items-center gap-5 md:hidden">
            <Link
              href={accountHref}
              className="p-1"
              aria-label={accountLabel}
              onClick={() => setMobileOpen(false)}
            >
              <UserIcon className="size-5" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openCart();
              }}
              className="relative p-1 sm:hidden"
              aria-label={t("cart", { count: cartCount })}
            >
              <BagIcon className="size-5" />
              <span className="absolute -top-0.5 -end-0.5 flex size-4 items-center justify-center rounded-full bg-[#c4a574] text-[10px] leading-none font-semibold text-white">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
