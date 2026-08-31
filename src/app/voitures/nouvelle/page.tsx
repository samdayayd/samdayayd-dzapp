"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  AlertCircle,
  Camera,
  Car,
  ImagePlus,
  Loader2,
  LogIn,
  X,
} from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

export default function NewListingPage() {
  const router = useRouter();
  const { status } = useSession();

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === "loading") return null;

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <LogIn size={26} />
        </div>
        <p className="mt-4 text-lg font-medium text-neutral-900">
          Connectez-vous pour publier
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          Vous devez avoir un compte DZ APP pour publier une annonce.
        </p>
        <Link href="/login" className="btn-primary mt-6">
          Se connecter
        </Link>
      </div>
    );
  }

  function handleFiles(fileList: FileList | null) {
    const newFiles = Array.from(fileList ?? []);
    if (newFiles.length === 0) return;
    setFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))]);
  }

  function removeFile(index: number) {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Capture the form synchronously — React nulls out a synthetic event's
    // currentTarget once the handler yields on an await, so this must
    // happen before any async work below.
    const form = e.currentTarget;
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
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Car size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Publier une annonce
          </h1>
          <p className="text-sm text-neutral-500">Catégorie Voitures</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6 p-6">
        <div>
          <label className="field-label" htmlFor="title">
            Titre de l&apos;annonce
          </label>
          <input
            id="title"
            name="title"
            required
            placeholder="ex: Peugeot 208 2020, très bon état"
            className="field-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label" htmlFor="make">
              Marque
            </label>
            <input id="make" name="make" required className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="model">
              Modèle
            </label>
            <input id="model" name="model" required className="field-input" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="field-label" htmlFor="year">
              Année
            </label>
            <input
              id="year"
              type="number"
              name="year"
              required
              min={1970}
              max={CURRENT_YEAR + 1}
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="mileageKm">
              Kilométrage
            </label>
            <input
              id="mileageKm"
              type="number"
              name="mileageKm"
              required
              min={0}
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="fuelType">
              Carburant
            </label>
            <select id="fuelType" name="fuelType" required className="field-select">
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
            <label className="field-label" htmlFor="price">
              Prix
            </label>
            <input
              id="price"
              type="number"
              name="price"
              required
              min={0}
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="country">
              Pays
            </label>
            <select id="country" name="country" required className="field-select">
              <option value="FRANCE">France</option>
              <option value="ALGERIE">Algérie</option>
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="city">
              Ville
            </label>
            <input id="city" name="city" required className="field-input" />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            placeholder="État du véhicule, entretien, options, raison de la vente…"
            className="field-input resize-none"
          />
        </div>

        <div>
          <label className="field-label">Photos</label>
          <label
            htmlFor="photos"
            className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center transition hover:border-brand-400 hover:bg-brand-50/50"
          >
            <ImagePlus size={22} className="text-neutral-400" />
            <span className="text-sm text-neutral-600">
              <span className="font-medium text-brand-700">
                Cliquez pour ajouter des photos
              </span>{" "}
              ou glissez-déposez
            </span>
            <span className="text-xs text-neutral-400">JPG, PNG, WebP — 8MB max</span>
            <input
              id="photos"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
              className="sr-only"
            />
          </label>

          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {previews.map((src, i) => (
                <div
                  key={src}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, not an optimizable remote asset */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X size={12} />
                  </button>
                  {i === 0 && (
                    <span className="badge-neutral absolute bottom-1 left-1 !bg-white/90 !py-0.5 !text-[10px]">
                      <Camera size={10} /> Principale
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-accent-500/10 px-3.5 py-3 text-sm text-accent-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Publication...
            </>
          ) : (
            "Publier l'annonce"
          )}
        </button>
      </form>
    </div>
  );
}
