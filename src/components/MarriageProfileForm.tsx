"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { AlertCircle, Camera, ImagePlus, Loader2, X } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { ApiError, readErrorCode } from "@/lib/apiError";

type InitialProfile = {
  id: string;
  displayName: string;
  age: number;
  gender: string;
  lookingForGender: string;
  country: string;
  city: string;
  religiousPractice: string;
  maritalStatus: string;
  wantsChildren: string;
  bio: string;
  photoUrl: string | null;
  contactEmail: string;
  contactPhone: string;
} | null;

export function MarriageProfileForm({ initialProfile }: { initialProfile: InitialProfile }) {
  const router = useRouter();
  const t = useTranslations("mariage.create");
  const tGender = useTranslations("mariage.gender");
  const tReligious = useTranslations("mariage.religiousPractice");
  const tMarital = useTranslations("mariage.maritalStatus");
  const tWantsChildren = useTranslations("mariage.wantsChildren");
  const tCountry = useTranslations("mariage.country");
  const tErrors = useTranslations("errors");

  const [gender, setGender] = useState(initialProfile?.gender ?? "HOMME");
  const [lookingForGender, setLookingForGender] = useState(initialProfile?.lookingForGender ?? "FEMME");
  const [religiousPractice, setReligiousPractice] = useState(
    initialProfile?.religiousPractice ?? "MODEREMENT_PRATIQUANT"
  );
  const [maritalStatus, setMaritalStatus] = useState(initialProfile?.maritalStatus ?? "CELIBATAIRE");
  const [wantsChildren, setWantsChildren] = useState(initialProfile?.wantsChildren ?? "OUI");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialProfile?.photoUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleFile(fileList: FileList | null) {
    const picked = fileList?.[0];
    if (!picked) return;
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    setSubmitting(true);

    try {
      let photoUrl = initialProfile?.photoUrl ?? null;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const code = await readErrorCode(res);
          throw new ApiError(code, tErrors(code));
        }
        const data = await res.json();
        photoUrl = data.url;
      }

      const fd = new FormData(form);
      const payload = {
        displayName: fd.get("displayName"),
        age: Number(fd.get("age")),
        gender,
        lookingForGender,
        country: fd.get("country"),
        city: fd.get("city"),
        religiousPractice,
        maritalStatus,
        wantsChildren,
        bio: fd.get("bio"),
        photoUrl,
        contactEmail: fd.get("contactEmail"),
        contactPhone: fd.get("contactPhone"),
      };

      const res = await fetch("/api/mariage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const code = await readErrorCode(res);
        throw new ApiError(code, tErrors(code));
      }

      const { id } = await res.json();
      router.push(`/mariage/${id}`);
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
    <form onSubmit={handleSubmit} className="card space-y-6 p-6">
      <div>
        <label className="field-label" htmlFor="displayName">
          {t("displayNameLabel")}
        </label>
        <input
          id="displayName"
          name="displayName"
          required
          defaultValue={initialProfile?.displayName}
          placeholder={t("displayNamePlaceholder")}
          className="field-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label" htmlFor="age">
            {t("ageLabel")}
          </label>
          <input
            id="age"
            type="number"
            name="age"
            required
            min={18}
            max={100}
            defaultValue={initialProfile?.age}
            className="field-input"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="field-label">{t("genderLabel")}</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="field-select">
              <option value="HOMME">{tGender("HOMME")}</option>
              <option value="FEMME">{tGender("FEMME")}</option>
            </select>
          </div>
          <div>
            <label className="field-label">{t("lookingForLabel")}</label>
            <select
              value={lookingForGender}
              onChange={(e) => setLookingForGender(e.target.value)}
              className="field-select"
            >
              <option value="HOMME">{tGender("HOMME")}</option>
              <option value="FEMME">{tGender("FEMME")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label" htmlFor="country">
            {t("paysLabel")}
          </label>
          <select id="country" name="country" required defaultValue={initialProfile?.country ?? "FRANCE"} className="field-select">
            <option value="FRANCE">{tCountry("FRANCE")}</option>
            <option value="ALGERIE">{tCountry("ALGERIE")}</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="city">
            {t("villeLabel")}
          </label>
          <input id="city" name="city" required defaultValue={initialProfile?.city} className="field-input" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="field-label">{t("religiousPracticeLabel")}</label>
          <select
            value={religiousPractice}
            onChange={(e) => setReligiousPractice(e.target.value)}
            className="field-select"
          >
            <option value="PRATIQUANT">{tReligious("PRATIQUANT")}</option>
            <option value="MODEREMENT_PRATIQUANT">{tReligious("MODEREMENT_PRATIQUANT")}</option>
            <option value="NON_PRATIQUANT">{tReligious("NON_PRATIQUANT")}</option>
          </select>
        </div>
        <div>
          <label className="field-label">{t("maritalStatusLabel")}</label>
          <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className="field-select">
            <option value="CELIBATAIRE">{tMarital("CELIBATAIRE")}</option>
            <option value="DIVORCE">{tMarital("DIVORCE")}</option>
            <option value="VEUF">{tMarital("VEUF")}</option>
          </select>
        </div>
        <div>
          <label className="field-label">{t("wantsChildrenLabel")}</label>
          <select value={wantsChildren} onChange={(e) => setWantsChildren(e.target.value)} className="field-select">
            <option value="OUI">{tWantsChildren("OUI")}</option>
            <option value="NON">{tWantsChildren("NON")}</option>
            <option value="PEUT_ETRE">{tWantsChildren("PEUT_ETRE")}</option>
          </select>
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="bio">
          {t("bioLabel")}
        </label>
        <textarea
          id="bio"
          name="bio"
          required
          rows={5}
          defaultValue={initialProfile?.bio}
          placeholder={t("bioPlaceholder")}
          className="field-input resize-none"
        />
      </div>

      <div>
        <p className="field-label mb-2">{t("contactTitle")}</p>
        <p className="mb-3 text-xs text-neutral-500">{t("contactHint")}</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="contactEmail">
              {t("contactEmailLabel")}
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              required
              defaultValue={initialProfile?.contactEmail}
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
              defaultValue={initialProfile?.contactPhone}
              className="field-input"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="field-label">{t("photoLabel")}</label>
        {preview ? (
          <div className="group relative aspect-square w-32 overflow-hidden rounded-lg bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview or existing remote URL, not an optimizable Next asset here */}
            <img src={preview} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="absolute end-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <label
            htmlFor="photo"
            className="flex w-32 cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center transition hover:border-brand-400 hover:bg-brand-50/50"
          >
            <ImagePlus size={22} className="text-neutral-400" />
            <span className="text-xs text-neutral-500">{t("photoCta")}</span>
            <input
              id="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                handleFile(e.target.files);
                e.target.value = "";
              }}
              className="sr-only"
            />
          </label>
        )}
        <p className="mt-1 flex items-center gap-1 text-xs text-neutral-400">
          <Camera size={11} /> {t("photoHint")}
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-error-50 px-3.5 py-3 text-sm text-error-700">
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
  );
}
