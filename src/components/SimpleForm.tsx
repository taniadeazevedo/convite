"use client";

import { useState } from "react";

// Formulario de un solo campo para recuperar y restablecer la contraseña
export default function SimpleForm({
  action,
  field,
  label,
  button,
  extra,
  done,
  redirectTo,
}: {
  action: string;
  field: "email" | "password";
  label: string;
  button: string;
  extra?: Record<string, string>;
  done?: string;
  redirectTo?: string;
}) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    setError("");
    const value = new FormData(e.currentTarget).get(field);
    const res = await fetch(action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...extra, [field]: value }),
    }).catch(() => null);
    if (res?.ok) {
      if (redirectTo) window.location.assign(redirectTo);
      else setState("done");
      return;
    }
    const body = await res?.json().catch(() => null);
    setError(body?.error ?? "No se pudo completar. Inténtalo de nuevo.");
    setState("idle");
  }

  if (state === "done") return <p className="mt-8 rounded-2xl border border-rule bg-card p-5">{done}</p>;

  return (
    <form onSubmit={submit} className="mt-8 space-y-4 text-left">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">{label}</span>
        <input
          name={field}
          type={field}
          required
          minLength={field === "password" ? 8 : undefined}
          autoComplete={field === "password" ? "new-password" : "email"}
          className="field"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={state === "busy"} className="btn w-full">
        {state === "busy" ? "Un momento…" : button}
      </button>
    </form>
  );
}
