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
