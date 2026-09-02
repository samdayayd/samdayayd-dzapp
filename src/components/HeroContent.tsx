"use client";

import { useTranslations } from "next-intl";
import { Car, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";

/** `dark` is used to overlay this on top of the hero photo (mobile — the
    photo has no room for the desktop-sized version, so that variant is
    also more compact: smaller type, buttons side by side). */
export function HeroContent({ dark }: { dark: boolean }) {
  const t = useTranslations("home");

  return (
    <div>
      <span
        className={
          dark
            ? "badge !px-2 !py-0.5 !text-[10px] bg-white/15 text-brand-50 ring-1 ring-inset ring-white/25 backdrop-blur-sm"
            : "badge bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100"
        }
      >
        <Sparkles size={13} />
        {t("badge")}
      </span>

      <h1
        className={
          dark
            ? "mt-2.5 text-lg font-extrabold leading-tight tracking-tight text-white"
            : "mt-4 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl"
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
            ? "mt-1.5 line-clamp-2 text-xs text-brand-100/90"
            : "mt-3 text-sm text-neutral-600"
        }
      >
        {t("subtitle")}
      </p>

      <div className={dark ? "mt-3 flex gap-2" : "mt-6 flex flex-col gap-2.5"}>
        <Link
          href="/voitures"
          className={
            dark
              ? "btn-primary !flex-1 !bg-white !px-2 !py-2 !text-xs !text-brand-800 hover:!bg-brand-50"
              : "btn-primary"
          }
        >
          <Car size={dark ? 14 : 16} strokeWidth={2.5} />
          {t("ctaBrowse")}
        </Link>
        <Link
          href="/voitures/nouvelle"
          className={
            dark
              ? "btn !flex-1 !border !border-white/40 !bg-white/15 !px-2 !py-2 !text-xs !text-white backdrop-blur-sm hover:!bg-white/25"
              : "btn-secondary"
          }
        >
          {t("ctaPublish")}
        </Link>
      </div>
    </div>
  );
}
