"use client";

import { useTranslations } from "next-intl";
import { Building2, Car, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HeroSearch } from "./HeroSearch";

const textShadow = "0 1px 3px rgba(255,255,255,0.7), 0 2px 16px rgba(255,255,255,0.55)";

/** The hero's text + search column, sitting on the photo (see page.tsx
    for the image/scrim). A working search bar is the main act here —
    marketplaces (Leboncoin, Idealista, Airbnb) lead with search, not
    "browse/post" buttons alone. `compact` shrinks it for mobile. */
export function HeroContent({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("home");

  const quickLinks = [
    { href: "/voitures", label: t("catVoituresName"), icon: Car },
    { href: "/immobilier", label: t("catImmobilierName"), icon: Building2 },
    { href: "/achat-vente", label: t("catAchatVenteName"), icon: ShoppingBag },
  ];

  return (
    <div className="flex w-full flex-col items-center text-center">
      <span
        className={
          "badge bg-white/80 text-brand-800 ring-1 ring-inset ring-brand-800/15 backdrop-blur-sm" +
          (compact ? " !px-2.5 !py-1 !text-[10px]" : "")
        }
      >
        <Sparkles size={13} />
        {t("badge")}
      </span>

      <h1
        className={`font-bold leading-[1.02] tracking-tight text-neutral-900 ${
          compact ? "mt-3 text-3xl" : "mt-5 text-5xl sm:text-6xl"
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

      <div
        className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-medium text-neutral-700 ${
          compact ? "mt-4 text-xs" : "mt-6 text-sm"
        }`}
        style={{ textShadow }}
      >
        {quickLinks.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex items-center gap-1.5 hover:text-brand-700">
            <Icon size={compact ? 13 : 15} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
