"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useRef, useState, type ComponentType } from "react";
import { BagIcon } from "@/components/icons/BagIcon";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { CoffeeBeansIcon } from "@/components/icons/CoffeeBeansIcon";
import { GlobeIcon } from "@/components/icons/GlobeIcon";
import { HeadsetIcon } from "@/components/icons/HeadsetIcon";
import { MenuIcon } from "@/components/icons/MenuIcon";
import {
  ContactIcon,
  HomeIcon,
  InfoIcon,
  StoreIcon,
} from "@/components/icons/NavDrawerIcons";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { UserIcon } from "@/components/icons/UserIcon";
import { useLocaleSwitch } from "@/components/providers/LocaleSwitchProvider";
import { images } from "@/constants/images";
import { ROUTES } from "@/constants/routes";
import { shopCategories } from "@/data/categories";
import { navigation } from "@/data/navigation";
import { useCart } from "@/features/cart/CartProvider";
import { useSearch } from "@/features/search/SearchProvider";
import { locales, type Locale } from "@/i18n/config";
import { pickLocalized } from "@/lib/localized";
import { useGetCategoriesQuery, useGetMeQuery } from "@/store/slices";
import { cn } from "@/lib/utils";

type NavItem = (typeof navigation)[number];
type IconComponent = ComponentType<{ className?: string }>;

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
  categoryId: string,
) {
  if (!isShopPath(pathname)) return false;
  const activeCategory = searchParams.get("category");
  if (categoryId === "all") return !activeCategory;
  return activeCategory === categoryId;
}

function hasChildren(
  item: NavItem,
): item is NavItem & {
  children: readonly { key: string; href: string }[];
} {
  return "children" in item && Array.isArray(item.children);
}

const NAV_ICONS: Record<string, IconComponent> = {
  home: HomeIcon,
  about: InfoIcon,
  shop: StoreIcon,
  services: HeadsetIcon,
  contact: ContactIcon,
};

const iconBtnClass =
  "inline-flex size-11 items-center justify-center rounded-full text-black transition-colors hover:bg-black/5 hover:text-black/70 sm:size-12";

