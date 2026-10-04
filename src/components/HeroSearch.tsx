"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, Car, MapPin, Search, ShoppingBag } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

type Category = "voitures" | "immobilier" | "achat-vente";

/** The hero's main act — classifieds marketplaces (Leboncoin, Idealista,
    Avito, Airbnb) lead with a working search bar, not "browse/post"
    buttons alone. Category pills (not a hidden <select>) so the three
    categories stay visible at a glance — real functionality: submitting
    routes straight into the chosen category's feed with the city filter
    already applied. */
export function HeroSearch() {
  const t = useTranslations("home");
  const router = useRouter();
  const [category, setCategory] = useState<Category>("voitures");
  const [city, setCity] = useState("");

  const categories: { value: Category; label: string; icon: typeof Car }[] = [
    { value: "voitures", label: t("catVoituresName"), icon: Car },
    { value: "immobilier", label: t("catImmobilierName"), icon: Building2 },
    { value: "achat-vente", label: t("catAchatVenteName"), icon: ShoppingBag },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = city.trim() ? `?ville=${encodeURIComponent(city.trim())}` : "";
    router.push(`/${category}${query}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl bg-white p-3 shadow-xl shadow-neutral-900/15 ring-1 ring-neutral-900/5 sm:p-4"
    >
      <p className="px-1 text-start text-[11px] font-bold uppercase tracking-wider text-neutral-400">
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
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-neutral-200 px-3.5 py-2.5">
          <MapPin size={17} className="shrink-0 text-neutral-400" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t("searchCityPlaceholder")}
            aria-label={t("searchCityLabel")}
            className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
        </div>
        <button type="submit" className="btn-primary shrink-0 !py-3">
          <Search size={17} strokeWidth={2.5} />
          {t("searchButton")}
        </button>
      </div>
    </form>
  );
}
