import { useTranslations } from "next-intl";
import { Building2, Car, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HeroContent } from "@/components/HeroContent";
import { CategoryDropdown } from "@/components/CategoryDropdown";
import { ProductPreview } from "@/components/ProductPreview";
import { BrandSkyline } from "@/components/BrandSkyline";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  const t = useTranslations("home");

  const steps = [
    { n: "01", title: t("step1Title"), body: t("step1Body") },
    { n: "02", title: t("step2Title"), body: t("step2Body") },
    { n: "03", title: t("step3Title"), body: t("step3Body") },
  ];

  const categories = [
    { href: "/voitures", icon: Car, name: t("catVoituresName"), note: t("catVoituresNote"), n: "01" },
    { href: "/immobilier", icon: Building2, name: t("catImmobilierName"), note: t("catImmobilierNote"), n: "02" },
    { href: "/achat-vente", icon: ShoppingBag, name: t("catAchatVenteName"), note: t("catAchatVenteNote"), n: "03" },
  ];

  return (
    <div>
      {/* Hero — asymmetric: text column + an actual preview of what a DZ
          APP listing card looks like (not a stock photo, not an abstract
          illustration — the real card UI, tilted and layered). The old
          hero put a romantic stock-style photograph full-bleed behind the
          headline; this shows the product instead. The France/Algeria
          story the photo used to carry now lives in the BrandSkyline line
          art along the bottom instead of a literal photograph. */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/50 to-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-8 lg:py-28">
          <Reveal>
            <HeroContent />
          </Reveal>
          <Reveal delay={0.15} className="order-first lg:order-last">
            <ProductPreview />
          </Reveal>
        </div>
        <BrandSkyline className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full text-brand-900/[0.07] sm:h-28" />
      </section>

      {/* Fact bar — real, true facts stated plainly, not a repeat of the
          hero's claims as another card grid. */}
      <section className="border-y border-neutral-200/70 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-6 text-sm font-medium text-neutral-500 sm:px-6">
          <span>{t("trust1Title")}</span>
          <span className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block" />
          <span>{t("trust2Title")}</span>
          <span className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block" />
          <span>{t("trust3Title")}</span>
        </div>
      </section>

      {/* Statement — the "why this exists" framing, as a plain bold
          declarative sentence rather than a 3-card "problem/solution"
          section. */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <Reveal>
          <p className="text-3xl font-medium leading-snug text-neutral-500 sm:text-4xl">
            {t("statementPlain")}{" "}
            <span className="font-bold text-neutral-900">{t("statementBold")}</span>
          </p>
        </Reveal>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <Reveal className="mb-12 max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {t("howItWorksTitle")}
          </h2>
          <p className="mt-3 text-lg text-neutral-500">{t("howItWorksSubtitle")}</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 border-t border-neutral-200 sm:grid-cols-3">
          {steps.map(({ n, title, body }, i) => (
            <Reveal
              key={n}
              delay={i * 0.1}
              className="border-neutral-200 pt-8 sm:border-s sm:first:border-s-0 sm:[&:not(:first-child)]:ps-8"
            >
              <p className="text-sm font-bold text-brand-600">{n}</p>
              <p className="mt-2 text-lg font-semibold text-neutral-900">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Category */}
      <section className="border-t border-neutral-200/70 bg-neutral-50/70 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mb-12 max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              {t("categoriesTitle")}
            </h2>
            <p className="mt-3 text-lg text-neutral-500">{t("categoriesSubtitle")}</p>
          </Reveal>

          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {categories.map(({ href, icon: Icon, name, note, n }, i) => (
              <Reveal key={href} delay={i * 0.06}>
                <Link
                  href={href}
                  className="group flex items-center gap-5 bg-white px-5 py-7 transition-colors hover:bg-brand-50/40 sm:gap-8 sm:px-8"
                >
                  <span className="hidden w-10 shrink-0 text-sm font-bold text-neutral-300 transition-colors group-hover:text-brand-400 sm:block">
                    {n}
                  </span>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm transition-transform group-hover:scale-105">
                    <Icon size={22} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2.5">
                      <span className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">{name}</span>
                      <span className="badge-brand">{t("catAvailable")}</span>
                    </span>
                    <span className="mt-0.5 block text-sm text-neutral-500">{note}</span>
                  </span>
                  <span className="shrink-0 text-2xl text-neutral-300 transition-all group-hover:translate-x-1 group-hover:text-brand-600 rtl:rotate-180 rtl:group-hover:-translate-x-1">
                    →
                  </span>
                </Link>
              </Reveal>
            ))}

            <Reveal delay={categories.length * 0.06}>
              <div className="flex items-center gap-5 bg-white px-5 py-7 opacity-50 sm:gap-8 sm:px-8">
                <span className="hidden w-10 shrink-0 text-sm font-bold text-neutral-300 sm:block">04</span>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2.5">
                    <span className="text-xl font-bold tracking-tight text-neutral-700 sm:text-2xl">
                      {t("catTravailName")}
                    </span>
                    <span className="badge-neutral">{t("catComingSoon")}</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-neutral-400">{t("catTravailNote")}</span>
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 sm:px-6">
        <Reveal className="bg-grain relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 via-brand-900 to-neutral-950 px-6 py-20 text-center sm:px-16">
          <h2 className="relative text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {t("finalCtaTitle")}
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-lg text-brand-100/90">{t("finalCtaBody")}</p>
          <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CategoryDropdown
              mode="browse"
              triggerClassName="btn-primary !bg-white !text-brand-900 hover:!bg-brand-50 !px-7 !py-3.5 !text-base shadow-lg"
            >
              {t("finalCtaBrowse")}
            </CategoryDropdown>
            <CategoryDropdown
              mode="post"
              triggerClassName="btn !border !border-white/25 !bg-white/10 !text-white hover:!bg-white/20 !px-7 !py-3.5 !text-base backdrop-blur-sm"
            >
              {t("finalCtaPublish")}
            </CategoryDropdown>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
