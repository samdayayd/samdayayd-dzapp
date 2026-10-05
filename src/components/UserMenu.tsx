"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ChevronDown, KeyRound, LogOut } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({ name, email }: { name: string; email?: string | null }) {
  const t = useTranslations("nav");
  const initial = name.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-1.5 rounded-lg py-1.5 ps-1.5 pe-2 text-sm font-medium text-white/90 outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-accent-400 data-[state=open]:bg-white/10">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-400 text-xs font-bold text-white">
          {initial}
        </span>
        <span className="max-w-[84px] truncate sm:max-w-[140px]">{name}</span>
        <ChevronDown size={14} className="shrink-0 text-white/50 transition group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <p className="truncate text-sm font-semibold text-neutral-900">{name}</p>
          {email && <p className="truncate text-xs text-neutral-500">{email}</p>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/invites">
            <KeyRound size={15} />
            {t("invites")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut()}>
          <LogOut size={15} />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
