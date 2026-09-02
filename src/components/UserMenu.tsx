"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ChevronDown, LogOut } from "lucide-react";

export function UserMenu({ name, email }: { name: string; email?: string | null }) {
  const t = useTranslations("nav");
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

  const initial = name.charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg py-1.5 ps-1.5 pe-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">
          {initial}
        </span>
        <span className="max-w-[84px] truncate sm:max-w-[140px]">{name}</span>
        <ChevronDown size={14} className={`shrink-0 text-neutral-400 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute end-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1.5 shadow-lg">
          <div className="px-3.5 py-2">
            <p className="truncate text-sm font-semibold text-neutral-900">{name}</p>
            {email && <p className="truncate text-xs text-neutral-500">{email}</p>}
          </div>
          <div className="my-1 border-t border-neutral-100" />
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-2 px-3.5 py-2 text-start text-sm text-neutral-700 transition hover:bg-neutral-50"
          >
            <LogOut size={15} />
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}
