"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import {
  AlertCircle,
  Camera,
  ImagePlus,
  Loader2,
  LogIn,
  ShoppingBag,
  X,
} from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError, readErrorCode } from "@/lib/apiError";

export default function NewItemPage() {
  const router = useRouter();
  const { status } = useSession();
  const t = useTranslations("achatVente.create");
  const tCategory = useTranslations("achatVente.itemCategory");
  const tCondition = useTranslations("achatVente.condition");
  const tCountry = useTranslations("achatVente.country");
  const tErrors = useTranslations("errors");

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [condition, setCondition] = useState<"NEUF" | "OCCASION">("OCCASION");
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
          {t("loginRequiredTitle")}
        </p>
        <p className="mt-1 text-sm text-neutral-500">{t("loginRequiredBody")}</p>
        <Link href="/login" className="btn-primary mt-6">
          {t("loginCta")}
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
        if (!res.ok) {
          const code = await readErrorCode(res);
          throw new ApiError(code, tErrors(code));
        }
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
        itemCategory: fd.get("itemCategory"),
        condition,
        contactName: fd.get("contactName"),
        contactEmail: fd.get("contactEmail"),
        contactPhone: fd.get("contactPhone"),
        imageUrls,
      };

      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const code = await readErrorCode(res);
        throw new ApiError(code, tErrors(code));
      }

      const { id } = await res.json();
      router.push(`/achat-vente/${id}`);
    } catch (err) {
      if (err instanceof ApiError && err.code === "SESSION_STALE") {
        await signOut({ redirect: false });
        router.push("/login");
        return;
      }
      setError(err instanceof Error ? err.message : tErrors("GENERIC"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
          <ShoppingBag size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{t("title")}</h1>
          <p className="text-sm text-neutral-500">{t("subtitle")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6 p-6">
        <div>
          <label className="field-label">{t("conditionLabel")}</label>
          <div className="inline-flex rounded-lg border border-neutral-300 p-1">
            {(["NEUF", "OCCASION"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCondition(option)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                  condition === option
                    ? "bg-brand-600 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {tCondition(option)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="title">
            {t("titleLabel")}
          </label>
          <input
            id="title"
            name="title"
            required
            placeholder={t("titlePlaceholder")}
            className="field-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label" htmlFor="itemCategory">
              {t("categoryLabel")}
            </label>
            <select id="itemCategory" name="itemCategory" required className="field-select">
              <option value="ELECTRONIQUE">{tCategory("ELECTRONIQUE")}</option>
              <option value="MEUBLE">{tCategory("MEUBLE")}</option>
              <option value="VETEMENTS">{tCategory("VETEMENTS")}</option>
              <option value="LOISIRS">{tCategory("LOISIRS")}</option>
              <option value="MAISON">{tCategory("MAISON")}</option>
              <option value="AUTRE">{tCategory("AUTRE")}</option>
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="price">
              {t("priceLabel")}
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label" htmlFor="country">
              {t("paysLabel")}
            </label>
            <select id="country" name="country" required className="field-select">
              <option value="FRANCE">{tCountry("FRANCE")}</option>
              <option value="ALGERIE">{tCountry("ALGERIE")}</option>
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="city">
              {t("villeLabel")}
            </label>
            <input id="city" name="city" required className="field-input" />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="description">
            {t("descriptionLabel")}
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            placeholder={t("descriptionPlaceholder")}
            className="field-input resize-none"
          />
        </div>

        <div>
          <p className="field-label mb-2">{t("contactTitle")}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="field-label" htmlFor="contactName">
                {t("contactNameLabel")}
              </label>
              <input id="contactName" name="contactName" required className="field-input" />
            </div>
            <div>
              <label className="field-label" htmlFor="contactEmail">
                {t("contactEmailLabel")}
              </label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                required
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="contactPhone">
                {t("contactPhoneLabel")}
              </label>
              <input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                required
                className="field-input"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="field-label">{t("photosLabel")}</label>
          <label
            htmlFor="photos"
            className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center transition hover:border-brand-400 hover:bg-brand-50/50"
          >
            <ImagePlus size={22} className="text-neutral-400" />
            <span className="text-sm text-neutral-600">
              <span className="font-medium text-brand-700">{t("photosCta")}</span>{" "}
              {t("photosOr")}
            </span>
            <span className="text-xs text-neutral-400">{t("photosHint")}</span>
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
                    className="absolute end-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X size={12} />
                  </button>
                  {i === 0 && (
                    <span className="badge-neutral absolute bottom-1 start-1 !bg-white/90 !py-0.5 !text-[10px]">
                      <Camera size={10} /> {t("photoMain")}
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
              {t("submitting")}
            </>
          ) : (
            t("submit")
          )}
        </button>
      </form>
    </div>
  );
}
