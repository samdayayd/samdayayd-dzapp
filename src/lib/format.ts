const NUMBER_LOCALES: Record<string, string> = {
  fr: "fr-FR",
  en: "en-US",
  ar: "ar-DZ",
};

export function formatPrice(price: number, currency: string, locale: string) {
  return new Intl.NumberFormat(NUMBER_LOCALES[locale] ?? "fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatKm(km: number, locale: string) {
  return `${new Intl.NumberFormat(NUMBER_LOCALES[locale] ?? "fr-FR").format(km)} km`;
}

/** Job postings don't always state a salary — `notSpecified` is shown
    when neither bound is set, and a single bound renders as "up to" /
    "from" rather than a confusing one-sided range. */
export function formatSalaryRange(
  min: number | null,
  max: number | null,
  currency: string,
  locale: string,
  notSpecified: string
) {
  if (!min && !max) return notSpecified;
  if (min && max) return `${formatPrice(min, currency, locale)} – ${formatPrice(max, currency, locale)}`;
  return formatPrice((min ?? max) as number, currency, locale);
}
