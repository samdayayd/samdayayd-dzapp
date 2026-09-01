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
    <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-0.5 text-xs">
      <Globe size={14} className="ms-1.5 text-neutral-400" />
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => handleChange(l)}
          className={`rounded-md px-2 py-1 font-medium transition ${
            l === locale
              ? "bg-brand-600 text-white"
              : "text-neutral-500 hover:bg-neutral-100"
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
