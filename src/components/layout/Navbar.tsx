"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
import { footerContact } from "@/data/footer";
import { useCart } from "@/features/cart/CartProvider";
import { useSearch } from "@/features/search/SearchProvider";
import { useGetMeQuery } from "@/store/slices";
import { cn } from "@/lib/utils";

type NavItem = (typeof navigation)[number];

function isShopPath(pathname: string) {
  return pathname === ROUTES.shop || pathname.startsWith(`${ROUTES.shop}/`);
}

function isNavItemActive(pathname: string, href: string) {
  if (href === ROUTES.home) return pathname === "/";
  if (href === ROUTES.shop) return isShopPath(pathname);
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isShopChildActive(
  pathname: string,
  searchParams: URLSearchParams,
  href: string,
) {
  if (!isShopPath(pathname)) return false;

  const childCategory = new URL(href, "http://localhost").searchParams.get(
    "category",
  );
  if (!childCategory) return false;

  return searchParams.get("category") === childCategory;
}

const desktopNavClass = (active: boolean) =>
  cn(
    "shrink-0 whitespace-nowrap text-sm font-normal transition-colors xl:text-base",
    active ? "text-[#C9A962]" : "hover:text-white",
  );

const mobileNavClass = (active: boolean) =>
  cn(
    "border-b border-[#17100a]/10 py-3.5 text-base transition-colors",
    active
      ? "font-medium text-[#C9A962]"
      : "text-[#17100a] hover:text-[#17100a]/80",
  );

const mobileShopChildClass = (active: boolean) =>
  cn(
    "block py-2.5 text-sm transition-colors",
    active
      ? "font-medium text-[#C9A962]"
      : "text-[#17100a]/75 hover:text-[#17100a]",
  );

function hasChildren(
  item: NavItem,
): item is NavItem & {
  children: readonly { key: string; href: string }[];
} {
  return "children" in item && Array.isArray(item.children);
}

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#a5a196]/90 text-[#d1d1d1] backdrop-blur-md">
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
                  className={cn(
                    "inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-normal transition-colors xl:text-base",
                    isNavItemActive(pathname, item.href)
                      ? "text-[#C9A962]"
                      : "hover:text-white",
                  )}
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
                    <div className="rounded-md border border-white/10 bg-[#a5a196]/95 py-2 shadow-xl backdrop-blur-md">
                      {item.children.map((child) => {
                        const childActive = isShopChildActive(
                          pathname,
                          searchParams,
                          child.href,
                        );

                        return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block px-4 py-2.5 text-sm transition-colors hover:bg-[#17100a]/5",
                            childActive
                              ? "font-medium text-[#C9A962]"
                              : "text-[#17100a]/75 hover:text-[#17100a]",
                          )}
                        >
                          {t(child.key)}
                        </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                className={desktopNavClass(isNavItemActive(pathname, item.href))}
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
            className="relative hidden shrink-0 cursor-pointer p-1.5 transition-colors hover:text-white sm:inline-flex"
            aria-label={t("cart", { count: cartCount })}
          >
            <BagIcon className="size-5 lg:size-6" />
            <span className="absolute -top-0.5 -end-0.5 flex size-4 items-center justify-center rounded-full bg-[#C9A962] text-[10px] leading-none font-semibold text-white lg:size-5 lg:text-[11px]">
              {cartCount}
            </span>
          </button>

          <a
            href={footerContact.phoneHref}
            className="shrink-0 cursor-pointer rounded-md bg-[#C9A962] px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white transition-colors hover:bg-[#D9BC82] sm:px-4 sm:py-2 sm:text-sm md:px-5 md:text-base"
          >
            {t("orderNow")}
          </a>

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
        <div className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-[#17100a]/10 bg-[#a5a196]/98 px-4 py-5 text-[#17100a] backdrop-blur-md sm:px-6 lg:hidden">
          <div className="mb-4 sm:hidden">
            <LanguageSwitcher />
          </div>
          <nav className="flex flex-col">
            {navigation.map((item) =>
              hasChildren(item) ? (
                <div key={item.key} className="border-b border-[#17100a]/10">
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between py-3.5 text-start text-base transition-colors",
                      isNavItemActive(pathname, item.href)
                        ? "font-medium text-[#C9A962]"
                        : "text-[#17100a] hover:text-[#17100a]/80",
                    )}
                    aria-expanded={mobileShopOpen}
                    onClick={() => setMobileShopOpen((open) => !open)}
                  >
                    {t(item.key)}
                    <ChevronDownIcon
                      className={`size-4 shrink-0 transition-transform ${mobileShopOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileShopOpen ? (
                    <div className="mb-2 ms-1 space-y-0.5 border-s border-[#17100a]/15 ps-3">
                      {item.children.map((child) => {
                        const childActive = isShopChildActive(
                          pathname,
                          searchParams,
                          child.href,
                        );

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={mobileShopChildClass(childActive)}
                            onClick={() => setMobileOpen(false)}
                          >
                            {t(child.key)}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className={mobileNavClass(isNavItemActive(pathname, item.href))}
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
              className="relative cursor-pointer p-1 sm:hidden"
              aria-label={t("cart", { count: cartCount })}
            >
              <BagIcon className="size-5" />
              <span className="absolute -top-0.5 -end-0.5 flex size-4 items-center justify-center rounded-full bg-[#C9A962] text-[10px] leading-none font-semibold text-white">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
