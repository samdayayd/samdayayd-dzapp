"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { AlertCircle, Check, Copy, KeyRound, Loader2, LogIn } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ApiError, readErrorCode } from "@/lib/apiError";

interface Invite {
  code: string;
  createdAt: string;
  usedAt: string | null;
  usedByEmail: string | null;
}

export default function InvitesPage() {
  const { status } = useSession();
  const t = useTranslations("invites");
  const tErrors = useTranslations("errors");

  const [invites, setInvites] = useState<Invite[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    fetch("/api/invites")
      .then(async (res) => {
        if (!res.ok) throw new ApiError(await readErrorCode(res), "");
        return res.json();
      })
      .then(setInvites)
      .catch((e) => setError(e instanceof ApiError ? tErrors(e.code) : tErrors("GENERIC")));
  }, [tErrors]);

  useEffect(() => {
    if (status === "authenticated") load();
  }, [status, load]);

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

  const handleCreate = async () => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/invites", { method: "POST" });
      if (!res.ok) throw new ApiError(await readErrorCode(res), "");
      load();
    } catch (e) {
      setError(e instanceof ApiError ? tErrors(e.code) : tErrors("GENERIC"));
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode((c) => (c === code ? null : c)), 1500);
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <KeyRound size={22} />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-neutral-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-neutral-500">{t("subtitle")}</p>
      </div>

      <button onClick={handleCreate} disabled={creating} className="btn-primary mx-auto flex">
        {creating ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {t("creating")}
          </>
        ) : (
          t("createButton")
        )}
      </button>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-accent-500/10 px-3.5 py-2.5 text-sm text-accent-700">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-8">
        {invites === null ? (
          <p className="text-center text-sm text-neutral-500">{t("loading")}</p>
        ) : invites.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
            {t("empty")}
          </p>
        ) : (
          <div className="card divide-y divide-neutral-100 overflow-hidden">
            {invites.map((invite) => (
              <div key={invite.code} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold tracking-widest text-neutral-900">{invite.code}</p>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {new Date(invite.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {invite.usedAt ? (
                  <span className="shrink-0 text-xs text-neutral-400">
                    {t("usedBy", { email: invite.usedByEmail ?? "" })}
                  </span>
                ) : (
                  <button
                    onClick={() => handleCopy(invite.code)}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
                  >
                    {copiedCode === invite.code ? (
                      <>
                        <Check size={13} />
                        {t("copied")}
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        {t("copy")}
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
