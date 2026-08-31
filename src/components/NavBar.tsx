"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Car, LogOut, Plus, User } from "lucide-react";

export function NavBar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-1.5 text-xl font-extrabold tracking-tight">
          <span className="text-brand-700">DZ</span>
          <span className="text-accent-600">APP</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/voitures"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 sm:flex"
          >
            <Car size={16} strokeWidth={2.25} />
            Voitures
          </Link>

          {status === "authenticated" ? (
            <>
              <Link href="/voitures/nouvelle" className="btn-primary">
                <Plus size={16} strokeWidth={2.5} />
                <span className="hidden sm:inline">Publier une annonce</span>
                <span className="sm:hidden">Publier</span>
              </Link>
              <div className="ml-1 hidden items-center gap-1.5 pl-2 text-sm text-neutral-500 md:flex">
                <User size={15} />
                {session.user?.name}
              </div>
              <button
                onClick={() => signOut()}
                title="Déconnexion"
                className="btn-ghost !px-2.5"
              >
                <LogOut size={17} />
              </button>
            </>
          ) : status === "loading" ? (
            <div className="h-9 w-24" />
          ) : (
            <>
              <Link href="/login" className="btn-ghost">
                Connexion
              </Link>
              <Link href="/register" className="btn-primary">
                Créer un compte
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
