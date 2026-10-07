"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  Briefcase,
  Building2,
  Car,
  Heart,
  Home,
  KeyRound,
  LogIn,
  LogOut,
  Menu,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { CategoryDropdown } from "./CategoryDropdown";
import { CountryDropdown } from "./CountryDropdown";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const CATEGORY_PREFIXES = ["/voitures", "/immobilier", "/achat-vente", "/emploi", "/mariage"];

function Logo() {
  return (
    <Link href="/" dir="ltr" className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 text-white shadow-sm">
        <Sparkles size={16} strokeWidth={2.5} />
      </span>
      <span className="flex items-center gap-1 text-xl font-extrabold tracking-tight">
        <span className="text-white">DZ</span>
        <span className="text-accent-400">APP</span>
      </span>
    </Link>
  );
}

export function NavBar() {
  const { data: session, status } = useSession();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  // Land on the create form for whichever category the user is currently
  // browsing, so "Post an ad" from Immobilier doesn't drop them into the
  // Voitures form. Outside any category (e.g. the home page) there's no
  // page context to infer from, so let the visitor pick instead of guessing.
  const currentCategory = CATEGORY_PREFIXES.find((p) => pathname.startsWith(p));
  const publishHref = currentCategory ? `${currentCategory}/nouvelle` : null;
  const isHome = pathname === "/";

  const categoryLinks = [
    { href: "/voitures", label: t("voitures"), icon: Car },
    { href: "/immobilier", label: t("immobilier"), icon: Building2 },
    { href: "/achat-vente", label: t("achatVente"), icon: ShoppingBag },
    { href: "/emploi", label: t("emploi"), icon: Briefcase },
    { href: "/mariage", label: t("mariage"), icon: Heart },
  ] as const;

  const navLinkClass =
    "hidden items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition md:flex";
  const dropdownTriggerClass = `${navLinkClass} text-white/70 hover:bg-white/10 hover:text-white`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-1">
          <Logo />
          <nav className="ms-6 flex items-center gap-1">
            <Link
              href="/"
              className={`relative ${navLinkClass} ${
                isHome ? "text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Home size={15} strokeWidth={2.25} />
              {t("home")}
              {isHome && (
                <span className="absolute -bottom-1 start-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent-400" />
              )}
            </Link>
            <CategoryDropdown mode="browse" triggerClassName={dropdownTriggerClass}>
              {t("categories")}
            </CategoryDropdown>
            <CountryDropdown country="FRANCE" label={t("france")} triggerClassName={dropdownTriggerClass} />
            <CountryDropdown country="ALGERIE" label={t("algeria")} triggerClassName={dropdownTriggerClass} />
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            title={t("search")}
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white sm:flex"
          >
            <Search size={17} strokeWidth={2.25} />
          </Link>

          {status === "authenticated" ? (
            <>
              {publishHref ? (
                <Button asChild size="md" className="btn-gradient !px-2.5 sm:!px-4">
                  <Link href={publishHref} title={t("publish")}>
                    <Plus size={16} strokeWidth={2.5} />
                    <span className="hidden sm:inline">{t("publish")}</span>
                  </Link>
                </Button>
              ) : (
                <CategoryDropdown mode="post" panelAlign="end" triggerClassName="btn-gradient !px-2.5 sm:!px-4">
                  <Plus size={16} strokeWidth={2.5} />
                  <span className="hidden sm:inline">{t("publish")}</span>
                </CategoryDropdown>
              )}
              <div className="hidden sm:block">
                <UserMenu name={session.user?.name ?? ""} email={session.user?.email} />
              </div>
            </>
          ) : status === "loading" ? (
            <div className="h-9 w-24" />
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="md"
                className="!px-2.5 !text-white/80 hover:!bg-white/10 hover:!text-white sm:!px-4"
              >
                <Link href="/login" title={t("login")}>
                  <LogIn size={16} className="sm:hidden" />
                  <span className="hidden sm:inline">{t("login")}</span>
                </Link>
              </Button>
              <Button asChild size="md" className="btn-gradient hidden !px-3 sm:!flex sm:!px-4">
                <Link href="/register">{t("register")}</Link>
              </Button>
            </>
          )}

          <div className="hidden sm:block">
            <LanguageSwitcher dark />
          </div>

          {/* Mobile menu — the desktop nav above hides the category links
              and language switcher below `md`/`sm`; this is the one place
              to reach them on a phone instead of just dropping them. */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="!text-white/80 hover:!bg-white/10 hover:!text-white md:hidden"
                aria-label={t("menu")}
              >
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle>{t("menu")}</SheetTitle>
              <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-4">
                <Link href="/" dir="ltr" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 text-white shadow-sm">
                    <Sparkles size={16} strokeWidth={2.5} />
                  </span>
                  <span className="flex items-center gap-1 text-xl font-extrabold tracking-tight">
                    <span className="text-neutral-900">DZ</span>
                    <span className="text-accent-600">APP</span>
                  </span>
                </Link>
              </div>
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  <Home size={18} className="text-brand-600" />
                  {t("home")}
                </Link>
                {categoryLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                  >
                    <Icon size={18} className="text-brand-600" />
                    {label}
                  </Link>
                ))}
                <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {t("browseByCountry")}
                </p>
                <div className="flex gap-2 px-3">
                  <Link
                    href="/voitures?pays=FRANCE"
                    onClick={() => setMobileOpen(false)}
                    className="btn-secondary flex-1 !text-xs"
                  >
                    {t("france")}
                  </Link>
                  <Link
                    href="/voitures?pays=ALGERIE"
                    onClick={() => setMobileOpen(false)}
                    className="btn-secondary flex-1 !text-xs"
                  >
                    {t("algeria")}
                  </Link>
                </div>
              </nav>
              <div className="space-y-3 border-t border-neutral-100 p-4">
                {status === "authenticated" && session.user ? (
                  <>
                    <div className="flex items-center gap-2.5 rounded-lg bg-neutral-50 px-3 py-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-400 text-xs font-bold text-white">
                        {(session.user.name ?? "?").charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-neutral-900">{session.user.name}</p>
                        <p className="truncate text-xs text-neutral-500">{session.user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/invites"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                    >
                      <KeyRound size={18} className="text-brand-600" />
                      {t("invites")}
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        signOut();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                    >
                      <LogOut size={18} className="text-neutral-400" />
                      {t("logout")}
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Button asChild variant="secondary" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Link href="/login">{t("login")}</Link>
                    </Button>
                    <Button asChild className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Link href="/register">{t("registerShort")}</Link>
                    </Button>
                  </div>
                )}
                <div className="flex justify-center">
                  <LanguageSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
