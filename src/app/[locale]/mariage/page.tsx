import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Heart, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ProfileCard } from "@/components/ProfileCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mariage" });
  return { title: t("category"), description: t("metaDescription") };
}

type SearchParams = {
  q?: string;
  ville?: string;
  pays?: string;
  genre?: string;
};

export default async function MariagePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const t = await getTranslations("mariage");

  // Contact fields are deliberately left out of this select — browsing
  // the feed should never be able to see them, match or no match.
  const profiles = await prisma.marriageProfile.findMany({
    where: {
      status: "ACTIVE",
      ...(params.q ? { displayName: { contains: params.q } } : {}),
      ...(params.ville ? { city: { contains: params.ville } } : {}),
      ...(params.pays ? { country: params.pays } : {}),
      ...(params.genre ? { gender: params.genre } : {}),
    },
    select: {
      id: true,
      displayName: true,
      age: true,
      city: true,
      country: true,
      religiousPractice: true,
      bio: true,
      photoUrl: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const hasFilters = params.q || params.ville || params.pays || params.genre;

  return (
    <div>
      <div className="border-b border-neutral-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex items-center gap-2 text-brand-700">
            <Heart size={20} strokeWidth={2.25} />
            <span className="text-sm font-semibold uppercase tracking-wide">{t("category")}</span>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {hasFilters
              ? t("resultsFound", { count: profiles.length })
              : t("resultsAvailable", { count: profiles.length })}
          </h1>

          <form className="mt-6 flex flex-wrap items-end gap-3">
            <div className="min-w-[200px] flex-1">
              <label className="field-label" htmlFor="q">
                {t("filters.queryLabel")}
              </label>
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  id="q"
                  type="text"
                  name="q"
                  placeholder={t("filters.queryPlaceholder")}
                  defaultValue={params.q}
                  className="field-input ps-9"
                />
              </div>
            </div>

            <div className="min-w-[160px] flex-1">
              <label className="field-label" htmlFor="ville">
                {t("filters.villeLabel")}
              </label>
              <input
                id="ville"
                type="text"
                name="ville"
                placeholder={t("filters.villePlaceholder")}
                defaultValue={params.ville}
                className="field-input"
              />
            </div>

            <div className="w-40">
              <label className="field-label" htmlFor="pays">
                {t("filters.paysLabel")}
              </label>
              <select id="pays" name="pays" defaultValue={params.pays ?? ""} className="field-select">
                <option value="">{t("filters.paysAll")}</option>
                <option value="FRANCE">{t("filters.france")}</option>
                <option value="ALGERIE">{t("filters.algerie")}</option>
              </select>
            </div>

            <div className="w-40">
              <label className="field-label" htmlFor="genre">
                {t("filters.genreLabel")}
              </label>
              <select id="genre" name="genre" defaultValue={params.genre ?? ""} className="field-select">
                <option value="">{t("filters.genreAll")}</option>
                <option value="HOMME">{t("gender.HOMME")}</option>
                <option value="FEMME">{t("gender.FEMME")}</option>
              </select>
            </div>

            <button type="submit" className="btn-primary h-[42px]">
              <Search size={16} strokeWidth={2.5} />
              {t("filters.search")}
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {profiles.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
              <Heart size={26} />
            </div>
            <p className="font-medium text-neutral-700">{t("empty.title")}</p>
            <p className="text-sm text-neutral-500">{t("empty.body")}</p>
            <Link href="/mariage/nouvelle" className="btn-primary mt-2">
              {t("empty.cta")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                href={`/mariage/${profile.id}`}
                photoUrl={profile.photoUrl}
                displayName={profile.displayName}
                age={profile.age}
                city={profile.city}
                country={t(`country.${profile.country}` as "country.FRANCE")}
                practiceBadge={t(`religiousPractice.${profile.religiousPractice}` as "religiousPractice.PRATIQUANT")}
                bioExcerpt={profile.bio}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
