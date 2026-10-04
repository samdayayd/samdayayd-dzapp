"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, Car, MapPin, Search, ShoppingBag } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

type Category = "voitures" | "immobilier" | "achat-vente";

/** The hero's main act — classifieds marketplaces (Leboncoin, Idealista,
    Avito, Airbnb) lead with a working search bar, not "browse/post"
    buttons alone; that's the pattern a SaaS-style hero was missing
    entirely. Real functionality: routes straight into the chosen
    category's feed with the city filter already applied — not a
    decorative mockup. */
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
      className="flex w-full flex-col gap-2 rounded-2xl bg-white p-2 shadow-xl shadow-neutral-900/10 ring-1 ring-neutral-900/5 sm:flex-row sm:gap-0 sm:rounded-full sm:p-2"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2 sm:border-e sm:border-neutral-200">
        <span className="text-brand-600">
          {(() => {
            const Icon = categories.find((c) => c.value === category)?.icon ?? Car;
            return <Icon size={18} />;
          })()}
        </span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          aria-label={t("searchCategoryLabel")}
          className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-neutral-900 outline-none"
        >
          {categories.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2">
        <MapPin size={18} className="shrink-0 text-neutral-400" />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t("searchCityPlaceholder")}
          aria-label={t("searchCityLabel")}
          className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
        />
      </div>

      <button type="submit" className="btn-primary shrink-0 !rounded-xl sm:!rounded-full">
        <Search size={17} strokeWidth={2.5} />
        {t("searchButton")}
      </button>
    </form>
  );
}
