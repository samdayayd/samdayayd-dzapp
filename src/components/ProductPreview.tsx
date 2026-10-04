import { Building2, Car, MapPin, ShoppingBag } from "lucide-react";

// Explicit pixel placement (not a loose "overlap and hope") so each card's
// own text never sits under another card — a cascading step pattern,
// small gaps between cards instead of a deep stack, keeps every price/
// city line fully legible at any viewport this scales to.
const PREVIEW_CARDS = [
  {
    icon: Car,
    title: "Peugeot 208",
    meta: "2020 · 45 000 km",
    price: "12 000 €",
    city: "Lyon",
    accent: "from-brand-500 to-brand-700",
    style: { top: 0, left: 0, transform: "rotate(-6deg)" },
    z: "z-10",
  },
  {
    icon: Building2,
    title: "Appartement 3P",
    meta: "72 m² · 3 pièces",
    price: "850 €/mois",
    city: "Alger",
    accent: "from-accent-500 to-accent-700",
    style: { top: 8, right: 0, transform: "rotate(4deg)" },
    z: "z-20",
  },
  {
    icon: ShoppingBag,
    title: "iPhone 13 Pro",
    meta: "Occasion · Excellent état",
    price: "480 €",
    city: "Paris",
    accent: "from-neutral-700 to-neutral-900",
    style: { top: 200, left: 120, transform: "rotate(-3deg)" },
    z: "z-30",
  },
] as const;

/** A static, honestly-illustrative preview of what a DZ APP listing card
    looks like — built from the same visual language as the real cards
    (same radius, shadow, badge style), not a screenshot and not a stock
    photo. Exists so the hero shows the actual product instead of just
    describing it. */
export function ProductPreview() {
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-md">
      {PREVIEW_CARDS.map(({ icon: Icon, title, meta, price, city, accent, style, z }) => (
        <div key={title} className={`card absolute w-52 overflow-hidden shadow-xl ${z}`} style={style}>
          <div className={`flex h-24 items-center justify-center bg-gradient-to-br ${accent} text-white/90`}>
            <Icon size={30} strokeWidth={1.75} />
          </div>
          <div className="p-3.5">
            <p className="truncate text-sm font-semibold text-neutral-900">{title}</p>
            <p className="mt-0.5 text-xs text-neutral-500">{meta}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-bold text-brand-700">{price}</span>
              <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                <MapPin size={11} />
                {city}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
