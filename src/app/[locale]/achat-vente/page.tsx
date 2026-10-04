import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Search, ShoppingBag, Tag } from "lucide-react";
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
  const t = await getTranslations({ locale, namespace: "achatVente" });
  return { title: t("category"), description: t("metaDescription") };
}

type SearchParams = {
  ville?: string;
  pays?: string;
  categorie?: string;
  etat?: string;
  prixMin?: string;
  prixMax?: string;
};

export default async function AchatVentePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const locale = await getLocale();
  const t = await getTranslations("achatVente");

  const items = await prisma.item.findMany({
    where: {
      status: "ACTIVE",
      ...(params.ville ? { city: { contains: params.ville } } : {}),
      ...(params.pays ? { country: params.pays } : {}),
      ...(params.categorie ? { itemCategory: params.categorie } : {}),
      ...(params.etat ? { condition: params.etat } : {}),
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
    params.ville || params.pays || params.categorie || params.etat || params.prixMin || params.prixMax;

  return (
    <div>
      <div className="border-b border-neutral-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex items-center gap-2 text-brand-700">
            <ShoppingBag size={20} strokeWidth={2.25} />
            <span className="text-sm font-semibold uppercase tracking-wide">
              {t("category")}
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {hasFilters
              ? t("resultsFound", { count: items.length })
              : t("resultsAvailable", { count: items.length })}
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
              <label className="field-label" htmlFor="categorie">
                {t("filters.categoryLabel")}
              </label>
              <select
                id="categorie"
                name="categorie"
                defaultValue={params.categorie ?? ""}
                className="field-select"
              >
                <option value="">{t("filters.categoryAll")}</option>
                <option value="ELECTRONIQUE">{t("itemCategory.ELECTRONIQUE")}</option>
                <option value="MEUBLE">{t("itemCategory.MEUBLE")}</option>
                <option value="VETEMENTS">{t("itemCategory.VETEMENTS")}</option>
                <option value="LOISIRS">{t("itemCategory.LOISIRS")}</option>
                <option value="MAISON">{t("itemCategory.MAISON")}</option>
                <option value="AUTRE">{t("itemCategory.AUTRE")}</option>
              </select>
            </div>

            <div className="w-40">
              <label className="field-label" htmlFor="etat">
                {t("filters.conditionLabel")}
              </label>
              <select
                id="etat"
                name="etat"
                defaultValue={params.etat ?? ""}
                className="field-select"
              >
                <option value="">{t("filters.conditionAll")}</option>
                <option value="NEUF">{t("condition.NEUF")}</option>
                <option value="OCCASION">{t("condition.OCCASION")}</option>
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
        {items.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
              <ShoppingBag size={26} />
            </div>
            <p className="font-medium text-neutral-700">{t("empty.title")}</p>
            <p className="text-sm text-neutral-500">{t("empty.body")}</p>
            <Link href="/achat-vente/nouvelle" className="btn-primary mt-2">
              {t("empty.cta")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ListingCard
                key={item.id}
                href={`/achat-vente/${item.id}`}
                imageUrl={item.images[0]?.url}
                imageAlt={item.title}
                fallbackIcon={ShoppingBag}
                title={item.title}
                price={formatPrice(item.price, item.currency, locale)}
                country={t(`country.${item.country}` as "country.FRANCE")}
                city={item.city}
                saleBadge={{
                  label: t(`condition.${item.condition}` as "condition.NEUF"),
                  variant: item.condition === "NEUF" ? "brand" : "accent",
                }}
                meta={[{ icon: Tag, label: t(`itemCategory.${item.itemCategory}` as "itemCategory.ELECTRONIQUE") }]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
