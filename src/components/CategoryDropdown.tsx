"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Briefcase, Building2, Car, ChevronDown, Heart, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** A button that reveals a small category picker (Voitures / Immobilier /
    Achat-Vente) instead of linking straight to one — used wherever the
    current page doesn't already imply which category the visitor means
    (the home page hero, the nav bar's "Post an ad" button outside a
    category). */
export function CategoryDropdown({
  mode,
  triggerClassName,
  chevronSize = 14,
  panelAlign = "start",
  children,
}: {
  mode: "browse" | "post";
  triggerClassName: string;
  chevronSize?: number;
  /** Which side of the trigger the panel's edge lines up with — use "end"
      for a trigger sitting near the end of its row, so the panel doesn't
      run off the edge of the screen. */
  panelAlign?: "start" | "end";
  children: ReactNode;
}) {
  const tNav = useTranslations("nav");

  const options = [
    {
      href: mode === "browse" ? "/voitures" : "/voitures/nouvelle",
      label: tNav("voitures"),
      icon: Car,
    },
    {
      href: mode === "browse" ? "/immobilier" : "/immobilier/nouvelle",
      label: tNav("immobilier"),
      icon: Building2,
    },
    {
      href: mode === "browse" ? "/achat-vente" : "/achat-vente/nouvelle",
      label: tNav("achatVente"),
      icon: ShoppingBag,
    },
    {
      href: mode === "browse" ? "/emploi" : "/emploi/nouvelle",
      label: tNav("emploi"),
      icon: Briefcase,
    },
    {
      href: mode === "browse" ? "/mariage" : "/mariage/nouvelle",
      label: tNav("mariage"),
      icon: Heart,
    },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`${triggerClassName} group`}>
        {children}
        <ChevronDown size={chevronSize} className="shrink-0 transition group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={panelAlign === "end" ? "end" : "start"} className="w-48">
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
