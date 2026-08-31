"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

const CURRENT_YEAR = new Date().getFullYear();

export default function NewListingPage() {
  const router = useRouter();
  const { status } = useSession();

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === "loading") return null;

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-gray-700">
          Vous devez être connecté pour publier une annonce.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-md bg-green-700 px-4 py-2 font-medium text-white hover:bg-green-800"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const imageUrls: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Échec de l'envoi d'une image");
        const data = await res.json();
        imageUrls.push(data.url);
      }

      const form = e.currentTarget;
      const fd = new FormData(form);
      const payload = {
        title: fd.get("title"),
        description: fd.get("description"),
        price: Number(fd.get("price")),
        country: fd.get("country"),
        city: fd.get("city"),
        make: fd.get("make"),
        model: fd.get("model"),
        year: Number(fd.get("year")),
        mileageKm: Number(fd.get("mileageKm")),
        fuelType: fd.get("fuelType"),
        imageUrls,
      };

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Une erreur est survenue");
      }

      const { id } = await res.json();
      router.push(`/voitures/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-green-800">
        Publier une annonce — Voiture
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Titre de l&apos;annonce</label>
          <input
            name="title"
            required
            placeholder="ex: Peugeot 208 2020, très bon état"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Marque</label>
            <input
              name="make"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Modèle</label>
            <input
              name="model"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Année</label>
            <input
              type="number"
              name="year"
              required
              min={1970}
              max={CURRENT_YEAR + 1}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Kilométrage</label>
            <input
              type="number"
              name="mileageKm"
              required
              min={0}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Carburant</label>
            <select
              name="fuelType"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="ESSENCE">Essence</option>
              <option value="DIESEL">Diesel</option>
              <option value="ELECTRIQUE">Électrique</option>
              <option value="HYBRIDE">Hybride</option>
              <option value="GPL">GPL</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Prix</label>
            <input
              type="number"
              name="price"
              required
              min={0}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Pays</label>
            <select
              name="country"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="FRANCE">France</option>
              <option value="ALGERIE">Algérie</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Ville</label>
            <input
              name="city"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            required
            rows={5}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Photos</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="mt-1 w-full text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-green-700 px-4 py-2 font-medium text-white hover:bg-green-800 disabled:opacity-50"
        >
          {submitting ? "Publication..." : "Publier l'annonce"}
        </button>
      </form>
    </div>
  );
}
