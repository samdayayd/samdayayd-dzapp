"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, Car, MapPin, Search, ShoppingBag } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

type Category = "voitures" | "immobilier" | "achat-vente";
type Country = "" | "FRANCE" | "ALGERIE";

/** The hero's main act — classifieds marketplaces lead with a working
    search bar, not "browse/post" buttons alone. Category pills pick the
    feed to search; the text field does a real keyword search (title
    match) against that feed, and the country field reuses the `pays`
    filter every feed page already supports. */
export function HeroSearch() {
  const t = useTranslations("home");
  const router = useRouter();
  const [category, setCategory] = useState<Category>("voitures");
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<Country>("");

  const categories: { value: Category; label: string; icon: typeof Car }[] = [
    { value: "voitures", label: t("catVoituresName"), icon: Car },
    { value: "immobilier", label: t("catImmobilierName"), icon: Building2 },
    { value: "achat-vente", label: t("catAchatVenteName"), icon: ShoppingBag },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (country) params.set("pays", country);
    const qs = params.toString();
    router.push(`/${category}${qs ? `?${qs}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-white/15 bg-white/10 p-3 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-4"
    >
      <p className="px-1 text-start text-[11px] font-bold uppercase tracking-wider text-white/50">
        {t("searchWhatLabel")}
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {categories.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setCategory(value)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
              category === value
                ? "bg-gradient-to-r from-brand-600 to-accent-500 text-white shadow-sm"
                : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5">
          <Search size={17} className="shrink-0 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchQueryPlaceholder")}
            aria-label={t("searchQueryPlaceholder")}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
          />
        </div>
        <div className="relative flex shrink-0 items-center sm:w-48">
          <MapPin size={17} className="pointer-events-none absolute start-3.5 text-white/40" />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as Country)}
            aria-label={t("searchCountryLabel")}
            className="w-full cursor-pointer appearance-none rounded-xl border border-white/15 bg-white/5 py-2.5 ps-10 pe-3 text-sm text-white outline-none"
          >
            <option value="" className="text-neutral-900">
              {t("countryAll")}
            </option>
            <option value="FRANCE" className="text-neutral-900">
              {t("countryFrance")}
            </option>
            <option value="ALGERIE" className="text-neutral-900">
              {t("countryAlgeria")}
            </option>
          </select>
        </div>
        <button type="submit" className="btn-gradient shrink-0 !py-3">
          <Search size={17} strokeWidth={2.5} />
          {t("searchButton")}
        </button>
      </div>
    </form>
  );
}
