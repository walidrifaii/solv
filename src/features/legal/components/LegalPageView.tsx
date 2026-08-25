import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/constants/routes";

type LegalPageKey = "terms" | "privacy" | "returns" | "faqs" | "trackOrder";

type Props = {
  pageKey: LegalPageKey;
};

export async function LegalPageView({ pageKey }: Props) {
  const t = await getTranslations(`legal.${pageKey}`);
  const tLegal = await getTranslations("legal");
  const paragraphs = t.raw("paragraphs") as string[];
  const faqs = pageKey === "faqs" ? (t.raw("items") as { q: string; a: string }[]) : null;

  return (
    <main className="flex flex-1 flex-col bg-[#f5f0e8] text-[#a5a196]">
      <section className="border-b border-[#e8ddd2] bg-[#FEF9F6]">
        <div className="mx-auto w-full max-w-[900px] px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-14">
          <p className="text-[11px] font-medium tracking-[0.2em] text-[#C9A962] uppercase">
            {tLegal("eyebrow")}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-medium text-[#a5a196] sm:text-4xl md:text-[2.75rem]">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#7a6b5d] sm:text-base">
            {t("intro")}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[900px] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
        {faqs ? (
          <ul className="space-y-4">
            {faqs.map((item) => (
              <li
                key={item.q}
                className="rounded-2xl border border-[#e8ddd2] bg-[#FEF9F6] px-5 py-4 sm:px-6 sm:py-5"
              >
                <h2 className="font-serif text-lg font-medium text-[#a5a196] sm:text-xl">
                  {item.q}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#7a6b5d] sm:text-base">
                  {item.a}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-4 rounded-2xl border border-[#e8ddd2] bg-[#FEF9F6] px-5 py-6 sm:px-6 sm:py-8">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-sm leading-relaxed text-[#5c4f43] sm:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={ROUTES.contact}
            className="inline-flex rounded-xl bg-[#C9A962] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#D9BC82]"
          >
            {tLegal("contactCta")}
          </Link>
          <Link
            href={ROUTES.home}
            className="inline-flex rounded-xl border border-[#e8ddd2] bg-white px-4 py-2.5 text-sm font-medium text-[#5c4f43] transition-colors hover:border-[#C9A962]"
          >
            {tLegal("homeCta")}
          </Link>
        </div>
      </section>
    </main>
  );
}
