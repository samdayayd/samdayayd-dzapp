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
    attention. `dark` switches the card body for the homepage's dark
    sections — the feed pages stay on the light variant unchanged. */
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
  dark = false,
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
  dark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        dark
          ? "group block overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.07]"
          : "group block overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-[0_6px_20px_rgba(15,23,42,0.08)]"
      }
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400">
            <FallbackIcon size={32} strokeWidth={1.5} />
          </div>
        )}
        {country && (
          <span className="badge-neutral absolute start-2.5 top-2.5 bg-white/90 shadow-sm backdrop-blur-sm">
            {country}
          </span>
        )}
        {saleBadge && (
          <span
            className={`badge absolute end-2.5 top-2.5 bg-white/90 shadow-sm backdrop-blur-sm ${
              saleBadge.variant === "accent" ? "text-accent-700" : "text-brand-700"
            }`}
          >
            {saleBadge.label}
          </span>
        )}
      </div>

      <div className="p-3.5">
        {categoryBadge && (
          <p
            className={`text-[11px] font-semibold uppercase tracking-wide ${
              dark ? "text-accent-400" : "text-brand-600"
            }`}
          >
            {categoryBadge}
          </p>
        )}
        <p className={`mt-0.5 truncate font-semibold ${dark ? "text-white" : "text-neutral-900"}`}>{title}</p>
        <p className={`mt-0.5 text-lg font-extrabold ${dark ? "text-accent-400" : "text-brand-700"}`}>
          {price}
          {priceSuffix && (
            <span className={`text-sm font-medium ${dark ? "text-white/40" : "text-neutral-500"}`}>
              {priceSuffix}
            </span>
          )}
        </p>

        <div
          className={`mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${
            dark ? "text-white/50" : "text-neutral-500"
          }`}
        >
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
