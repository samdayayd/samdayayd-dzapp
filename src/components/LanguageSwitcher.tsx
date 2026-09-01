"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

const LABELS: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  ar: "AR",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function handleChange(next: Locale) {
    router.replace(
      // @ts-expect-error -- pathname/params are dynamic across routes
      { pathname, params },
      { locale: next }
    );
  }

  return (
    <div className="relative flex items-center">
      <Globe
        size={14}
        className="pointer-events-none absolute start-2 text-neutral-400"
      />
      <select
        aria-label="Language"
        value={locale}
        onChange={(e) => handleChange(e.target.value as Locale)}
        className="cursor-pointer appearance-none rounded-lg border border-neutral-200 bg-white py-1.5 ps-7 pe-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {LABELS[l]}
          </option>
        ))}
      </select>
    </div>
  );
}
