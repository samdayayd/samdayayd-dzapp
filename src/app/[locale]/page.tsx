import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Building2,
  Car,
  MessageCircle,
  MapPin,
  MousePointerClick,
  Phone,
  SearchCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HeroContent } from "@/components/HeroContent";
import { CategoryDropdown } from "@/components/CategoryDropdown";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  const t = useTranslations("home");

  const steps = [
    { icon: MousePointerClick, title: t("step1Title"), body: t("step1Body") },
    { icon: SearchCheck, title: t("step2Title"), body: t("step2Body") },
    { icon: Phone, title: t("step3Title"), body: t("step3Body") },
  ];

  return (
    <div>
      {/* Hero — desktop/tablet: text sits directly on the photo, centered
          in the open sky/sea between the two skylines, no card — just a
          soft radial scrim behind it for legibility. Full image, no crop. */}
      <section className="relative hidden bg-neutral-900 sm:block">
        <div className="relative w-full" style={{ aspectRatio: "1672 / 941" }}>
          <Image
            src="/hero-photo-v2.png"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 34% 60% at 50% 46%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.4) 55%, rgba(255,255,255,0) 80%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center px-[30%]">
            <HeroContent />
          </div>
        </div>
      </section>

      {/* Hero — mobile: the photo's whole point is the two skylines (Paris
          left, Algiers right) either side of the couple — the old 6/5 crop
          shifted hard left to make room for the text cropped the Algiers
          side out of frame entirely. This crop is much closer to the
          photo's own ratio (1672/941 ≈ 1.78) so both sides stay visible;
          text overlays the full width, centered over the open sea gap
          between them, same as the desktop version just narrower. */}
      <section className="relative bg-neutral-900 sm:hidden">
        <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
          <Image
            src="/hero-photo-v2.png"
            alt=""
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "40% center" }}
            sizes="100vw"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 70% at 50% 46%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.45) 55%, rgba(255,255,255,0) 82%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <HeroContent compact />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-neutral-200/70 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
          {[
            { icon: MapPin, title: t("trust1Title"), body: t("trust1Body") },
            { icon: ShieldCheck, title: t("trust2Title"), body: t("trust2Body") },
            { icon: MessageCircle, title: t("trust3Title"), body: t("trust3Body") },
          ].map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.08} className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{title}</p>
                <p className="text-sm text-neutral-500">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-neutral-900">{t("howItWorksTitle")}</h2>
          <p className="mt-1 text-neutral-500">{t("howItWorksSubtitle")}</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.1} className="relative text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm">
                <Icon size={22} />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-brand-600">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 text-lg font-semibold text-neutral-900">{title}</p>
              <p className="mx-auto mt-1.5 max-w-xs text-sm text-neutral-500">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Category */}
      <section className="bg-neutral-50/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">{t("categoriesTitle")}</h2>
              <p className="mt-1 text-neutral-500">{t("categoriesSubtitle")}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/voitures", icon: Car, name: t("catVoituresName"), note: t("catVoituresNote") },
              { href: "/immobilier", icon: Building2, name: t("catImmobilierName"), note: t("catImmobilierNote") },
              { href: "/achat-vente", icon: ShoppingBag, name: t("catAchatVenteName"), note: t("catAchatVenteNote") },
            ].map(({ href, icon: Icon, name, note }, i) => (
              <Reveal key={href} delay={i * 0.08}>
                <Link
                  href={href}
                  className="card-interactive group relative flex h-full flex-col justify-between overflow-hidden p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm transition-transform group-hover:scale-105">
                    <Icon size={22} />
                  </div>
                  <div className="mt-8">
                    <p className="text-lg font-semibold text-neutral-900">{name}</p>
                    <p className="mt-1 text-sm text-neutral-500">{note}</p>
                  </div>
                  <span className="badge-brand absolute end-5 top-5">{t("catAvailable")}</span>
                </Link>
              </Reveal>
            ))}

            <Reveal delay={0.24}>
              <div className="card flex h-full flex-col justify-between p-6 opacity-60">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                  <Sparkles size={20} />
                </div>
                <div className="mt-8">
                  <p className="text-lg font-semibold text-neutral-700">{t("catTravailName")}</p>
                  <p className="mt-1 text-sm text-neutral-400">{t("catTravailNote")}</p>
                </div>
                <span className="mt-4 badge-neutral w-fit">{t("catComingSoon")}</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 px-6 py-14 text-center sm:px-16">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{t("finalCtaTitle")}</h2>
          <p className="mx-auto mt-2 max-w-md text-brand-100">{t("finalCtaBody")}</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CategoryDropdown
              mode="browse"
              triggerClassName="btn-primary !bg-white !text-brand-800 hover:!bg-brand-50 !px-6 !py-3 !text-base shadow-lg"
            >
              {t("finalCtaBrowse")}
            </CategoryDropdown>
            <CategoryDropdown
              mode="post"
              triggerClassName="btn !border !border-white/30 !bg-white/10 !text-white hover:!bg-white/20 !px-6 !py-3 !text-base backdrop-blur-sm"
            >
              {t("finalCtaPublish")}
            </CategoryDropdown>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
