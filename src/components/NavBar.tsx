"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function NavBar() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-extrabold text-green-800">
          DZ<span className="text-red-600">APP</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/voitures" className="text-gray-700 hover:text-green-800">
            Voitures
          </Link>
          {status === "authenticated" ? (
            <>
              <Link
                href="/voitures/nouvelle"
                className="rounded-md bg-green-700 px-3 py-1.5 font-medium text-white hover:bg-green-800"
              >
                Publier une annonce
              </Link>
              <span className="text-gray-500">{session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="text-gray-500 hover:text-gray-800"
              >
                Déconnexion
              </button>
            </>
          ) : status === "loading" ? null : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-green-800">
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-green-700 px-3 py-1.5 font-medium text-white hover:bg-green-800"
              >
                Créer un compte
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
