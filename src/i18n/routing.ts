import { defineRouting } from "next-intl/routing";

export const locales = ["fr", "en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "fr",
  // French (the default/primary audience) stays at bare paths like
  // /voitures; only /en and /ar get a prefix. Also keeps NextAuth's
  // static `pages.signIn: "/login"` pointing at a real route.
  localePrefix: "as-needed",
});

export const RTL_LOCALES: readonly Locale[] = ["ar"];
