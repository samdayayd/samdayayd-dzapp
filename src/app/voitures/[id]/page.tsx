import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatKm, FUEL_LABELS, COUNTRY_LABELS } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: "asc" } },
      seller: { select: { name: true, verified: true, createdAt: true } },
    },
  });

  if (!listing) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          {listing.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {listing.images.map((img, i) => (
                <div
                  key={img.id}
                  className={`relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 ${
                    i === 0 ? "col-span-2" : ""
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-gray-100 text-gray-400">
              Pas de photo
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
          <p className="mt-1 text-3xl font-extrabold text-green-800">
            {formatPrice(listing.price, listing.currency)}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-gray-500">Marque</dt>
            <dd className="font-medium">{listing.make}</dd>
            <dt className="text-gray-500">Modèle</dt>
            <dd className="font-medium">{listing.model}</dd>
            <dt className="text-gray-500">Année</dt>
            <dd className="font-medium">{listing.year}</dd>
            <dt className="text-gray-500">Kilométrage</dt>
            <dd className="font-medium">{formatKm(listing.mileageKm)}</dd>
            <dt className="text-gray-500">Carburant</dt>
            <dd className="font-medium">{FUEL_LABELS[listing.fuelType]}</dd>
            <dt className="text-gray-500">Localisation</dt>
            <dd className="font-medium">
              {listing.city}, {COUNTRY_LABELS[listing.country]}
            </dd>
          </dl>

          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
            <p className="font-medium text-gray-900">
              {listing.seller.name}{" "}
              {listing.seller.verified && (
                <span className="ml-1 rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-800">
                  Vérifié
                </span>
              )}
            </p>
            <button
              className="mt-3 w-full rounded-md bg-green-700 px-4 py-2 font-medium text-white hover:bg-green-800"
              disabled
              title="La messagerie arrive bientôt"
            >
              Contacter le vendeur
            </button>
          </div>

          <div className="mt-6">
            <h2 className="font-medium text-gray-900">Description</h2>
            <p className="mt-1 whitespace-pre-line text-gray-700">
              {listing.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