const quickActionClass =
  "inline-flex size-12 items-center justify-center rounded-xl bg-[#a5a196] text-white transition-colors hover:bg-[#8f8779] sm:size-[3.25rem]";

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
        <GlobeIcon className="size-5 sm:size-6" />
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
  const tLocale = useTranslations("locale");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const { openSearch } = useSearch();
  const { switching, switchLocale } = useLocaleSwitch();
  const { data: client } = useGetMeQuery();
  const { data: categoriesData } = useGetCategoriesQuery(
    { limit: 50 },
    { skip: !menuOpen },
  );
  const cartCount = itemCount;
  const accountHref = client ? ROUTES.account : ROUTES.login;
  const accountLabel = client ? t("profile") : t("signIn");
  const allProductsLabel = t("allProducts");

  const shopChildren = useMemo(() => {
    const fromApi = (categoriesData ?? []).map((category) => ({
      id: category.id,
      name: pickLocalized(locale, category.name, category.nameAr),
      href: `${ROUTES.shop}?category=${category.id}`,
    }));
    const items =
      fromApi.length > 0
        ? fromApi
        : shopCategories.map((category) => ({
            id: category.id,
            name: category.name,
            href: category.href,
          }));

    return [
      { id: "all", name: allProductsLabel, href: ROUTES.shop },
      ...items,
    ];
  }, [allProductsLabel, categoriesData, locale]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) setShopOpen(true);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setShopOpen(false);
  }, [pathname, searchParams]);

  async function toggleLocale() {
    if (switching) return;
    const next = locale === "en" ? "ar" : "en";
    await switchLocale(next);
  }

  return (
    <header className="relative z-50 px-3 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="h-px w-full bg-[#C9A962]/70" />

        <div className="relative mt-0 rounded-[1.5rem] border border-black/10 bg-[#FEF9F6]/95 text-black shadow-[0_10px_30px_rgba(61,46,34,0.08)] backdrop-blur-md sm:rounded-[1.75rem]">
          {/*
            Icon sides stay the same in EN and AR (do not mirror with page RTL):
            LEFT  = cart + search
            RIGHT = language + burger
          */}
          <div
            dir="ltr"
            style={{ direction: "ltr" }}
            className="grid min-h-[4.75rem] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3 sm:min-h-[5.5rem] sm:gap-3 sm:px-6 sm:py-4 md:min-h-[6.25rem] md:px-8 md:py-5"
          >
            {/* LEFT */}
            <div className="flex items-center justify-start gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={openCart}
                className={cn(iconBtnClass, "relative")}
                aria-label={t("cart", { count: cartCount })}
              >
                <BagIcon className="size-5 sm:size-6" />
                <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-[#C9A962] text-[10px] leading-none font-semibold text-white sm:size-5 sm:text-[11px]">
                  {cartCount}
                </span>
              </button>
              <button
                type="button"
                onClick={openSearch}
                className={iconBtnClass}
                aria-label={t("search")}
              >
                <SearchIcon className="size-5 sm:size-6" />
              </button>
            </div>

            {/* CENTER */}
            <Link
              href={ROUTES.home}
              className="justify-self-center"
              onClick={() => setMenuOpen(false)}
            >
              <Image
                src={images.logoBlack}
                alt={t("logoAlt")}
                className="h-14 w-auto object-contain sm:h-16 md:h-[4.5rem]"
                priority
              />
            </Link>

            {/* RIGHT */}
            <div className="flex items-center justify-end gap-1 sm:gap-1.5">
              <NavbarLanguageButton />
              <button
                type="button"
                className={iconBtnClass}
                aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                {menuOpen ? (
                  <CloseIcon className="size-6 sm:size-7" />
                ) : (
                  <MenuIcon className="size-6 sm:size-7" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[60] transition-[visibility] duration-300",
          menuOpen ? "visible" : "invisible delay-300",
        )}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label={t("closeMenu")}
          className={cn(
            "absolute inset-0 cursor-pointer bg-black/35 transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMenuOpen(false)}
        />

        <aside
          className={cn(
            "absolute inset-y-0 start-0 flex w-[min(22rem,88vw)] flex-col bg-[#FEF9F6] text-black shadow-[12px_0_40px_rgba(61,46,34,0.18)] transition-transform duration-300 ease-out rtl:shadow-[-12px_0_40px_rgba(61,46,34,0.18)] sm:w-[24rem]",
            menuOpen
              ? "translate-x-0"
              : "-translate-x-full rtl:translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label={t("openMenu")}
        >
          <div className="flex items-center justify-end px-4 pt-4">
            <button
              type="button"
              className={iconBtnClass}
              aria-label={t("closeMenu")}
              onClick={() => setMenuOpen(false)}
            >
              <CloseIcon className="size-6" />
            </button>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-8 pt-2">
            <Link
              href={ROUTES.home}
              className="mx-auto mb-8 flex size-28 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white p-3 shadow-sm sm:size-32"
              onClick={() => setMenuOpen(false)}
            >
              <Image
                src={images.logoBlack}
                alt={t("logoAlt")}
                className="h-full w-auto object-contain"
              />
            </Link>

            <div className="mb-8 flex items-center justify-center gap-3">
              <button
                type="button"
                className={quickActionClass}
                aria-label={tLocale("label")}
                disabled={switching}
                onClick={() => void toggleLocale()}
              >
                <GlobeIcon className="size-5" />
              </button>
              <Link
                href={accountHref}
                className={quickActionClass}
                aria-label={accountLabel}
                onClick={() => setMenuOpen(false)}
              >
                <UserIcon className="size-5" />
              </Link>
              <Link
                href={ROUTES.home}
                className={quickActionClass}
                aria-label={t("home")}
                onClick={() => setMenuOpen(false)}
              >
                <HomeIcon className="size-5" />
              </Link>
              <button
                type="button"
                className={cn(quickActionClass, "relative")}
                aria-label={t("cart", { count: cartCount })}
                onClick={() => {
                  setMenuOpen(false);
                  openCart();
                }}
              >
                <BagIcon className="size-5" />
                <span className="absolute -top-1 -end-1 flex size-5 items-center justify-center rounded-full bg-[#C9A962] text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              </button>
            </div>

            <nav className="flex flex-col">
              {navigation.map((item) => {
                const Icon = NAV_ICONS[item.key] ?? CoffeeBeansIcon;
                const active = isNavItemActive(pathname, item.href);

                if (hasChildren(item)) {
                  return (
                    <div key={item.key} className="border-b border-black/10">
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-4 py-5 text-start transition-colors",
                          active
                            ? "font-extrabold text-[#C9A962]"
                            : "font-medium text-[#3d2e22] hover:text-black",
                        )}
                        aria-expanded={shopOpen}
                        onClick={() => setShopOpen((open) => !open)}
                      >
                        <Icon className="size-6 shrink-0" />
                        <span className="flex-1 text-lg">{t(item.key)}</span>
                        <ChevronDownIcon
                          className={cn(
                            "size-4 shrink-0 transition-transform",
                            shopOpen && "rotate-180",
                          )}
                        />
                      </button>
                      {shopOpen ? (
                        <div className="mb-3 space-y-1 border-s border-black/15 ps-10">
                          {shopChildren.map((child) => {
                            const childActive = isShopChildActive(
                              pathname,
                              searchParams,
                              child.id,
                            );
                            return (
                              <Link
                                key={child.id}
                                href={child.href}
                                className={cn(
                                  "block py-3 text-base transition-colors",
                                  childActive
                                    ? "font-extrabold text-[#C9A962]"
                                    : "font-normal text-black/70 hover:text-black",
                                )}
                                onClick={() => setMenuOpen(false)}
                              >
                                {child.name}
                              </Link>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 border-b border-black/10 py-5 transition-colors",
                      active
                        ? "font-extrabold text-[#C9A962]"
                        : "font-medium text-[#3d2e22] hover:text-black",
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="size-6 shrink-0" />
                    <span className="flex-1 text-lg">{t(item.key)}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
      </div>
    </header>
  );
}
