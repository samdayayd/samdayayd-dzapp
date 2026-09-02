"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { AlertCircle, Loader2, LogIn, Mail } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { PasswordField } from "@/components/PasswordField";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth.login");
  const tAuth = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(t("invalidCredentials"));
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-sm flex-col justify-center px-4 py-16">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <LogIn size={22} />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-neutral-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-neutral-500">{t("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <div>
          <label className="field-label" htmlFor="email">
            {t("emailLabel")}
          </label>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input ps-9"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="field-label" htmlFor="password">
              {t("passwordLabel")}
            </label>
            <Link
              href="/forgot-password"
              className="mb-1.5 text-xs font-medium text-brand-700 hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <PasswordField
            id="password"
            value={password}
            onChange={setPassword}
            required
            autoComplete="current-password"
            showLabel={tAuth("showPassword")}
            hideLabel={tAuth("hidePassword")}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-accent-500/10 px-3.5 py-2.5 text-sm text-accent-700">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t("submitting")}
            </>
          ) : (
            t("submit")
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-neutral-500">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-medium text-brand-700 hover:underline">
          {t("createAccount")}
        </Link>
      </p>
    </div>
  );
}
