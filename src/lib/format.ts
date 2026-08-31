export function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatKm(km: number) {
  return `${new Intl.NumberFormat("fr-FR").format(km)} km`;
}

export const FUEL_LABELS: Record<string, string> = {
  ESSENCE: "Essence",
  DIESEL: "Diesel",
  ELECTRIQUE: "Électrique",
  HYBRIDE: "Hybride",
  GPL: "GPL",
};

export const COUNTRY_LABELS: Record<string, string> = {
  FRANCE: "France",
  ALGERIE: "Algérie",
};
