"use client";

import { useTranslations } from "next-intl";
import { Car, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function HeroContent({ dark }: { dark: boolean }) {
  const t = useTranslations("home");

  return (
    <div>
      <span
        className={
          dark
            ? "badge bg-white/10 text-brand-50 ring-1 ring-inset ring-white/20"
            : "badge bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100"
        }
      >
        <Sparkles size={13} />
        {t("badge")}
      </span>

      <h1
        className={`mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl ${
          dark ? "text-white" : "text-neutral-900"
        }`}
      >
        {t("titleLine1")}{" "}
        <span className={dark ? "text-brand-200" : "text-brand-600"}>
          {t("titleFrance")}
        </span>{" "}
        {t("titleEt")}{" "}
        <span className={dark ? "text-accent-400" : "text-accent-600"}>
          {t("titleAlgerie")}
        </span>
      </h1>
      <p className={`mt-3 text-sm ${dark ? "text-brand-100/90" : "text-neutral-600"}`}>
        {t("subtitle")}
      </p>

      <div className="mt-6 flex flex-col gap-2.5">
        <Link
          href="/voitures"
          className={
            dark
              ? "btn-primary !bg-white !text-brand-800 hover:!bg-brand-50"
              : "btn-primary"
          }
        >
          <Car size={16} strokeWidth={2.5} />
          {t("ctaBrowse")}
        </Link>
        <Link
          href="/voitures/nouvelle"
          className={
            dark
              ? "btn !border !border-white/30 !bg-transparent !text-white hover:!bg-white/10"
              : "btn-secondary"
          }
        >
          {t("ctaPublish")}
        </Link>
      </div>
    </div>
  );
}
