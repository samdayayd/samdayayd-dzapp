import Link from "next/link";
import {
  Car,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-800">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.10), transparent 40%), radial-gradient(circle at 85% 75%, rgba(226,59,78,0.35), transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <span className="badge bg-white/10 text-brand-50 ring-1 ring-inset ring-white/20">
            <Sparkles size={13} />
            Nouveau — annonces Voitures en avant-première
          </span>

          <h1 className="mt-5 max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Tout en un seul endroit,{" "}
            <span className="text-brand-200">entre la France</span> et{" "}
            <span className="text-accent-400">l&apos;Algérie</span>.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-brand-100/90">
            La plateforme d&apos;annonces pensée pour la diaspora — voitures,
            immobilier, emploi et bien plus, bientôt réunis au même endroit.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/voitures" className="btn-primary !bg-white !text-brand-800 hover:!bg-brand-50">
              <Car size={17} strokeWidth={2.5} />
              Voir les annonces Voitures
            </Link>
            <Link
              href="/voitures/nouvelle"
              className="btn !border !border-white/30 !bg-transparent !text-white hover:!bg-white/10"
            >
              Publier une annonce
            </Link>
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
              <p className="text-sm font-semibold text-neutral-900">
                France &amp; Algérie
              </p>
              <p className="text-sm text-neutral-500">
                Des annonces des deux côtés de la Méditerranée.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                100% gratuit pour publier
              </p>
              <p className="text-sm text-neutral-500">
                Aucune commission sur vos annonces.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <MessageCircle size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                Simple et rapide
              </p>
              <p className="text-sm text-neutral-500">
                Publiez une annonce en quelques minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Catégories</h2>
            <p className="mt-1 text-neutral-500">
              On commence par Voitures — les autres arrivent bientôt.
            </p>
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
              <p className="text-lg font-semibold text-neutral-900">Voitures</p>
              <p className="mt-1 text-sm text-neutral-500">
                Achat, vente, toutes marques
              </p>
            </div>
            <span className="absolute right-5 top-5 badge-brand">Disponible</span>
          </Link>

          {[
            { name: "Immobilier", note: "Vente, location" },
            { name: "Travail", note: "Chercher ou proposer" },
          ].map((cat) => (
            <div
              key={cat.name}
              className="card flex flex-col justify-between p-6 opacity-60"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                <Sparkles size={20} />
              </div>
              <div className="mt-8">
                <p className="text-lg font-semibold text-neutral-700">
                  {cat.name}
                </p>
                <p className="mt-1 text-sm text-neutral-400">{cat.note}</p>
              </div>
              <span className="mt-4 badge-neutral w-fit">Bientôt</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
