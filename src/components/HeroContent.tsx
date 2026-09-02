"use client";

import { useTranslations } from "next-intl";
import { Car, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";

/** The hero text, meant to sit on top of the hero photo in a dark glass
    card — `dark` picks white-on-dark colors (the only scheme used now,
    kept as a prop in case a light card is ever needed again). `compact`
    shrinks it for the mobile card (smaller type, buttons side by side). */
export function HeroContent({
  dark,
  compact = false,
}: {
  dark: boolean;
  compact?: boolean;
}) {
  const t = useTranslations("home");

  return (
    <div>
      <span
        className={
          (dark
            ? "badge bg-white/15 text-brand-50 ring-1 ring-inset ring-white/25"
            : "badge bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100") +
          (compact ? " !px-2 !py-0.5 !text-[10px]" : "")
        }
      >
        <Sparkles size={13} />
        {t("badge")}
      </span>

      <h1
        className={
          dark
            ? `font-extrabold tracking-tight text-white ${
                compact ? "mt-2.5 text-lg leading-tight" : "mt-4 text-3xl leading-tight sm:text-4xl"
              }`
            : `mt-4 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl`
        }
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
      <p
        className={
          dark
            ? `text-brand-100/90 ${compact ? "mt-1.5 line-clamp-2 text-xs" : "mt-3 text-base"}`
            : "mt-3 text-sm text-neutral-600"
        }
      >
        {t("subtitle")}
      </p>

      <div
        className={
          compact ? "mt-3 flex gap-2" : "mt-6 flex flex-col gap-2.5 sm:flex-row"
        }
      >
        <Link
          href="/voitures"
          className={
            dark
              ? `btn-primary !bg-white !text-brand-800 hover:!bg-brand-50 ${
                  compact ? "!flex-1 !px-2 !py-2 !text-xs" : ""
                }`
              : "btn-primary"
          }
        >
          <Car size={compact ? 14 : 16} strokeWidth={2.5} />
          {t("ctaBrowse")}
        </Link>
        <Link
          href="/voitures/nouvelle"
          className={
            dark
              ? `btn !border !border-white/40 !bg-white/15 !text-white hover:!bg-white/25 ${
                  compact ? "!flex-1 !px-2 !py-2 !text-xs" : ""
                }`
              : "btn-secondary"
          }
        >
          {t("ctaPublish")}
        </Link>
      </div>
    </div>
  );
}
