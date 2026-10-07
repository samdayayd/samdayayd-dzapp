import Image from "next/image";
import { Heart, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";

/** The marriage-profile card — deliberately NOT the ListingCard used for
    cars/properties/items/jobs. That card is built around a price, which
    reads as treating a person like a commodity; this one leads with a
    name and age instead, and never shows contact info (that stays
    hidden until a mutual match — see the [id] detail page). */
export function ProfileCard({
  href,
  photoUrl,
  displayName,
  age,
  city,
  country,
  practiceBadge,
  bioExcerpt,
}: {
  href: string;
  photoUrl?: string | null;
  displayName: string;
  age: number;
  city: string;
  country: string;
  practiceBadge: string;
  bioExcerpt: string;
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-[0_6px_20px_rgba(15,23,42,0.08)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={displayName}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400">
            <Heart size={32} strokeWidth={1.5} />
          </div>
        )}
        <span className="badge-neutral absolute start-2.5 top-2.5 bg-white/90 shadow-sm backdrop-blur-sm">
          {country}
        </span>
        <span className="badge absolute end-2.5 top-2.5 bg-white/90 text-brand-700 shadow-sm backdrop-blur-sm">
          {practiceBadge}
        </span>
      </div>

      <div className="p-3.5">
        <p className="truncate font-semibold text-neutral-900">
          {displayName}, {age}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{bioExcerpt}</p>
        <div className="mt-2.5 flex items-center gap-1 text-xs text-neutral-500">
          <MapPin size={13} /> {city}
        </div>
      </div>
    </Link>
  );
}
