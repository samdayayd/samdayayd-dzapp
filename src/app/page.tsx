import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-4xl font-extrabold text-green-800">
        DZ<span className="text-red-600">APP</span>
      </h1>
      <p className="mt-3 max-w-md text-lg text-gray-600">
        La plateforme d&apos;annonces pour les Algériens en France et en
        Algérie. Tout en un seul endroit.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/voitures"
          className="rounded-md bg-green-700 px-6 py-3 font-medium text-white hover:bg-green-800"
        >
          Voir les annonces Voitures
        </Link>
        <Link
          href="/voitures/nouvelle"
          className="rounded-md border border-green-700 px-6 py-3 font-medium text-green-800 hover:bg-green-50"
        >
          Publier une annonce
        </Link>
      </div>
    </div>
  );
}
