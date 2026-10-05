"use client";

import { useTranslations } from "next-intl";
import { HeroSearch } from "./HeroSearch";

/** The hero's text + search column, sitting on the dark gradient/route
    background (see page.tsx). A working search bar is the main act —
    marketplaces lead with search, not a product-update badge. */
export function HeroContent() {
  const t = useTranslations("home");

  return (
    <div className="flex w-full flex-col items-center text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">{t("heroEyebrow")}</p>
      <h1 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
        {t("titleLine1")} <span className="text-gradient-brand">{t("titleFrance")}</span> {t("titleEt")}{" "}
        <span className="text-gradient-brand">{t("titleAlgerie")}</span>
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-base font-medium text-neutral-300 sm:text-lg">
        {t("subtitle")}
      </p>

      <div className="mt-8 w-full max-w-xl">
        <HeroSearch />
      </div>
    </div>
  );
}
