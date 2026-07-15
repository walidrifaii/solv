"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { MenuIcon } from "@/components/icons/MenuIcon";
import { images } from "@/constants/images";
import { ROUTES } from "@/constants/routes";
import { dashboardNav } from "@/features/dashboard/data";
import {
  useAdminLogoutMutation,
  useGetAdminMeQuery,
} from "@/store/slices";

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Admin navigation">
      {dashboardNav.map((item) => {
        const active =
          item.href === ROUTES.dashboard
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`rounded-xl px-3 py-2.5 transition-colors ${
              active
                ? "bg-[#c4a574]/18 text-[#c4a574]"
                : "text-[#d1c4b6] hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="block text-sm font-medium">{item.label}</span>
            <span
              className={`mt-0.5 block text-[11px] ${
                active ? "text-[#c4a574]/80" : "text-[#8a7a6c]"
              }`}
            >
              {item.description}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: admin, isLoading, isError } = useGetAdminMeQuery();
  const [logout, { isLoading: loggingOut }] = useAdminLogoutMutation();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (isLoading) return;
    if (isError || !admin) {
      router.replace(ROUTES.dashboardLogin);
    }
  }, [admin, isError, isLoading, router]);

  async function handleLogout() {
    await logout();
    router.replace(ROUTES.dashboardLogin);
    router.refresh();
  }

  if (isLoading || isError || !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FEF9F6] text-[#7a6b5d]">
        {isLoading ? "Checking admin session…" : "Redirecting to admin login…"}
      </div>
    );
  }

  const path = pathname ?? "";
  const activeLabel =
    dashboardNav.find((item) =>
      item.href === ROUTES.dashboard
        ? path === item.href
        : path.startsWith(item.href),
    )?.label ?? "Overview";

  return (
    <div className="flex min-h-screen bg-[#FEF9F6] text-[#2a1f16]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#2a1f16]/20 bg-[#17100a] text-white lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <Link href={ROUTES.dashboard} className="inline-flex items-center gap-3">
            <Image
              src={images.logo}
              alt="SOLV"
              width={36}
              height={36}
              className="rounded-md"
            />
            <div>
              <p className="font-serif text-lg leading-none tracking-wide">
                SOLV
              </p>
              <p className="mt-1 text-[10px] tracking-[0.18em] text-[#c4a574] uppercase">
                Admin
              </p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavLinks pathname={path} />
        </div>

        <div className="border-t border-white/10 px-4 py-4">
          <p className="truncate text-sm font-medium text-white">{admin.name}</p>
          <p className="mt-0.5 truncate text-xs text-[#8a7a6c]">{admin.email}</p>
          <div className="mt-3 flex gap-2">
            <Link
              href={ROUTES.home}
              className="flex-1 rounded-lg border border-white/15 px-2 py-2 text-center text-xs text-[#d1c4b6] transition-colors hover:border-[#c4a574]/50 hover:text-white"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex-1 rounded-lg bg-[#c4a574] px-2 py-2 text-xs font-medium text-[#17100a] transition-colors hover:bg-[#d4b584] disabled:opacity-60"
            >
              {loggingOut ? "…" : "Sign out"}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          className={`absolute inset-0 bg-[#17100a]/50 transition-opacity ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col bg-[#17100a] text-white shadow-2xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
            <p className="font-serif text-lg tracking-wide">SOLV Admin</p>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex size-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10"
              aria-label="Close"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <NavLinks
              pathname={path}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-[#e8ddd2] bg-[#FEF9F6]/90 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-[#e8ddd2] bg-white text-[#2a1f16] lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <MenuIcon className="size-5" />
              </button>
              <div className="min-w-0">
                <p className="text-[10px] font-medium tracking-[0.18em] text-[#b0895b] uppercase">
                  Dashboard
                </p>
                <h1 className="truncate font-serif text-xl font-medium text-[#2a1f16] sm:text-2xl">
                  {activeLabel}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden rounded-full bg-[#e8f0e4] px-3 py-1 text-[11px] font-medium text-[#4f6b45] sm:inline">
                Secure session
              </span>
              <Link
                href={ROUTES.shop}
                className="hidden rounded-xl border border-[#e8ddd2] bg-white px-3 py-2 text-xs font-medium text-[#5c4f43] transition-colors hover:border-[#c4a574] sm:inline-flex"
              >
                Open shop
              </Link>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mb-5 rounded-xl border border-[#e8ddd2] bg-[#F6EDE6] px-4 py-3 text-sm text-[#7a6b5d]">
            Signed in as {admin.name}. Catalog and orders are live via admin
            APIs.
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
