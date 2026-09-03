import Image from "next/image";
import { useTranslations } from "next-intl";
import { Car, MessageCircle, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HeroContent } from "@/components/HeroContent";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div>
      {/* Hero — desktop/tablet: text sits directly on the photo, centered
          in the open sky/sea between the two skylines, no card — just a
          soft radial scrim behind it for legibility. Full image, no crop. */}
      <section className="relative hidden overflow-hidden bg-neutral-900 sm:block">
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
                "radial-gradient(ellipse 32% 58% at 50% 46%, rgba(5,10,18,0.55) 0%, rgba(5,10,18,0.28) 55%, rgba(5,10,18,0) 78%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center px-[30%]">
            <HeroContent />
          </div>
        </div>
      </section>

      {/* Hero — mobile: same idea, over a taller crop of the photo shifted
          left so the couple stays in frame; text centered in the open
          space to the right of them. */}
      <section className="relative overflow-hidden bg-neutral-900 sm:hidden">
        <div className="relative w-full" style={{ aspectRatio: "6 / 5" }}>
          <Image
            src="/hero-photo-v2.png"
            alt=""
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "15% center" }}
            sizes="100vw"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 48% 60% at 66% 42%, rgba(5,10,18,0.6) 0%, rgba(5,10,18,0.32) 55%, rgba(5,10,18,0) 80%)",
            }}
          />
          <div className="absolute inset-y-0 flex items-center justify-center" style={{ left: "33%", right: "4%" }}>
            <HeroContent compact />
          </div>
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
