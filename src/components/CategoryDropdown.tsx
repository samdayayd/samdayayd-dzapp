"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Building2, Car, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";

/** A button that reveals a small "Voitures / Immobilier" picker instead of
    linking straight to one category — used wherever the current page
    doesn't already imply which category the visitor means (the home page
    hero, the nav bar's "Post an ad" button when not inside a category). */
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

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
  ] as const;

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} className={triggerClassName}>
        {children}
        <ChevronDown
          size={chevronSize}
          className={`shrink-0 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1.5 text-start shadow-lg ${
            panelAlign === "end" ? "end-0" : "start-0"
          }`}
        >
          {options.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3.5 py-2 text-sm text-neutral-700 transition hover:bg-neutral-50"
            >
              <Icon size={15} className="text-brand-600" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
