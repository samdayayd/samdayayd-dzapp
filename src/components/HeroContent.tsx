"use client";

import { useTranslations } from "next-intl";
import { HeroSearch } from "./HeroSearch";

const textShadow = "0 1px 3px rgba(255,255,255,0.7), 0 2px 16px rgba(255,255,255,0.55)";

/** The hero's text + search column, sitting on the photo (see page.tsx
    for the image/scrim). A working search bar is the main act here —
    marketplaces (Leboncoin, Idealista, Airbnb) lead with search, not a
    product-update-style "New" badge and "browse/post" buttons.
    `compact` shrinks it for mobile. */
export function HeroContent({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("home");

  return (
    <div className="flex w-full flex-col items-center text-center">
      <h1
        className={`font-bold leading-[1.02] tracking-tight text-neutral-900 ${
          compact ? "text-3xl" : "text-5xl sm:text-6xl"
        }`}
        style={{ textShadow }}
      >
        {t("titleLine1")} <span className="text-brand-600">{t("titleFrance")}</span> {t("titleEt")}{" "}
        <span className="text-accent-600">{t("titleAlgerie")}</span>
      </h1>
      <p
        className={`mx-auto font-medium text-neutral-800 ${
          compact ? "mt-2 line-clamp-2 max-w-xs text-sm" : "mt-4 max-w-lg text-lg"
        }`}
        style={{ textShadow }}
      >
        {t("subtitle")}
      </p>

      <div className={compact ? "mt-5 w-full max-w-xs" : "mt-8 w-full max-w-xl"}>
        <HeroSearch />
      </div>
    </div>
  );
}
