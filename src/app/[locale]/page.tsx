import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  BadgePercent,
  Car,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HeroContent } from "@/components/HeroContent";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div>
      {/* Hero — desktop/tablet: photo with text in its built-in blank column */}
      <section className="relative hidden overflow-hidden bg-white sm:block">
        <div className="relative w-full" style={{ aspectRatio: "1672 / 941" }}>
          <Image
            src="/hero-photo.png"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-y-0 flex items-start"
            style={{ left: "34%", width: "32%", paddingTop: "13%" }}
          >
            <HeroContent dark={false} />
          </div>
          <HeroPhotoBand t={t} />
        </div>
      </section>

      {/* Hero — mobile: no separate text block above the photo anymore — the
          whole hero text sits directly on top of it, like the desktop
          version, with a dark scrim behind it for legibility (the photo's
          own blank column is too narrow to hold the full text at this
          width). The text overlay is absolutely positioned so it can't
          push the photo taller and collide with the icon band below. */}
      <section className="relative overflow-hidden bg-brand-900 sm:hidden">
        <div className="relative w-full" style={{ aspectRatio: "6 / 5" }}>
          <Image
            src="/hero-photo.png"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-x-0 top-0"
            style={{
              height: "82%",
              background:
                "linear-gradient(to bottom, rgba(10,61,41,0.88) 0%, rgba(10,61,41,0.74) 55%, rgba(10,61,41,0.6) 85%, rgba(10,61,41,0) 100%)",
            }}
          />
          <div className="absolute inset-x-0 top-0 px-4 pt-4">
            <HeroContent dark />
          </div>
          <HeroPhotoBand t={t} />
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-neutral-200/70 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">{t("trust1Title")}</p>
              <p className="text-sm text-neutral-500">{t("trust1Body")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">{t("trust2Title")}</p>
              <p className="text-sm text-neutral-500">{t("trust2Body")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <MessageCircle size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">{t("trust3Title")}</p>
              <p className="text-sm text-neutral-500">{t("trust3Body")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">{t("categoriesTitle")}</h2>
            <p className="mt-1 text-neutral-500">{t("categoriesSubtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/voitures"
            className="card group relative flex flex-col justify-between overflow-hidden p-6 transition hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
              <Car size={22} />
            </div>
            <div className="mt-8">
              <p className="text-lg font-semibold text-neutral-900">{t("catVoituresName")}</p>
              <p className="mt-1 text-sm text-neutral-500">{t("catVoituresNote")}</p>
            </div>
            <span className="badge-brand absolute end-5 top-5">{t("catAvailable")}</span>
          </Link>

          {[
            { name: t("catImmobilierName"), note: t("catImmobilierNote") },
            { name: t("catTravailName"), note: t("catTravailNote") },
          ].map((cat) => (
            <div
              key={cat.name}
              className="card flex flex-col justify-between p-6 opacity-60"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                <Sparkles size={20} />
              </div>
              <div className="mt-8">
                <p className="text-lg font-semibold text-neutral-700">{cat.name}</p>
                <p className="mt-1 text-sm text-neutral-400">{cat.note}</p>
              </div>
              <span className="mt-4 badge-neutral w-fit">{t("catComingSoon")}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Icon + short text row, placed over the photo's solid navy footer band
    (below the two people, above the flags). Shared by the desktop and
    mobile hero variants, which both show that band at the same height. */
function HeroPhotoBand({ t }: { t: ReturnType<typeof useTranslations<"home">> }) {
  const items = [
    { icon: MapPin, text: t("trust1Title") },
    { icon: BadgePercent, text: t("trust2Title") },
    { icon: Zap, text: t("trust3Title") },
  ];

  return (
    <div
      className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 overflow-x-auto px-1.5 [scrollbar-width:none] sm:gap-10 sm:px-6 [&::-webkit-scrollbar]:hidden"
      style={{ top: "81%" }}
    >
      {items.map(({ icon: Icon, text }) => (
        <div
          key={text}
          className="flex shrink-0 items-center gap-1 whitespace-nowrap text-white sm:gap-2"
        >
          <Icon size={11} strokeWidth={2.5} className="shrink-0 sm:hidden" />
          <Icon size={16} strokeWidth={2.5} className="hidden shrink-0 sm:block" />
          <span className="text-[9px] font-semibold sm:text-sm">{text}</span>
        </div>
      ))}
    </div>
  );
}
