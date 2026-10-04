import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Building2, DoorOpen, Ruler, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ListingCard } from "@/components/ListingCard";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "immobilier" });
  return { title: t("category"), description: t("metaDescription") };
}

type SearchParams = {
  ville?: string;
  pays?: string;
  type?: string;
  bienType?: string;
  prixMin?: string;
  prixMax?: string;
};

export default async function ImmobilierPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const locale = await getLocale();
  const t = await getTranslations("immobilier");

  const properties = await prisma.property.findMany({
    where: {
      status: "ACTIVE",
      ...(params.ville ? { city: { contains: params.ville } } : {}),
      ...(params.pays ? { country: params.pays } : {}),
      ...(params.type ? { saleType: params.type } : {}),
      ...(params.bienType ? { propertyType: params.bienType } : {}),
      ...(params.prixMin || params.prixMax
        ? {
            price: {
              ...(params.prixMin ? { gte: Number(params.prixMin) } : {}),
              ...(params.prixMax ? { lte: Number(params.prixMax) } : {}),
            },
          }
        : {}),
    },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const hasFilters =
    params.ville || params.pays || params.type || params.bienType || params.prixMin || params.prixMax;

  return (
    <div>
      <div className="border-b border-neutral-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex items-center gap-2 text-brand-700">
            <Building2 size={20} strokeWidth={2.25} />
            <span className="text-sm font-semibold uppercase tracking-wide">
              {t("category")}
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {hasFilters
              ? t("resultsFound", { count: properties.length })
              : t("resultsAvailable", { count: properties.length })}
          </h1>

          <form className="mt-6 flex flex-wrap items-end gap-3">
            <div className="min-w-[160px] flex-1">
              <label className="field-label" htmlFor="ville">
                {t("filters.villeLabel")}
              </label>
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  id="ville"
                  type="text"
                  name="ville"
                  placeholder={t("filters.villePlaceholder")}
                  defaultValue={params.ville}
                  className="field-input ps-9"
                />
              </div>
            </div>

            <div className="w-40">
              <label className="field-label" htmlFor="pays">
                {t("filters.paysLabel")}
              </label>
              <select
                id="pays"
                name="pays"
                defaultValue={params.pays ?? ""}
                className="field-select"
              >
                <option value="">{t("filters.paysAll")}</option>
                <option value="FRANCE">{t("filters.france")}</option>
                <option value="ALGERIE">{t("filters.algerie")}</option>
              </select>
            </div>

            <div className="w-44">
              <label className="field-label" htmlFor="bienType">
                {t("filters.propertyTypeLabel")}
              </label>
              <select
                id="bienType"
                name="bienType"
                defaultValue={params.bienType ?? ""}
                className="field-select"
              >
                <option value="">{t("filters.propertyTypeAll")}</option>
                <option value="APPARTEMENT">{t("propertyType.APPARTEMENT")}</option>
                <option value="MAISON">{t("propertyType.MAISON")}</option>
                <option value="TERRAIN">{t("propertyType.TERRAIN")}</option>
                <option value="LOCAL">{t("propertyType.LOCAL")}</option>
              </select>
            </div>

            <div className="w-40">
              <label className="field-label" htmlFor="type">
                {t("filters.saleTypeLabel")}
              </label>
              <select
                id="type"
                name="type"
                defaultValue={params.type ?? ""}
                className="field-select"
              >
                <option value="">{t("filters.saleTypeAll")}</option>
                <option value="VENTE">{t("saleType.VENTE")}</option>
                <option value="LOCATION">{t("saleType.LOCATION")}</option>
              </select>
            </div>

            <div className="w-28">
              <label className="field-label" htmlFor="prixMin">
                {t("filters.prixMinLabel")}
              </label>
              <input
                id="prixMin"
                type="number"
                name="prixMin"
                placeholder="0"
                defaultValue={params.prixMin}
                className="field-input"
              />
            </div>

            <div className="w-28">
              <label className="field-label" htmlFor="prixMax">
                {t("filters.prixMaxLabel")}
              </label>
              <input
                id="prixMax"
                type="number"
                name="prixMax"
                placeholder="∞"
                defaultValue={params.prixMax}
                className="field-input"
              />
            </div>

            <button type="submit" className="btn-primary h-[42px]">
              <Search size={16} strokeWidth={2.5} />
              {t("filters.search")}
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {properties.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
              <Building2 size={26} />
            </div>
            <p className="font-medium text-neutral-700">{t("empty.title")}</p>
            <p className="text-sm text-neutral-500">{t("empty.body")}</p>
            <Link href="/immobilier/nouvelle" className="btn-primary mt-2">
              {t("empty.cta")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <ListingCard
                key={property.id}
                href={`/immobilier/${property.id}`}
                imageUrl={property.images[0]?.url}
                imageAlt={property.title}
                fallbackIcon={Building2}
                title={property.title}
                price={formatPrice(property.price, property.currency, locale)}
                priceSuffix={property.saleType === "LOCATION" ? t("perMonth") : undefined}
                country={t(`country.${property.country}` as "country.FRANCE")}
                city={property.city}
                saleBadge={{
                  label: t(`saleType.${property.saleType}` as "saleType.VENTE"),
                  variant: property.saleType === "LOCATION" ? "accent" : "brand",
                }}
                meta={[
                  { icon: Building2, label: t(`propertyType.${property.propertyType}` as "propertyType.APPARTEMENT") },
                  { icon: DoorOpen, label: String(property.rooms) },
                  { icon: Ruler, label: `${property.surfaceM2} m²` },
                ]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
