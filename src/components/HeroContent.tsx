"use client";

import { useTranslations } from "next-intl";
import { Search, ShieldCheck, Sparkles } from "lucide-react";
import { CategoryDropdown } from "./CategoryDropdown";

/** The hero's text column — left side of the new asymmetric hero (the
    product-preview card stack sits on the right, see page.tsx). No more
    text-over-photo: plain flow, left-aligned, so it reads as a normal
    confident headline instead of something fighting an image for
    legibility. */
export function HeroContent() {
  const t = useTranslations("home");

  return (
    <div className="max-w-xl">
      <span className="badge-brand">
        <Sparkles size={13} />
        {t("badge")}
      </span>

      <h1 className="mt-5 text-5xl font-bold leading-[0.98] tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
        {t("titleLine1")} <span className="text-brand-600">{t("titleFrance")}</span> {t("titleEt")}{" "}
        <span className="text-accent-600">{t("titleAlgerie")}</span>
      </h1>

      <p className="mt-6 max-w-md text-lg text-neutral-600">{t("subtitle")}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <CategoryDropdown mode="browse" chevronSize={15} triggerClassName="btn-primary !px-7 !py-3.5 !text-base">
          <Search size={18} strokeWidth={2.5} />
          {t("ctaBrowse")}
        </CategoryDropdown>
        <CategoryDropdown mode="post" chevronSize={15} triggerClassName="btn-secondary !px-7 !py-3.5 !text-base">
          {t("ctaPublish")}
        </CategoryDropdown>
      </div>

      <div className="mt-7 flex items-center gap-2 text-sm text-neutral-500">
        <ShieldCheck size={16} className="shrink-0 text-brand-600" />
        {t("trust2Body")}
      </div>
    </div>
  );
}
