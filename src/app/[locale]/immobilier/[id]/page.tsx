import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import {
  Building2,
  ChevronRight,
  DoorOpen,
  Mail,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = await getTranslations("immobilier");

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: "asc" } },
      seller: { select: { name: true, verified: true, createdAt: true } },
    },
  });

  if (!property) notFound();

  const specs = [
    { icon: Building2, label: t("detail.propertyType"), value: t(`propertyType.${property.propertyType}`) },
    { icon: DoorOpen, label: t("detail.rooms"), value: String(property.rooms) },
    { icon: Ruler, label: t("detail.surface"), value: `${property.surfaceM2} m²` },
    {
      icon: MapPin,
      label: t("detail.location"),
      value: `${property.city}, ${t(`country.${property.country}`)}`,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <nav className="mb-5 flex items-center gap-1 text-sm text-neutral-500">
        <Link href="/immobilier" className="hover:text-brand-700">
          {t("category")}
        </Link>
        <ChevronRight size={14} className="rtl:rotate-180" />
        <span className="truncate text-neutral-700">{property.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
        <div className="md:col-span-3">
          {property.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {property.images.map((img, i) => (
                <div
                  key={img.id}
                  className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 ${
                    i === 0 ? "col-span-2" : ""
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-neutral-100 text-neutral-300">
              <Building2 size={56} strokeWidth={1.5} />
            </div>
          )}

          <div className="card mt-6 p-5">
            <h2 className="font-semibold text-neutral-900">{t("detail.specsTitle")}</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
            <h2 className="font-semibold text-neutral-900">{t("detail.descriptionTitle")}</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-neutral-700">
              {property.description}
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="sticky top-20 space-y-4">
            <div className="card p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-neutral-500">{property.title}</p>
                <span
                  className={`badge shrink-0 ${
                    property.saleType === "LOCATION"
                      ? "bg-accent-500 text-white"
                      : "bg-brand-600 text-white"
                  }`}
                >
                  {t(`saleType.${property.saleType}`)}
                </span>
              </div>
              <p className="mt-1 text-3xl font-extrabold text-brand-700">
                {formatPrice(property.price, property.currency, locale)}
                {property.saleType === "LOCATION" && (
                  <span className="text-base font-medium text-neutral-500">
                    {t("perMonth")}
                  </span>
                )}
              </p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-800">
                  {property.contactName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="flex items-center gap-1.5 font-medium text-neutral-900">
                    {property.contactName}
                    {property.seller.verified && (
                      <span className="badge-brand !py-0.5">
                        <ShieldCheck size={12} />
                        {t("detail.verified")}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-neutral-500">{t("detail.sellerDefault")}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <a href={`tel:${property.contactPhone}`} className="btn-primary w-full">
                  <Phone size={16} />
                  {t("detail.call")}
                </a>
                <a href={`mailto:${property.contactEmail}`} className="btn-secondary w-full">
                  <Mail size={16} />
                  {t("detail.email")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
