"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BagIcon } from "@/components/icons/BagIcon";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { MenuIcon } from "@/components/icons/MenuIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { UserIcon } from "@/components/icons/UserIcon";
import { images } from "@/constants/images";
import { ROUTES } from "@/constants/routes";
import { navigation } from "@/data/navigation";

type NavItem = (typeof navigation)[number];

function hasChildren(
  item: NavItem,
): item is NavItem & { children: readonly { label: string; href: string }[] } {
  return "children" in item && Array.isArray(item.children);
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const cartCount = 0;

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
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-6 md:h-20 md:px-8 lg:h-24 lg:px-10">
        <Link
          href={ROUTES.home}
          className="relative z-10 shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src={images.logo}
            alt="SOLV Coffee & Tea Supplier"
            className="h-11 w-auto object-contain sm:h-14 md:h-16 lg:h-[5.25rem] xl:h-24"
            priority
          />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 xl:gap-10 lg:flex">
          {navigation.map((item) =>
            hasChildren(item) ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-sm font-normal tracking-wide transition-colors hover:text-white xl:text-base"
                  aria-expanded={shopOpen}
                  aria-haspopup="true"
                  onClick={() => setShopOpen((open) => !open)}
                >
                  {item.label}
                  <ChevronDownIcon
                    className={`size-3.5 transition-transform xl:size-4 ${shopOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {shopOpen ? (
                  <div className="absolute left-1/2 top-full z-20 min-w-48 -translate-x-1/2 pt-3">
                    <div className="rounded-md border border-white/10 bg-[#17100a]/95 py-2 shadow-xl backdrop-blur-md">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-[#d1d1d1] transition-colors hover:bg-white/5 hover:text-white"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-normal tracking-wide transition-colors hover:text-white xl:text-base"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
          <button
            type="button"
            className="hidden p-1.5 transition-colors hover:text-white md:inline-flex"
            aria-label="Search"
          >
            <SearchIcon className="size-5 lg:size-6" />
          </button>
          <Link
            href={ROUTES.account}
            className="hidden p-1.5 transition-colors hover:text-white md:inline-flex"
            aria-label="Account"
          >
            <UserIcon className="size-5 lg:size-6" />
          </Link>
          <Link
            href={ROUTES.cart}
            className="relative hidden p-1.5 transition-colors hover:text-white sm:inline-flex"
            aria-label={`Cart, ${cartCount} items`}
          >
            <BagIcon className="size-5 lg:size-6" />
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#c4a574] text-[10px] font-semibold leading-none text-white lg:size-5 lg:text-[11px]">
              {cartCount}
            </span>
          </Link>

          <Link
            href={ROUTES.order}
            className="rounded-md bg-[#c4a574] px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white transition-colors hover:bg-[#d4b584] sm:px-4 sm:py-2 sm:text-sm md:px-5 md:text-base"
          >
            Order Now
          </Link>

          <button
            type="button"
            className="inline-flex p-1.5 text-[#d1d1d1] transition-colors hover:text-white lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
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
          <nav className="flex flex-col">
            {navigation.map((item) =>
              hasChildren(item) ? (
                <div key={item.label} className="border-b border-white/5">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-3.5 text-left text-base transition-colors hover:text-white"
                    aria-expanded={mobileShopOpen}
                    onClick={() => setMobileShopOpen((open) => !open)}
                  >
                    {item.label}
                    <ChevronDownIcon
                      className={`size-4 transition-transform ${mobileShopOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileShopOpen
                    ? item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block py-2.5 pl-3 text-sm text-[#a3a3a3] transition-colors hover:text-white"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))
                    : null}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="border-b border-white/5 py-3.5 text-base transition-colors hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="mt-5 flex items-center gap-5 md:hidden">
            <button type="button" className="p-1" aria-label="Search">
              <SearchIcon className="size-5" />
            </button>
            <Link href={ROUTES.account} className="p-1" aria-label="Account">
              <UserIcon className="size-5" />
            </Link>
            <Link
              href={ROUTES.cart}
              className="relative p-1 sm:hidden"
              aria-label={`Cart, ${cartCount} items`}
            >
              <BagIcon className="size-5" />
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#c4a574] text-[10px] font-semibold leading-none text-white">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
