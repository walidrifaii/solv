import Image from "next/image";
import Link from "next/link";
import heroImage from "@/assets/images/newsletter-community.png";
import { ROUTES } from "@/constants/routes";

export function ProfileHero() {
  return (
    <section className="relative isolate min-h-[36svh] w-full overflow-hidden bg-[#17100a] text-white sm:min-h-[40svh] md:min-h-[44svh]">
      <Image
        src={heroImage}
        alt="SOLV coffee and community"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#17100a] via-[#17100a]/65 to-[#17100a]/35" />

      <div className="relative z-10 mx-auto flex min-h-[36svh] w-full max-w-[1400px] flex-col justify-end px-4 pb-10 pt-20 sm:min-h-[40svh] sm:px-6 sm:pb-12 sm:pt-24 md:min-h-[44svh] md:justify-center md:px-8 md:pb-14 lg:px-10">
        <div className="max-w-2xl animate-[heroFade_0.6s_ease-out]">
          <nav className="mb-4 text-sm text-white/70" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href={ROUTES.home}
                  className="transition-colors hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-white/40">
                /
              </li>
              <li className="text-[#c4a574]">Profile</li>
            </ol>
          </nav>

          <p className="mb-3 text-[11px] font-medium tracking-[0.22em] text-[#c4a574] uppercase sm:text-xs">
            Your account
          </p>
          <h1 className="font-serif text-4xl leading-none font-medium tracking-[0.04em] text-white sm:text-5xl md:text-6xl">
            Profile
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75 sm:mt-4 sm:text-base">
            Manage your details and review your order history.
          </p>
        </div>
      </div>
    </section>
  );
}
