"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { CategoryDropdown } from "./CategoryDropdown";

export function Footer() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const publishHref = pathname.startsWith("/voitures")
    ? "/voitures/nouvelle"
    : pathname.startsWith("/immobilier")
      ? "/immobilier/nouvelle"
      : null;

  return (
    <footer className="border-t border-neutral-200/70 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-neutral-500 sm:flex-row sm:px-6">
        <p>
          <span className="font-bold text-brand-700">DZ</span>
          <span className="font-bold text-accent-600">APP</span> — {t("tagline")}
        </p>
        <div className="flex items-center gap-4">
          <Link href="/voitures" className="hover:text-neutral-800">
            {t("voitures")}
          </Link>
          <Link href="/immobilier" className="hover:text-neutral-800">
            {t("immobilier")}
          </Link>
          {publishHref ? (
            <Link href={publishHref} className="hover:text-neutral-800">
              {t("publish")}
            </Link>
          ) : (
            <CategoryDropdown
              mode="post"
              chevronSize={12}
              panelAlign="end"
              triggerClassName="inline-flex items-center gap-1 hover:text-neutral-800"
            >
              {t("publish")}
            </CategoryDropdown>
          )}
        </div>
      </div>
    </footer>
  );
}
