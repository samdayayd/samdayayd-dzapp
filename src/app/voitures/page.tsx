import Link from "next/link";
import Image from "next/image";
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
      ...(params.ville
        ? { city: { contains: params.ville, mode: "insensitive" } }
        : {}),
      ...(params.pays ? { country: params.pays as "FRANCE" | "ALGERIE" } : {}),
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-green-800">Voitures</h1>

      <form className="mb-8 flex flex-wrap gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <input
          type="text"
          name="ville"
          placeholder="Ville"
          defaultValue={params.ville}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          name="pays"
          defaultValue={params.pays ?? ""}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Tous les pays</option>
          <option value="FRANCE">France</option>
          <option value="ALGERIE">Algérie</option>
        </select>
        <input
          type="number"
          name="prixMin"
          placeholder="Prix min"
          defaultValue={params.prixMin}
          className="w-28 rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="number"
          name="prixMax"
          placeholder="Prix max"
          defaultValue={params.prixMax}
          className="w-28 rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Rechercher
        </button>
      </form>

      {listings.length === 0 ? (
        <p className="text-gray-500">Aucune annonce pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/voitures/${listing.id}`}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full bg-gray-100">
                {listing.images[0] ? (
                  <Image
                    src={listing.images[0].url}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    Pas de photo
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="truncate font-semibold text-gray-900">
                  {listing.title}
                </p>
                <p className="text-lg font-bold text-green-800">
                  {formatPrice(listing.price, listing.currency)}
                </p>
                <p className="text-sm text-gray-500">
                  {listing.year} · {formatKm(listing.mileageKm)} ·{" "}
                  {FUEL_LABELS[listing.fuelType]}
                </p>
                <p className="text-sm text-gray-500">
                  {listing.city}, {COUNTRY_LABELS[listing.country]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
