"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Building2, Car, KeyRound, LogIn, LogOut, Menu, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { CategoryDropdown } from "./CategoryDropdown";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const CATEGORY_PREFIXES = ["/voitures", "/immobilier", "/achat-vente"];

function Logo() {
  return (
    <Link href="/" dir="ltr" className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-sm">
        <Sparkles size={16} strokeWidth={2.5} />
      </span>
      <span className="flex items-center gap-1 text-xl font-extrabold tracking-tight">
        <span className="text-brand-700">DZ</span>
        <span className="text-accent-600">APP</span>
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

  const categoryLinks = [
    { href: "/voitures", label: t("voitures"), icon: Car },
    { href: "/immobilier", label: t("immobilier"), icon: Building2 },
    { href: "/achat-vente", label: t("achatVente"), icon: ShoppingBag },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />

        <nav className="flex items-center gap-1 sm:gap-2">
          {categoryLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 md:flex"
            >
              <Icon size={16} strokeWidth={2.25} />
              {label}
            </Link>
          ))}

          {status === "authenticated" ? (
            <>
              {publishHref ? (
                <Button asChild size="md" className="!px-2.5 sm:!px-4">
                  <Link href={publishHref} title={t("publish")}>
                    <Plus size={16} strokeWidth={2.5} />
                    <span className="hidden sm:inline">{t("publish")}</span>
                  </Link>
                </Button>
              ) : (
                <CategoryDropdown mode="post" panelAlign="end" triggerClassName="btn-primary !px-2.5 sm:!px-4">
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
              <Button asChild variant="ghost" size="md" className="!px-2.5 sm:!px-4">
                <Link href="/login" title={t("login")}>
                  <LogIn size={16} className="sm:hidden" />
                  <span className="hidden sm:inline">{t("login")}</span>
                </Link>
              </Button>
              <Button asChild size="md" className="hidden !px-3 sm:!flex sm:!px-4">
                <Link href="/register">{t("register")}</Link>
              </Button>
            </>
          )}

          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Mobile menu — the desktop nav above hides the category links
              and language switcher below `md`/`sm`; this is the one place
              to reach them on a phone instead of just dropping them. */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label={t("menu")}>
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle>{t("menu")}</SheetTitle>
              <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-4">
                <Logo />
              </div>
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
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
              </nav>
              <div className="space-y-3 border-t border-neutral-100 p-4">
                {status === "authenticated" && session.user ? (
                  <>
                    <div className="flex items-center gap-2.5 rounded-lg bg-neutral-50 px-3 py-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">
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
        </nav>
      </div>
    </header>
  );
}
