"use client";

import { useTranslations } from "next-intl";
import { Building2, Car, ChevronDown, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** The nav's "France" / "Algérie" items — a dropdown onto the three
    category feeds, each pre-filtered to that country via the `pays`
    param every feed page already supports. Real filtering, not a page
    that doesn't exist. */
export function CountryDropdown({
  country,
  label,
  triggerClassName,
}: {
  country: "FRANCE" | "ALGERIE";
  label: string;
  triggerClassName: string;
}) {
  const tNav = useTranslations("nav");

  const options = [
    { href: `/voitures?pays=${country}`, label: tNav("voitures"), icon: Car },
    { href: `/immobilier?pays=${country}`, label: tNav("immobilier"), icon: Building2 },
    { href: `/achat-vente?pays=${country}`, label: tNav("achatVente"), icon: ShoppingBag },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`${triggerClassName} group`}>
        {label}
        <ChevronDown size={13} className="shrink-0 transition group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {options.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild>
            <Link href={href}>
              <Icon size={15} className="text-brand-600" />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
