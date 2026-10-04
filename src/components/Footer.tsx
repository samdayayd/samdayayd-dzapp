"use client";

import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { CategoryDropdown } from "./CategoryDropdown";

const CATEGORY_PREFIXES = ["/voitures", "/immobilier", "/achat-vente"];

export function Footer() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const currentCategory = CATEGORY_PREFIXES.find((p) => pathname.startsWith(p));
  const publishHref = currentCategory ? `${currentCategory}/nouvelle` : null;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200/70 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Link href="/" dir="ltr" className="flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 text-white">
                <Sparkles size={14} strokeWidth={2.5} />
              </span>
              <span className="flex items-center gap-1 text-lg font-extrabold tracking-tight">
                <span className="text-brand-700">DZ</span>
                <span className="text-accent-600">APP</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-neutral-500">{t("tagline")}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t("categoriesHeading")}</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
              <Link href="/voitures" className="w-fit hover:text-brand-700">
                {t("voitures")}
              </Link>
              <Link href="/immobilier" className="w-fit hover:text-brand-700">
                {t("immobilier")}
              </Link>
              <Link href="/achat-vente" className="w-fit hover:text-brand-700">
                {t("achatVente")}
              </Link>
              {publishHref ? (
                <Link href={publishHref} className="w-fit hover:text-brand-700">
                  {t("publish")}
                </Link>
              ) : (
                <CategoryDropdown
                  mode="post"
                  chevronSize={12}
                  panelAlign="start"
                  triggerClassName="inline-flex w-fit items-center gap-1 hover:text-brand-700"
                >
                  {t("publish")}
                </CategoryDropdown>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-100 pt-6 text-xs text-neutral-400">
          © {year} DZ APP.
        </div>
      </div>
    </footer>
  );
}
