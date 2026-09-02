import { useTranslations } from "next-intl";
import { Car, MapPin, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PartnershipEmblem } from "@/components/PartnershipEmblem";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-900">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 78% 45%, rgba(201,162,75,0.16), transparent 55%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-6">
          <div>
            <span className="badge bg-white/10 text-brand-50 ring-1 ring-inset ring-white/20">
              <Sparkles size={13} />
              {t("badge")}
            </span>

            <h1 className="mt-5 max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {t("titleLine1")}{" "}
              <span className="text-brand-200">{t("titleFrance")}</span>{" "}
              {t("titleEt")}{" "}
              <span className="text-accent-400">{t("titleAlgerie")}</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-brand-100/90">{t("subtitle")}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/voitures" className="btn-primary !bg-white !text-brand-800 hover:!bg-brand-50">
                <Car size={17} strokeWidth={2.5} />
                {t("ctaBrowse")}
              </Link>
              <Link
                href="/voitures/nouvelle"
                className="btn !border !border-white/30 !bg-transparent !text-white hover:!bg-white/10"
              >
                {t("ctaPublish")}
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PartnershipEmblem className="w-full max-w-sm sm:max-w-md" />
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
