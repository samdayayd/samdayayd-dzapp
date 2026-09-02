"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export function PasswordField({
  id,
  value,
  onChange,
  required,
  minLength,
  autoComplete,
  showLabel,
  hideLabel,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
  showLabel: string;
  hideLabel: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Lock
        size={16}
        className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-neutral-400"
      />
      <input
        id={id}
        type={visible ? "text" : "password"}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field-input ps-9 pe-9"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        title={visible ? hideLabel : showLabel}
        aria-label={visible ? hideLabel : showLabel}
        className="absolute end-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 transition hover:text-neutral-600"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
