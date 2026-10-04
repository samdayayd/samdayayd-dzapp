import Image from "next/image";
import { useTranslations } from "next-intl";
import { Building2, Car, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HeroContent } from "@/components/HeroContent";
import { CategoryDropdown } from "@/components/CategoryDropdown";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  const t = useTranslations("home");

  const steps = [
    { n: "01", title: t("step1Title"), body: t("step1Body") },
    { n: "02", title: t("step2Title"), body: t("step2Body") },
    { n: "03", title: t("step3Title"), body: t("step3Body") },
  ];

  const categories = [
    {
      href: "/voitures",
      icon: Car,
      name: t("catVoituresName"),
      note: t("catVoituresNote"),
      accent: "from-brand-500 to-brand-700",
    },
    {
      href: "/immobilier",
      icon: Building2,
      name: t("catImmobilierName"),
      note: t("catImmobilierNote"),
      accent: "from-accent-500 to-accent-700",
    },
    {
      href: "/achat-vente",
      icon: ShoppingBag,
      name: t("catAchatVenteName"),
      note: t("catAchatVenteNote"),
      accent: "from-neutral-700 to-neutral-900",
    },
  ];

  return (
    <div>
      {/* Hero — photo-backed with a working search bar as the main act.
          Marketplaces (Leboncoin, Idealista, Airbnb) lead with search over
          a real, warm photo; a minimalist text-only hero was the wrong
          reference point for a classifieds product. Desktop/mobile use
          different crops of the same photo so both skylines (France,
          Algeria) stay visible either way — see the aspect-ratio comments
          below. */}
      <section className="relative hidden bg-neutral-900 sm:block">
        <div className="relative w-full" style={{ aspectRatio: "1672 / 941" }}>
          <Image src="/hero-photo-v2.png" alt="" fill priority className="object-cover" sizes="100vw" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 42% 72% at 50% 46%, rgba(255,255,255,0.76) 0%, rgba(255,255,255,0.44) 55%, rgba(255,255,255,0) 80%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center px-[18%]">
            <HeroContent />
          </div>
        </div>
      </section>

      <section className="relative bg-neutral-900 sm:hidden">
        <div className="relative w-full" style={{ aspectRatio: "16 / 13" }}>
          <Image
            src="/hero-photo-v2.png"
            alt=""
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "40% center" }}
            sizes="100vw"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 78% at 50% 42%, rgba(255,255,255,0.84) 0%, rgba(255,255,255,0.48) 55%, rgba(255,255,255,0) 82%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center px-4 py-6">
            <HeroContent compact />
          </div>
        </div>
      </section>

      {/* Fact bar — real, true facts stated plainly. */}
      <section className="border-b border-neutral-200/70 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-6 text-sm font-medium text-neutral-500 sm:px-6">
          <span>{t("trust1Title")}</span>
          <span className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block" />
          <span>{t("trust2Title")}</span>
          <span className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block" />
          <span>{t("trust3Title")}</span>
        </div>
      </section>

      {/* Category — photo-style tiles (colored header + icon), the visual
          weight a marketplace's category browsing actually needs, not a
          thin text list. */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              {t("categoriesTitle")}
            </h2>
            <p className="mt-1 text-neutral-500">{t("categoriesSubtitle")}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ href, icon: Icon, name, note, accent }, i) => (
            <Reveal key={href} delay={i * 0.08}>
              <Link href={href} className="card-interactive group block overflow-hidden">
                <div className={`flex h-28 items-center justify-center bg-gradient-to-br ${accent} text-white`}>
                  <Icon size={34} strokeWidth={1.6} className="transition-transform group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-bold text-neutral-900">{name}</p>
                    <span className="badge-brand shrink-0">{t("catAvailable")}</span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">{note}</p>
                </div>
              </Link>
            </Reveal>
          ))}

          <Reveal delay={categories.length * 0.08}>
            <div className="card flex h-full flex-col overflow-hidden opacity-60">
              <div className="flex h-28 items-center justify-center bg-neutral-100 text-neutral-400">
                <Sparkles size={30} strokeWidth={1.6} />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-lg font-bold text-neutral-700">{t("catTravailName")}</p>
                  <span className="badge-neutral shrink-0">{t("catComingSoon")}</span>
                </div>
                <p className="mt-1 text-sm text-neutral-400">{t("catTravailNote")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Statement — the "why this exists" framing, plain and declarative. */}
      <section className="border-t border-neutral-200/70 bg-neutral-50/70 px-4 py-16 text-center sm:px-6 sm:py-20">
        <Reveal className="mx-auto max-w-3xl">
          <p className="text-2xl font-medium leading-snug text-neutral-500 sm:text-3xl">
            {t("statementPlain")} <span className="font-bold text-neutral-900">{t("statementBold")}</span>
          </p>
        </Reveal>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal className="mb-10 max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {t("howItWorksTitle")}
          </h2>
          <p className="mt-2 text-neutral-500">{t("howItWorksSubtitle")}</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-t border-neutral-200 sm:grid-cols-3">
          {steps.map(({ n, title, body }, i) => (
            <Reveal
              key={n}
              delay={i * 0.1}
              className="border-neutral-200 pt-7 sm:border-s sm:first:border-s-0 sm:[&:not(:first-child)]:ps-8"
            >
              <p className="text-sm font-bold text-brand-600">{n}</p>
              <p className="mt-2 text-lg font-semibold text-neutral-900">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-16 sm:px-6">
        <Reveal className="bg-grain relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 via-brand-900 to-neutral-950 px-6 py-16 text-center sm:px-16">
          <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-5xl">
            {t("finalCtaTitle")}
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-lg text-brand-100/90">{t("finalCtaBody")}</p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
