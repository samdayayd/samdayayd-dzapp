"use client";

import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { CategoryDropdown } from "./CategoryDropdown";
import { LanguageSwitcher } from "./LanguageSwitcher";

const CATEGORY_PREFIXES = ["/voitures", "/immobilier", "/achat-vente"];

/** Three columns, nothing invented: categories that exist, country
    browsing that exists (via the `pays` filter), and the language
    switcher. No newsletter form or social links — DZ APP doesn't have
    either, and a footer form that submits nowhere is worse than no
    form at all. */
export function Footer() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const currentCategory = CATEGORY_PREFIXES.find((p) => pathname.startsWith(p));
  const publishHref = currentCategory ? `${currentCategory}/nouvelle` : null;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-neutral-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div className="max-w-xs">
            <Link href="/" dir="ltr" className="flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 text-white">
                <Sparkles size={14} strokeWidth={2.5} />
              </span>
              <span className="flex items-center gap-1 text-lg font-extrabold tracking-tight">
                <span className="text-white">DZ</span>
                <span className="text-accent-400">APP</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-white/50">{t("tagline")}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
              {t("categoriesHeading")}
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-white/70">
              <Link href="/voitures" className="w-fit hover:text-white">
                {t("voitures")}
              </Link>
              <Link href="/immobilier" className="w-fit hover:text-white">
                {t("immobilier")}
              </Link>
              <Link href="/achat-vente" className="w-fit hover:text-white">
                {t("achatVente")}
              </Link>
              {publishHref ? (
                <Link href={publishHref} className="w-fit hover:text-white">
                  {t("publish")}
                </Link>
              ) : (
                <CategoryDropdown
                  mode="post"
                  chevronSize={12}
                  panelAlign="start"
                  triggerClassName="inline-flex w-fit items-center gap-1 hover:text-white"
                >
                  {t("publish")}
                </CategoryDropdown>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
              {t("countriesHeading")}
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-white/70">
              <Link href="/voitures?pays=FRANCE" className="w-fit hover:text-white">
                {t("france")}
              </Link>
              <Link href="/voitures?pays=ALGERIE" className="w-fit hover:text-white">
                {t("algeria")}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} DZ APP.</p>
          <LanguageSwitcher dark />
        </div>
      </div>
    </footer>
  );
}
