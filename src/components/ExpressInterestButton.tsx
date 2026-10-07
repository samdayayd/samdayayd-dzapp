"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Heart, Loader2, Mail, Phone } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

type State = "idle" | "sending" | "sent" | "matched" | "error";

/** Posts interest in a profile and reflects the result — sent, or an
    immediate match with contact info in the same response (see the API
    route's comment: contact info is only ever returned here, never
    rendered server-side before a match is real). */
export function ExpressInterestButton({
  profileId,
  initialState,
  initialContact,
}: {
  profileId: string;
  initialState: "none" | "sent" | "matched";
  initialContact?: { email: string; phone: string };
}) {
  const t = useTranslations("mariage.detail");
  const router = useRouter();
  const [state, setState] = useState<State>(initialState === "none" ? "idle" : (initialState as State));
  const [contact, setContact] = useState(initialContact ?? null);

  async function handleClick() {
    setState("sending");
    try {
      const res = await fetch(`/api/mariage/${profileId}/interest`, { method: "POST" });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        setState("error");
        return;
      }
      const data = await res.json();
      if (data.matched) {
        setContact({ email: data.contactEmail, phone: data.contactPhone });
        setState("matched");
      } else {
        setState("sent");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "matched" && contact) {
    return (
      <div className="card space-y-3 p-5">
        <p className="flex items-center gap-2 font-semibold text-brand-700">
          <Heart size={18} className="fill-brand-600 text-brand-600" />
          {t("matched")}
        </p>
        <a href={`tel:${contact.phone}`} className="btn-primary w-full">
          <Phone size={16} />
          {t("call")}
        </a>
        <a href={`mailto:${contact.email}`} className="btn-secondary w-full">
          <Mail size={16} />
          {t("email")}
        </a>
      </div>
    );
  }

  if (state === "sent") {
    return (
      <div className="card flex items-center gap-2 p-5 text-sm font-medium text-neutral-600">
        <Heart size={16} className="text-brand-600" />
        {t("interestSent")}
      </div>
    );
  }

  return (
    <div className="card p-5">
      <button
        type="button"
        onClick={handleClick}
        disabled={state === "sending"}
        className="btn-primary w-full"
      >
        {state === "sending" ? <Loader2 size={16} className="animate-spin" /> : <Heart size={16} />}
        {t("expressInterest")}
      </button>
      {state === "error" && <p className="field-error">{t("interestError")}</p>}
    </div>
  );
}
