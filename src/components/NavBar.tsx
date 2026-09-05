"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Building2, Car, LogIn, Plus, ShoppingBag } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { CategoryDropdown } from "./CategoryDropdown";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UserMenu } from "./UserMenu";

const CATEGORY_PREFIXES = ["/voitures", "/immobilier", "/achat-vente"];

export function NavBar() {
  const { data: session, status } = useSession();
  const t = useTranslations("nav");
  const pathname = usePathname();
  // Land on the create form for whichever category the user is currently
  // browsing, so "Post an ad" from Immobilier doesn't drop them into the
  // Voitures form. Outside any category (e.g. the home page) there's no
  // page context to infer from, so let the visitor pick instead of guessing.
  const currentCategory = CATEGORY_PREFIXES.find((p) => pathname.startsWith(p));
  const publishHref = currentCategory ? `${currentCategory}/nouvelle` : null;

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          dir="ltr"
          className="flex items-center gap-1.5 text-xl font-extrabold tracking-tight"
        >
          <span className="text-brand-700">DZ</span>
          <span className="text-accent-600">APP</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/voitures"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 sm:flex"
          >
            <Car size={16} strokeWidth={2.25} />
            {t("voitures")}
          </Link>
          <Link
            href="/immobilier"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 sm:flex"
          >
            <Building2 size={16} strokeWidth={2.25} />
            {t("immobilier")}
          </Link>
          <Link
            href="/achat-vente"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 md:flex"
          >
            <ShoppingBag size={16} strokeWidth={2.25} />
            {t("achatVente")}
          </Link>

          {status === "authenticated" ? (
            <>
              {publishHref ? (
                <Link
                  href={publishHref}
                  title={t("publish")}
                  className="btn-primary !px-2.5 sm:!px-4"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span className="hidden sm:inline">{t("publish")}</span>
                </Link>
              ) : (
                <CategoryDropdown
                  mode="post"
                  panelAlign="end"
                  triggerClassName="btn-primary !px-2.5 sm:!px-4"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span className="hidden sm:inline">{t("publish")}</span>
                </CategoryDropdown>
              )}
              <UserMenu
                name={session.user?.name ?? ""}
                email={session.user?.email}
              />
            </>
          ) : status === "loading" ? (
            <div className="h-9 w-24" />
          ) : (
            <>
              <Link
                href="/login"
                title={t("login")}
                className="btn-ghost !px-2.5 sm:!px-4"
              >
                <LogIn size={16} className="sm:hidden" />
                <span className="hidden sm:inline">{t("login")}</span>
              </Link>
              <Link href="/register" className="btn-primary !px-3 sm:!px-4">
                <span className="hidden sm:inline">{t("register")}</span>
                <span className="sm:hidden">{t("registerShort")}</span>
              </Link>
            </>
          )}

          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
