import { getLocale, getTranslations } from "next-intl/server";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  Car,
  DoorOpen,
  Fuel,
  Gauge,
  Heart,
  LayoutGrid,
  MessageCircle,
  Ruler,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { HeroContent } from "@/components/HeroContent";
import { CategoryDropdown } from "@/components/CategoryDropdown";
import { ListingCard } from "@/components/ListingCard";
import { Reveal } from "@/components/Reveal";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatKm, formatSalaryRange } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const tVoitures = await getTranslations("voitures");
  const tImmobilier = await getTranslations("immobilier");
  const tAchatVente = await getTranslations("achatVente");
  const tEmploi = await getTranslations("emploi");

  const steps = [
    { icon: LayoutGrid, title: t("step1Title"), body: t("step1Body") },
    { icon: Search, title: t("step2Title"), body: t("step2Body") },
    { icon: MessageCircle, title: t("step3Title"), body: t("step3Body") },
  ];

  const trust = [
    { icon: ShieldCheck, title: t("trust1Title"), body: t("trust1Body") },
    { icon: Tag, title: t("trust2Title"), body: t("trust2Body") },
    { icon: Zap, title: t("trust3Title"), body: t("trust3Body") },
    { icon: Sparkles, title: t("trust4Title"), body: t("trust4Body") },
  ];

  // Featured listings — a marketplace homepage has to show the actual
  // marketplace, not just describe it. Two most recent per category,
  // interleaved so one category can't crowd the others out.
  const [listings, properties, items, jobs] = await Promise.all([
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
    prisma.job.findMany({
      where: { status: "ACTIVE" },
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
    {
      href: "/emploi",
      icon: Briefcase,
      name: t("catTravailName"),
      note: t("catTravailNote"),
      accent: "from-brand-800 to-accent-700",
      imageUrl: undefined,
    },
    {
      href: "/mariage",
      icon: Heart,
      name: t("catMariageName"),
      note: t("catMariageNote"),
      accent: "from-accent-600 to-brand-800",
      // No photo here, deliberately — unlike the other tiles, which can
      // use a real listing's photo. Pulling a real member's profile
      // photo onto the public homepage would expose them to anyone
      // browsing, not just people using the matchmaking feature itself.
      imageUrl: undefined,
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
  const jobCards = jobs.map((j) => ({
    key: `job-${j.id}`,
    href: `/emploi/${j.id}`,
    imageUrl: undefined,
    title: `${j.title} — ${j.company}`,
    price: formatSalaryRange(j.salaryMin, j.salaryMax, j.currency, locale, tEmploi("salaryNotSpecified")),
    priceSuffix: undefined,
    country: tEmploi(`country.${j.country}` as "country.FRANCE"),
    city: j.city,
    categoryBadge: tEmploi("category"),
    saleBadge: j.remote ? { label: tEmploi("detail.remoteYes"), variant: "accent" as const } : undefined,
    fallbackIcon: Briefcase,
    meta: [{ icon: Briefcase, label: tEmploi(`jobType.${j.jobType}` as "jobType.CDI") }],
  }));

  // Interleave by category (round-robin) instead of a random shuffle, so
  // the section order is stable across renders rather than reshuffling
  // every time the page re-renders.
  type FeaturedCard = (typeof listingCards | typeof propertyCards | typeof itemCards | typeof jobCards)[number];
  const featured: FeaturedCard[] = [];
  const buckets: FeaturedCard[][] = [listingCards, propertyCards, itemCards, jobCards];
  for (let i = 0; i < 2; i++) {
    for (const bucket of buckets) {
      if (bucket[i]) featured.push(bucket[i]);
    }
  }

  return (
    <div className="bg-neutral-950">
      {/* Hero — a dark gradient field with a faint route arc (Paris↔Alger)
          and dot-grid texture, not a stock photo. A working search bar on
          a glass card is the main act — the contrast against the dark
          background is what makes it feel like a product. */}
      <section className="relative overflow-hidden bg-neutral-950">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 55% at 50% 15%, rgba(37,99,235,0.35) 0%, rgba(37,99,235,0) 70%)",
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
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
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
          <circle cx="160" cy="540" r="4" fill="#60a5fa" />
          <circle cx="160" cy="540" r="11" fill="#3b82f6" opacity="0.2" />
          <circle cx="1440" cy="540" r="4" fill="#22d3ee" />
          <circle cx="1440" cy="540" r="11" fill="#22d3ee" opacity="0.2" />
        </svg>
        <div className="bg-grain pointer-events-none absolute inset-0" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <HeroContent />
        </div>
      </section>

      {/* Featured listings — a marketplace homepage has to show the
          marketplace itself. Falls back to a plain "be the first" prompt
          when the database is empty rather than faking listings. */}
      <section className="border-t border-white/10 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-400">
                {t("featuredEyebrow")}
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {t("featuredTitle")}
              </h2>
            </div>
            <CategoryDropdown
              mode="browse"
              panelAlign="end"
              triggerClassName="hidden items-center gap-1 text-sm font-medium text-white/70 hover:text-white sm:flex"
            >
              {t("featuredSeeAll")}
            </CategoryDropdown>
          </Reveal>

          {featured.length === 0 ? (
            <Reveal className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
              <p className="font-medium text-white/80">{t("featuredEmptyTitle")}</p>
              <p className="mt-1 text-sm text-white/50">{t("featuredEmptyBody")}</p>
            </Reveal>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {featured.map((item, i) => (
                <Reveal key={item.key} delay={i * 0.05}>
                  <ListingCard
                    dark
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
        </div>
      </section>

      {/* Categories — photo-backed tiles with a circular icon badge and
          arrow button, not icon-in-a-colored-square feature cards. */}
      <section className="border-t border-white/10 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{t("categoriesTitle")}</h2>
              <p className="mt-1 text-white/50">{t("categoriesSubtitle")}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5">
            {categories.map(({ href, icon: Icon, name, note, accent, imageUrl }, i) => (
              <Reveal key={href} delay={i * 0.08}>
                <Link
                  href={href}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 sm:aspect-[3/4]"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                  <span className="absolute start-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                    <Icon size={15} strokeWidth={2} />
                  </span>
                  <span className="absolute end-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-sm transition group-hover:bg-white">
                    <ArrowUpRight size={15} strokeWidth={2.25} />
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-xl font-bold text-white">{name}</p>
                    <p className="mt-1 text-sm text-white/70">{note}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why DZ APP — trust grid paired with a small map/route graphic,
          replacing the plain declarative statement from earlier rounds. */}
      <section className="border-t border-white/10 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-400">{t("whyEyebrow")}</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{t("whyTitle")}</h2>
            <p className="mt-4 max-w-md text-white/60">{t("whyBody")}</p>

            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6">
              {trust.map(({ icon: Icon, title, body }) => (
                <div key={title}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-accent-400">
                    <Icon size={17} strokeWidth={1.75} />
                  </div>
                  <p className="mt-2.5 text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/50">{body}</p>
                </div>
              ))}
            </div>

            <a href="#how-it-works" className="btn-gradient mt-8 inline-flex">
              {t("whyCta")}
              <ArrowUpRight size={16} />
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
              <svg className="absolute inset-0 h-full w-full opacity-[0.08]" aria-hidden="true">
                <pattern id="dzMapDotGrid" width="22" height="22" patternUnits="userSpaceOnUse">
                  <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#dzMapDotGrid)" />
              </svg>
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 400 300"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="dzMapRouteGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <path
                  d="M 70 90 Q 200 20 330 190"
                  fill="none"
                  stroke="url(#dzMapRouteGrad)"
                  strokeWidth="2"
                  strokeDasharray="1 8"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <circle cx="70" cy="90" r="5" fill="#60a5fa" />
                <circle cx="70" cy="90" r="13" fill="#3b82f6" opacity="0.2" />
                <circle cx="330" cy="190" r="5" fill="#22d3ee" />
                <circle cx="330" cy="190" r="13" fill="#22d3ee" opacity="0.2" />
              </svg>
              <span className="absolute start-[12%] top-[26%] rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {t("mapFrance")}
              </span>
              <span className="absolute end-[10%] bottom-[28%] rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {t("mapAlgeria")}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-white/10 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-10 max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{t("howItWorksTitle")}</h2>
            <p className="mt-2 text-white/50">{t("howItWorksSubtitle")}</p>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.1}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <p className="mt-4 text-lg font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-white/10 px-4 py-16 sm:px-6">
        <Reveal className="bg-grain relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-900 to-neutral-950 px-6 py-16 text-center sm:px-16">
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
