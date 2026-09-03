"use client";

import { useTranslations } from "next-intl";
import { Car, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";

const textShadow = "0 2px 16px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.4)";

/** The hero text, sitting directly on the hero photo — centered, white,
    with a soft drop shadow for legibility instead of a solid card (the
    photo itself gets a soft radial scrim behind this, in page.tsx).
    `compact` shrinks it for mobile (smaller type, buttons side by side). */
export function HeroContent({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("home");

  return (
    <div className="flex w-full flex-col items-center text-center">
      <span
        className={
          "badge bg-white/15 text-brand-50 ring-1 ring-inset ring-white/30 backdrop-blur-sm" +
          (compact ? " !px-2.5 !py-1 !text-[10px]" : "")
        }
      >
        <Sparkles size={13} />
        {t("badge")}
      </span>

      <h1
        className={`font-extrabold tracking-tight text-white ${
          compact ? "mt-3 text-2xl leading-tight" : "mt-5 text-4xl leading-tight sm:text-5xl"
        }`}
        style={{ textShadow }}
      >
        {t("titleLine1")}{" "}
        <span className="text-brand-200">{t("titleFrance")}</span>{" "}
        {t("titleEt")}{" "}
        <span className="text-accent-400">{t("titleAlgerie")}</span>
      </h1>
      <p
        className={`mx-auto text-brand-50/95 ${
          compact ? "mt-2 line-clamp-2 max-w-xs text-sm" : "mt-4 max-w-lg text-lg"
        }`}
        style={{ textShadow }}
      >
        {t("subtitle")}
      </p>

      <div
        className={
          compact
            ? "mt-4 flex w-full gap-2"
            : "mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        }
      >
        <Link
          href="/voitures"
          className={`btn-primary !bg-white !text-brand-800 shadow-lg hover:!bg-brand-50 ${
            compact ? "!flex-1 !px-2 !py-2 !text-xs" : "!px-6 !py-3 !text-base"
          }`}
        >
          <Car size={compact ? 14 : 18} strokeWidth={2.5} />
          {t("ctaBrowse")}
        </Link>
        <Link
          href="/voitures/nouvelle"
          className={`btn !border !border-white/50 !bg-white/10 !text-white backdrop-blur-sm hover:!bg-white/20 ${
            compact ? "!flex-1 !px-2 !py-2 !text-xs" : "!px-6 !py-3 !text-base"
          }`}
        >
          {t("ctaPublish")}
        </Link>
      </div>
    </div>
  );
}
