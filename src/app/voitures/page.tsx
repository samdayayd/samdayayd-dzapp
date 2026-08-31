import Link from "next/link";
import Image from "next/image";
import { Car, Fuel, Gauge, MapPin, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatKm, FUEL_LABELS, COUNTRY_LABELS } from "@/lib/format";

export const dynamic = "force-dynamic";

type SearchParams = {
  ville?: string;
  pays?: string;
  prixMin?: string;
  prixMax?: string;
};

export default async function VoituresPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const listings = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      ...(params.ville ? { city: { contains: params.ville } } : {}),
      ...(params.pays ? { country: params.pays } : {}),
      ...(params.prixMin || params.prixMax
        ? {
            price: {
              ...(params.prixMin ? { gte: Number(params.prixMin) } : {}),
              ...(params.prixMax ? { lte: Number(params.prixMax) } : {}),
            },
          }
        : {}),
    },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const hasFilters = params.ville || params.pays || params.prixMin || params.prixMax;

  return (
    <div>
      <div className="border-b border-neutral-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex items-center gap-2 text-brand-700">
            <Car size={20} strokeWidth={2.25} />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Voitures
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-neutral-900 sm:text-3xl">
            {listings.length} annonce{listings.length !== 1 ? "s" : ""}
            {hasFilters ? " trouvée" + (listings.length !== 1 ? "s" : "") : " disponibles"}
          </h1>

          <form className="mt-6 flex flex-wrap items-end gap-3">
            <div className="min-w-[160px] flex-1">
              <label className="field-label" htmlFor="ville">
                Ville
              </label>
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  id="ville"
                  type="text"
                  name="ville"
                  placeholder="ex: Lyon, Alger…"
                  defaultValue={params.ville}
                  className="field-input pl-9"
                />
              </div>
            </div>

            <div className="w-40">
              <label className="field-label" htmlFor="pays">
                Pays
              </label>
              <select
                id="pays"
                name="pays"
                defaultValue={params.pays ?? ""}
                className="field-select"
              >
                <option value="">Tous les pays</option>
                <option value="FRANCE">France</option>
                <option value="ALGERIE">Algérie</option>
              </select>
            </div>

            <div className="w-28">
              <label className="field-label" htmlFor="prixMin">
                Prix min
              </label>
              <input
                id="prixMin"
                type="number"
                name="prixMin"
                placeholder="0"
                defaultValue={params.prixMin}
                className="field-input"
              />
            </div>

            <div className="w-28">
              <label className="field-label" htmlFor="prixMax">
                Prix max
              </label>
              <input
                id="prixMax"
                type="number"
                name="prixMax"
                placeholder="∞"
                defaultValue={params.prixMax}
                className="field-input"
              />
            </div>

            <button type="submit" className="btn-primary h-[42px]">
              <Search size={16} strokeWidth={2.5} />
              Rechercher
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {listings.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
              <Car size={26} />
            </div>
            <p className="font-medium text-neutral-700">
              Aucune annonce ne correspond à votre recherche.
            </p>
            <p className="text-sm text-neutral-500">
              Essayez d&apos;élargir vos filtres, ou soyez le premier à publier.
            </p>
            <Link href="/voitures/nouvelle" className="btn-primary mt-2">
              Publier une annonce
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/voitures/${listing.id}`}
                className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                  {listing.images[0] ? (
                    <Image
                      src={listing.images[0].url}
                      alt={listing.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-300">
                      <Car size={40} strokeWidth={1.5} />
                    </div>
                  )}
                  <span className="badge-neutral absolute left-3 top-3 bg-white/90 shadow-sm">
                    {COUNTRY_LABELS[listing.country]}
                  </span>
                </div>

                <div className="p-4">
                  <p className="truncate font-semibold text-neutral-900">
                    {listing.title}
                  </p>
                  <p className="mt-0.5 text-xl font-extrabold text-brand-700">
                    {formatPrice(listing.price, listing.currency)}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1">
                      <Gauge size={13} /> {formatKm(listing.mileageKm)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Fuel size={13} /> {FUEL_LABELS[listing.fuelType]}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={13} /> {listing.city}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
