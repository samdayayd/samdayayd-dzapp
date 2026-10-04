import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import "../globals.css";
import { Providers } from "@/components/Providers";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { routing, RTL_LOCALES, type Locale } from "@/i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const title = "DZ APP";
  const description = t("subtitle");

  return {
    // NEXTAUTH_URL is already a required env var pointing at the real
    // deployed URL (see render.yaml) — reused here instead of adding a
    // second URL var that could drift out of sync with it.
    metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
    title: { default: title, template: `%s — ${title}` },
    description,
    openGraph: {
      title,
      description,
      siteName: title,
      locale,
      type: "website",
      images: [{ url: "/hero-photo-v2.png", width: 1672, height: 941 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/hero-photo-v2.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = RTL_LOCALES.includes(locale as Locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <NavBar />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
