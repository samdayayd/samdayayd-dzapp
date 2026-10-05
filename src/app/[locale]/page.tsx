import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Building2, Car, DoorOpen, Fuel, Gauge, LayoutGrid, MessageCircle, Ruler, Search, ShoppingBag, Sparkles, Tag } from "lucide-react";
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
    { icon: LayoutGrid, title: t("step1Title"), body: t("step1Body") },
    { icon: Search, title: t("step2Title"), body: t("step2Body") },
    { icon: MessageCircle, title: t("step3Title"), body: t("step3Body") },
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

  // Category tiles use a real listing photo as the background when one's
  // available — not an icon sitting in a colored square, which is the
  // generic SaaS-feature-card pattern this redesign is specifically
  // trying to get away from.
  const categories = [
    {
      href: "/voitures",
      icon: Car,
      name: t("catVoituresName"),
      note: t("catVoituresNote"),
      accent: "from-brand-700 to-brand-900",
      imageUrl: listings[0]?.images[0]?.url,
    },
    {
      href: "/immobilier",
      icon: Building2,
      name: t("catImmobilierName"),
      note: t("catImmobilierNote"),
      accent: "from-accent-700 to-accent-900",
      imageUrl: properties[0]?.images[0]?.url,
    },
    {
      href: "/achat-vente",
      icon: ShoppingBag,
      name: t("catAchatVenteName"),
      note: t("catAchatVenteNote"),
      accent: "from-neutral-700 to-neutral-950",
      imageUrl: items[0]?.images[0]?.url,
    },
  ];

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
      {/* Hero — a dark gradient field with a faint route arc (Paris↔Alger)
          and dot-grid texture, not a stock photo. A working search bar on
          a bright floating card is the main act — the contrast against the
          dark background is what makes it feel like a product, not a
          travel brochure. */}
      <section className="relative overflow-hidden bg-neutral-950">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 15%, rgba(33,154,97,0.35) 0%, rgba(33,154,97,0) 70%)",
          }}
        />
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden="true">
          <pattern id="dzDotGrid" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dzDotGrid)" />
        </svg>
        <svg
          className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
          viewBox="0 0 1600 700"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="dzRouteGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#43b57c" stopOpacity="0" />
              <stop offset="50%" stopColor="#5fc98f" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#e23b4e" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 160 540 Q 800 140 1440 540"
            fill="none"
            stroke="url(#dzRouteGrad)"
            strokeWidth="2"
            strokeDasharray="2 10"
            strokeLinecap="round"
          />
          <circle cx="160" cy="540" r="4" fill="#5fc98f" />
          <circle cx="160" cy="540" r="11" fill="#43b57c" opacity="0.2" />
          <circle cx="1440" cy="540" r="4" fill="#e9586a" />
          <circle cx="1440" cy="540" r="11" fill="#e23b4e" opacity="0.2" />
        </svg>
        <div className="bg-grain pointer-events-none absolute inset-0" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <HeroContent />
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

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {categories.map(({ href, icon: Icon, name, note, accent, imageUrl }, i) => (
              <Reveal key={href} delay={i * 0.08}>
                <Link
                  href={href}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[3/4]"
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt=""
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <Icon size={18} strokeWidth={2} className="absolute start-4 top-4 text-white/80" />
                  <span className="badge absolute end-4 top-4 bg-white/90 text-neutral-900 shadow-sm">
                    {t("catAvailable")}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-xl font-bold text-white">{name}</p>
                    <p className="mt-1 text-sm text-white/75">{note}</p>
                  </div>
                </Link>
              </Reveal>
            ))}

            <Reveal delay={categories.length * 0.08}>
              <div className="group relative block aspect-[4/5] overflow-hidden rounded-2xl opacity-70 sm:aspect-[3/4]">
                <div className="absolute inset-0 bg-neutral-200" />
                <Sparkles size={18} strokeWidth={2} className="absolute start-4 top-4 text-neutral-500" />
                <span className="badge-neutral absolute end-4 top-4 shadow-sm">{t("catComingSoon")}</span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xl font-bold text-neutral-700">{t("catTravailName")}</p>
                  <p className="mt-1 text-sm text-neutral-500">{t("catTravailNote")}</p>
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

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <p className="mt-4 text-lg font-semibold text-neutral-900">{title}</p>
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
