import Image from "next/image";
import { type LucideIcon, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";

export interface ListingCardMeta {
  icon: LucideIcon;
  label: string;
}

/** The one listing-card design shared by every category's feed and the
    homepage's featured-listings strip — real marketplace cards (image,
    price, location, category-specific meta), not another giant
    rounded-shadow box. Deliberately restrained: thin border, shadow only
    on hover, modest radius — a marketplace page shows dozens of these at
    once, so each one has to stay light rather than compete for
    attention. */
export function ListingCard({
  href,
  imageUrl,
  imageAlt,
  fallbackIcon: FallbackIcon,
  title,
  price,
  priceSuffix,
  country,
  city,
  categoryBadge,
  saleBadge,
  meta,
}: {
  href: string;
  imageUrl?: string | null;
  imageAlt: string;
  fallbackIcon: LucideIcon;
  title: string;
  price: string;
  priceSuffix?: string;
  country?: string;
  city: string;
  categoryBadge?: string;
  saleBadge?: { label: string; variant: "brand" | "accent" };
  meta: ListingCardMeta[];
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-[0_6px_20px_rgba(15,23,42,0.08)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-300">
            <FallbackIcon size={36} strokeWidth={1.5} />
          </div>
        )}
        {country && (
          <span className="badge-neutral absolute start-2.5 top-2.5 bg-white/90 shadow-sm">{country}</span>
        )}
        {saleBadge && (
          <span
            className={`badge absolute end-2.5 top-2.5 shadow-sm ${
              saleBadge.variant === "accent" ? "bg-accent-500 text-white" : "bg-brand-600 text-white"
            }`}
          >
            {saleBadge.label}
          </span>
        )}
      </div>

      <div className="p-3.5">
        {categoryBadge && (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">{categoryBadge}</p>
        )}
        <p className="mt-0.5 truncate font-semibold text-neutral-900">{title}</p>
        <p className="mt-0.5 text-lg font-extrabold text-brand-700">
          {price}
          {priceSuffix && <span className="text-sm font-medium text-neutral-500">{priceSuffix}</span>}
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
          {meta.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1">
              <Icon size={13} /> {label}
            </span>
          ))}
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} /> {city}
          </span>
        </div>
      </div>
    </Link>
  );
}
