"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import { AlertCircle, Briefcase, Loader2, LogIn } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError, readErrorCode } from "@/lib/apiError";

export default function NewJobPage() {
  const router = useRouter();
  const { status } = useSession();
  const t = useTranslations("emploi.create");
  const tJobType = useTranslations("emploi.jobType");
  const tCountry = useTranslations("emploi.country");
  const tErrors = useTranslations("errors");

  const [jobType, setJobType] = useState<"CDI" | "CDD" | "STAGE" | "FREELANCE" | "INTERIM">("CDI");
  const [remote, setRemote] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === "loading") return null;

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <LogIn size={26} />
        </div>
        <p className="mt-4 text-lg font-medium text-neutral-900">{t("loginRequiredTitle")}</p>
        <p className="mt-1 text-sm text-neutral-500">{t("loginRequiredBody")}</p>
        <Link href="/login" className="btn-primary mt-6">
          {t("loginCta")}
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    setSubmitting(true);

    try {
      const fd = new FormData(form);
      const salaryMinRaw = fd.get("salaryMin");
      const salaryMaxRaw = fd.get("salaryMax");
      const payload = {
        title: fd.get("title"),
        description: fd.get("description"),
        company: fd.get("company"),
        country: fd.get("country"),
        city: fd.get("city"),
        jobType,
        remote,
        salaryMin: salaryMinRaw ? Number(salaryMinRaw) : null,
        salaryMax: salaryMaxRaw ? Number(salaryMaxRaw) : null,
        contactName: fd.get("contactName"),
        contactEmail: fd.get("contactEmail"),
        contactPhone: fd.get("contactPhone"),
      };

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const code = await readErrorCode(res);
        throw new ApiError(code, tErrors(code));
      }

      const { id } = await res.json();
      router.push(`/emploi/${id}`);
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
          <Briefcase size={22} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">{t("title")}</h1>
          <p className="text-sm text-neutral-500">{t("subtitle")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6 p-6">
        <div>
          <label className="field-label">{t("typeLabel")}</label>
          <div className="flex flex-wrap gap-1 rounded-lg border border-neutral-300 p-1">
            {(["CDI", "CDD", "STAGE", "FREELANCE", "INTERIM"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setJobType(option)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  jobType === option ? "bg-brand-600 text-white" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {tJobType(option)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="title">
            {t("titleLabel")}
          </label>
          <input id="title" name="title" required placeholder={t("titlePlaceholder")} className="field-input" />
        </div>

        <div>
          <label className="field-label" htmlFor="company">
            {t("companyLabel")}
          </label>
          <input id="company" name="company" required className="field-input" />
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

        <label className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
          <input
            type="checkbox"
            checked={remote}
            onChange={(e) => setRemote(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500/30"
          />
          {t("remoteLabel")}
        </label>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label" htmlFor="salaryMin">
              {t("salaryMinLabel")}
            </label>
            <input id="salaryMin" type="number" name="salaryMin" min={1} max={2_000_000_000} className="field-input" />
          </div>
          <div>
            <label className="field-label" htmlFor="salaryMax">
              {t("salaryMaxLabel")}
            </label>
            <input id="salaryMax" type="number" name="salaryMax" min={1} max={2_000_000_000} className="field-input" />
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
              <input id="contactEmail" name="contactEmail" type="email" required className="field-input" />
            </div>
            <div>
              <label className="field-label" htmlFor="contactPhone">
                {t("contactPhoneLabel")}
              </label>
              <input id="contactPhone" name="contactPhone" type="tel" required className="field-input" />
            </div>
          </div>
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
    </div>
  );
}
