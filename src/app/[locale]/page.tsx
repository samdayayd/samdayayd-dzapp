import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Building2, Car, DoorOpen, Fuel, Gauge, Ruler, ShoppingBag, Sparkles, Tag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HeroContent } from "@/components/HeroContent";
import { CategoryDropdown } from "@/components/CategoryDropdown";
import { ListingCard } from "@/components/ListingCard";
import { Reveal } from "@/components/Reveal";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatKm } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const tVoitures = await getTranslations("voitures");
  const tImmobilier = await getTranslations("immobilier");
  const tAchatVente = await getTranslations("achatVente");

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

  // Featured listings — a marketplace homepage has to show the actual
  // marketplace, not just describe it. Two most recent per category,
  // interleaved so one category can't crowd the others out.
  const [listings, properties, items] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "ACTIVE" },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 2,
    }),
    prisma.property.findMany({
      where: { status: "ACTIVE" },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 2,
    }),
    prisma.item.findMany({
      where: { status: "ACTIVE" },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 2,
    }),
  ]);

  const listingCards = listings.map((l) => ({
    key: `listing-${l.id}`,
    href: `/voitures/${l.id}`,
    imageUrl: l.images[0]?.url,
    title: l.title,
    price: formatPrice(l.price, l.currency, locale),
    priceSuffix: l.saleType === "LOCATION" ? tVoitures("perDay") : undefined,
    country: tVoitures(`country.${l.country}` as "country.FRANCE"),
    city: l.city,
    categoryBadge: tVoitures("category"),
    saleBadge: { label: tVoitures(`saleType.${l.saleType}` as "saleType.VENTE"), variant: "brand" as const },
    fallbackIcon: Car,
    meta: [
      { icon: Gauge, label: formatKm(l.mileageKm, locale) },
      { icon: Fuel, label: tVoitures(`fuel.${l.fuelType}` as "fuel.ESSENCE") },
    ],
  }));
  const propertyCards = properties.map((p) => ({
    key: `property-${p.id}`,
    href: `/immobilier/${p.id}`,
    imageUrl: p.images[0]?.url,
    title: p.title,
    price: formatPrice(p.price, p.currency, locale),
    priceSuffix: p.saleType === "LOCATION" ? tImmobilier("perMonth") : undefined,
    country: tImmobilier(`country.${p.country}` as "country.FRANCE"),
    city: p.city,
    categoryBadge: tImmobilier("category"),
    saleBadge: { label: tImmobilier(`saleType.${p.saleType}` as "saleType.VENTE"), variant: "accent" as const },
    fallbackIcon: Building2,
    meta: [
      { icon: DoorOpen, label: String(p.rooms) },
      { icon: Ruler, label: `${p.surfaceM2} m²` },
    ],
  }));
  const itemCards = items.map((it) => ({
    key: `item-${it.id}`,
    href: `/achat-vente/${it.id}`,
    imageUrl: it.images[0]?.url,
    title: it.title,
    price: formatPrice(it.price, it.currency, locale),
    priceSuffix: undefined,
    country: tAchatVente(`country.${it.country}` as "country.FRANCE"),
    city: it.city,
    categoryBadge: tAchatVente("category"),
    saleBadge: undefined,
    fallbackIcon: ShoppingBag,
    meta: [{ icon: Tag, label: tAchatVente(`condition.${it.condition}` as "condition.NEUF") }],
  }));

  // Interleave by category (round-robin) instead of a random shuffle, so
  // the section order is stable across renders rather than reshuffling
  // every time the page re-renders.
  type FeaturedCard = (typeof listingCards | typeof propertyCards | typeof itemCards)[number];
  const featured: FeaturedCard[] = [];
  const buckets: FeaturedCard[][] = [listingCards, propertyCards, itemCards];
  for (let i = 0; i < 2; i++) {
    for (const bucket of buckets) {
      if (bucket[i]) featured.push(bucket[i]);
    }
  }

  return (
    <div>
      {/* Hero — photo-backed with a working search bar as the main act.
          Marketplaces (Leboncoin, Idealista, Airbnb) lead with search over
          a real, warm photo. Desktop/mobile use different crops of the
          same photo so both skylines (France, Algeria) stay visible
          either way — see the aspect-ratio comments below. */}
      <section className="relative hidden bg-neutral-900 sm:block">
        <div className="relative w-full" style={{ aspectRatio: "1672 / 941" }}>
          <Image src="/hero-photo-v2.png" alt="" fill priority className="object-cover" sizes="100vw" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 46% 76% at 50% 46%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.46) 55%, rgba(255,255,255,0) 80%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center px-[14%]">
            <HeroContent />
          </div>
        </div>
      </section>

      <section className="relative bg-neutral-900 sm:hidden">
        <div className="relative w-full" style={{ aspectRatio: "16 / 15" }}>
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
                "radial-gradient(ellipse 72% 80% at 50% 40%, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.5) 55%, rgba(255,255,255,0) 82%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center px-4 py-6">
            <HeroContent compact />
          </div>
        </div>
      </section>

      {/* Route strip — the France ↔ Algeria differentiator stated as
          actual city routes instead of flags. */}
      <section className="border-b border-neutral-200/70 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-5 text-sm font-medium text-neutral-500 sm:px-6">
          {["Paris ↔ Alger", "Lyon ↔ Oran", "Marseille ↔ Constantine"].map((route) => (
            <span key={route} className="text-neutral-600">
              {route}
            </span>
          ))}
        </div>
      </section>

      {/* Featured listings — a marketplace homepage has to show the
          marketplace itself. Falls back to a plain "be the first" prompt
          when the database is empty rather than faking listings. */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              {t("featuredTitle")}
            </h2>
            <p className="mt-1 text-neutral-500">{t("featuredSubtitle")}</p>
          </div>
        </Reveal>

        {featured.length === 0 ? (
          <Reveal className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center">
            <p className="font-medium text-neutral-700">{t("featuredEmptyTitle")}</p>
            <p className="mt-1 text-sm text-neutral-500">{t("featuredEmptyBody")}</p>
          </Reveal>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {featured.map((item, i) => (
              <Reveal key={item.key} delay={i * 0.05}>
                <ListingCard
                  href={item.href}
                  imageUrl={item.imageUrl}
                  imageAlt={item.title}
                  fallbackIcon={item.fallbackIcon}
                  title={item.title}
                  price={item.price}
                  priceSuffix={item.priceSuffix}
                  country={item.country}
                  city={item.city}
                  categoryBadge={item.categoryBadge}
                  saleBadge={item.saleBadge}
                  meta={item.meta}
                />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Category — photo-style tiles (colored header + icon). */}
      <section className="border-t border-neutral-200/70 bg-neutral-50/70 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
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
        </div>
      </section>

      {/* Statement — the "why this exists" framing, plain and declarative. */}
      <section className="px-4 py-16 text-center sm:px-6 sm:py-20">
        <Reveal className="mx-auto max-w-3xl">
          <p className="text-2xl font-medium leading-snug text-neutral-500 sm:text-3xl">
            {t("statementPlain")} <span className="font-bold text-neutral-900">{t("statementBold")}</span>
          </p>
        </Reveal>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
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
