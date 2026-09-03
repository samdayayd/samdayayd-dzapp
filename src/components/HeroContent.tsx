"use client";

import { useTranslations } from "next-intl";
import { Car, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";

const textShadow = "0 1px 3px rgba(255,255,255,0.65), 0 1px 12px rgba(255,255,255,0.5)";

/** The hero text, sitting directly on the hero photo — centered, black
    headline with the brand green/red accent colors, a soft light glow
    behind it for legibility instead of a solid card (the photo itself
    gets a matching light radial scrim behind this, in page.tsx).
    `compact` shrinks it for mobile (smaller type, buttons side by side). */
export function HeroContent({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("home");

  return (
    <div className="flex w-full flex-col items-center text-center">
      <span
        className={
          "badge bg-white/70 text-brand-800 ring-1 ring-inset ring-brand-800/15 backdrop-blur-sm" +
          (compact ? " !px-2.5 !py-1 !text-[10px]" : "")
        }
      >
        <Sparkles size={13} />
        {t("badge")}
      </span>

      <h1
        className={`font-extrabold tracking-tight text-neutral-900 ${
          compact ? "mt-3 text-2xl leading-tight" : "mt-5 text-4xl leading-tight sm:text-5xl"
        }`}
        style={{ textShadow }}
      >
        {t("titleLine1")}{" "}
        <span className="text-brand-600">{t("titleFrance")}</span>{" "}
        {t("titleEt")}{" "}
        <span className="text-accent-600">{t("titleAlgerie")}</span>
      </h1>
      <p
        className={`mx-auto text-neutral-800 ${
          compact ? "mt-2 line-clamp-2 max-w-xs text-sm" : "mt-4 max-w-lg text-lg"
        }`}
        style={{ textShadow }}
      >
        {t("subtitle")}
      </p>

      <div
        className={
          compact
            ? "mt-3 flex items-center justify-center gap-2"
            : "mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        }
      >
        <Link
          href="/voitures"
          className={`btn-primary shadow-lg ${
            compact ? "!px-3 !py-1.5 !text-[11px]" : "!px-6 !py-3 !text-base"
          }`}
        >
          <Car size={compact ? 12 : 18} strokeWidth={2.5} />
          {t("ctaBrowse")}
        </Link>
        <Link
          href="/voitures/nouvelle"
          className={`btn !border !border-neutral-900/20 !bg-white/70 !text-neutral-900 backdrop-blur-sm hover:!bg-white/90 ${
            compact ? "!px-3 !py-1.5 !text-[11px]" : "!px-6 !py-3 !text-base"
          }`}
        >
          {t("ctaPublish")}
        </Link>
      </div>
    </div>
  );
}
