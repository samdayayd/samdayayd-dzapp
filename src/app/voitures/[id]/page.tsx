import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Car,
  ChevronRight,
  Fuel,
  Gauge,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
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

  const specs = [
    { icon: Car, label: "Marque", value: listing.make },
    { icon: Car, label: "Modèle", value: listing.model },
    { icon: Calendar, label: "Année", value: String(listing.year) },
    { icon: Gauge, label: "Kilométrage", value: formatKm(listing.mileageKm) },
    { icon: Fuel, label: "Carburant", value: FUEL_LABELS[listing.fuelType] },
    {
      icon: MapPin,
      label: "Localisation",
      value: `${listing.city}, ${COUNTRY_LABELS[listing.country]}`,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <nav className="mb-5 flex items-center gap-1 text-sm text-neutral-500">
        <Link href="/voitures" className="hover:text-brand-700">
          Voitures
        </Link>
        <ChevronRight size={14} />
        <span className="truncate text-neutral-700">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
        <div className="md:col-span-3">
          {listing.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {listing.images.map((img, i) => (
                <div
                  key={img.id}
                  className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 ${
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
            <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-neutral-100 text-neutral-300">
              <Car size={56} strokeWidth={1.5} />
            </div>
          )}

          <div className="card mt-6 p-5">
            <h2 className="font-semibold text-neutral-900">Caractéristiques</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Icon size={15} />
                  </div>
                  <div>
                    <dt className="text-xs text-neutral-500">{label}</dt>
                    <dd className="text-sm font-medium text-neutral-900">
                      {value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold text-neutral-900">Description</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-neutral-700">
              {listing.description}
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="sticky top-20 space-y-4">
            <div className="card p-5">
              <p className="text-sm text-neutral-500">{listing.title}</p>
              <p className="mt-1 text-3xl font-extrabold text-brand-700">
                {formatPrice(listing.price, listing.currency)}
              </p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-800">
                  {listing.seller.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="flex items-center gap-1.5 font-medium text-neutral-900">
                    {listing.seller.name}
                    {listing.seller.verified && (
                      <span className="badge-brand !py-0.5">
                        <ShieldCheck size={12} />
                        Vérifié
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-neutral-500">Vendeur particulier</p>
                </div>
              </div>

              <button
                className="btn-primary mt-4 w-full"
                disabled
                title="La messagerie arrive bientôt"
              >
                <MessageCircle size={16} />
                Contacter le vendeur
              </button>
              <p className="mt-2 text-center text-xs text-neutral-400">
                La messagerie intégrée arrive bientôt
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
