import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200/70 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-neutral-500 sm:flex-row sm:px-6">
        <p>
          <span className="font-bold text-brand-700">DZ</span>
          <span className="font-bold text-accent-600">APP</span> — annonces
          entre la France et l&apos;Algérie.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/voitures" className="hover:text-neutral-800">
            Voitures
          </Link>
          <Link href="/voitures/nouvelle" className="hover:text-neutral-800">
            Publier une annonce
          </Link>
        </div>
      </div>
    </footer>
  );
}
