"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { BagIcon } from "@/components/icons/BagIcon";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { GlobeIcon } from "@/components/icons/GlobeIcon";
import { MenuIcon } from "@/components/icons/MenuIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { UserIcon } from "@/components/icons/UserIcon";
import { useLocaleSwitch } from "@/components/providers/LocaleSwitchProvider";
import { images } from "@/constants/images";
import { ROUTES } from "@/constants/routes";
import { navigation } from "@/data/navigation";
import { useCart } from "@/features/cart/CartProvider";
import { useSearch } from "@/features/search/SearchProvider";
import { locales, type Locale } from "@/i18n/config";
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

function hasChildren(
  item: NavItem,
): item is NavItem & {
  children: readonly { key: string; href: string }[];
} {
  return "children" in item && Array.isArray(item.children);
}

const iconBtnClass =
  "inline-flex size-10 items-center justify-center rounded-full text-black transition-colors hover:bg-black/5 hover:text-black/70";

const menuLinkClass = (active: boolean) =>
  cn(
    "block border-b border-black/10 py-3.5 text-base transition-colors",
    active
      ? "font-extrabold text-[#C9A962]"
      : "font-normal text-black hover:text-black/70",
  );

const shopChildClass = (active: boolean) =>
  cn(
    "block py-2.5 text-sm transition-colors",
    active
      ? "font-extrabold text-[#C9A962]"
      : "font-normal text-black/75 hover:text-black",
  );

function NavbarLanguageButton() {
  const locale = useLocale() as Locale;
  const t = useTranslations("locale");
  const { switching, switchLocale } = useLocaleSwitch();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={switching}
        aria-label={t("label")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          if (!switching) setOpen((value) => !value);
        }}
        className={cn(iconBtnClass, "disabled:cursor-wait disabled:opacity-60")}
      >
        <GlobeIcon className="size-5" />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={t("label")}
          className="absolute top-full end-0 z-[70] mt-2 min-w-[9.5rem] overflow-hidden rounded-2xl border border-black/10 bg-[#FEF9F6] py-1 shadow-xl"
        >
          {locales.map((code) => {
            const selected = code === locale;
            return (
              <li key={code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  disabled={switching}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setOpen(false);
                    if (code !== locale) void switchLocale(code);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-start text-sm transition-colors",
                    selected
                      ? "bg-black/5 text-[#C9A962]"
                      : "text-black hover:bg-black/5 hover:text-black/70",
                  )}
                >
                  <span>{t(code === "en" ? "en" : "ar")}</span>
                  <span className="text-[11px] tracking-wide text-black/40 uppercase">
                    {t(code === "en" ? "enShort" : "arShort")}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { openSearch } = useSearch();
  const { data: client } = useGetMeQuery();
  const cartCount = itemCount;
  const accountHref = client ? ROUTES.account : ROUTES.login;
  const accountLabel = client ? t("profile") : t("signIn");

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setShopOpen(false);
  }, [pathname, searchParams]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 md:px-6">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="h-px w-full bg-[#C9A962]/70" />

        <div className="relative mt-0 rounded-[1.35rem] border border-black/10 bg-[#FEF9F6]/95 text-black shadow-[0_10px_30px_rgba(61,46,34,0.08)] backdrop-blur-md sm:rounded-[1.6rem]">
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 sm:h-[4.25rem] sm:px-5 md:h-[4.75rem] md:px-6">
            {/* Left: bag + search */}
            <div className="flex items-center justify-start gap-0.5 sm:gap-1">
              <button
                type="button"
                onClick={openCart}
                className={cn(iconBtnClass, "relative")}
                aria-label={t("cart", { count: cartCount })}
              >
                <BagIcon className="size-5 sm:size-[1.35rem]" />
                <span className="absolute top-1 end-1 flex size-4 items-center justify-center rounded-full bg-[#C9A962] text-[10px] leading-none font-semibold text-white">
                  {cartCount}
                </span>
              </button>
              <button
                type="button"
                onClick={openSearch}
                className={iconBtnClass}
                aria-label={t("search")}
              >
                <SearchIcon className="size-5 sm:size-[1.35rem]" />
              </button>
            </div>

            {/* Center: brand logo */}
            <Link
              href={ROUTES.home}
              className="justify-self-center"
              onClick={() => setMenuOpen(false)}
            >
              <Image
                src={images.logoBlack}
                alt={t("logoAlt")}
                className="h-11 w-auto object-contain sm:h-12 md:h-14"
                priority
              />
            </Link>

            {/* Right: language + burger */}
            <div className="flex items-center justify-end gap-0.5 sm:gap-1">
              <NavbarLanguageButton />
              <button
                type="button"
                className={iconBtnClass}
                aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                {menuOpen ? (
                  <CloseIcon className="size-5 sm:size-6" />
                ) : (
                  <MenuIcon className="size-5 sm:size-6" />
                )}
              </button>
            </div>
          </div>

          {/* Burger nav panel */}
          {menuOpen ? (
            <div className="absolute inset-x-0 top-[calc(100%-0.35rem)] z-50 origin-top animate-[heroFade_180ms_ease-out]">
              <div className="mx-auto max-h-[min(70svh,32rem)] overflow-y-auto rounded-[1.35rem] border border-black/10 bg-[#FEF9F6] px-5 py-4 shadow-[0_16px_40px_rgba(61,46,34,0.14)] sm:rounded-[1.6rem] sm:px-6 sm:py-5">
                <nav className="flex flex-col">
                  {navigation.map((item) =>
                    hasChildren(item) ? (
                      <div key={item.key} className="border-b border-black/10">
                        <button
                          type="button"
                          className={cn(
                            "flex w-full items-center justify-between py-3.5 text-start text-base transition-colors",
                            isNavItemActive(pathname, item.href)
                              ? "font-extrabold text-[#C9A962]"
                              : "font-normal text-black hover:text-black/70",
                          )}
                          aria-expanded={shopOpen}
                          onClick={() => setShopOpen((open) => !open)}
                        >
                          {t(item.key)}
                          <ChevronDownIcon
                            className={cn(
                              "size-4 shrink-0 transition-transform",
                              shopOpen && "rotate-180",
                            )}
                          />
                        </button>
                        {shopOpen ? (
                          <div className="mb-2 ms-1 space-y-0.5 border-s border-black/15 ps-3">
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
                                  className={shopChildClass(childActive)}
                                  onClick={() => setMenuOpen(false)}
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
                        className={menuLinkClass(
                          isNavItemActive(pathname, item.href),
                        )}
                        onClick={() => setMenuOpen(false)}
                      >
                        {t(item.key)}
                      </Link>
                    ),
                  )}
                </nav>

                <div className="mt-5 flex items-center gap-4 border-t border-black/10 pt-4">
                  <Link
                    href={accountHref}
                    className="inline-flex items-center gap-2 text-sm text-black transition-colors hover:text-black/70"
                    aria-label={accountLabel}
                    onClick={() => setMenuOpen(false)}
                  >
                    <UserIcon className="size-5" />
                    <span>{accountLabel}</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {menuOpen ? (
        <button
          type="button"
          aria-label={t("closeMenu")}
          className="fixed inset-0 z-40 cursor-pointer bg-black/25"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
    </header>
  );
}
