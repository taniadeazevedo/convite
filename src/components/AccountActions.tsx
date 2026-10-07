"use client";

import { useState } from "react";

export function DeleteInvitationButton({ token, names }: { token: string; names: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      disabled={busy}
      className="text-sm text-soft underline"
      onClick={async () => {
        if (!confirm(`¿Eliminar la invitación de ${names}? Se borran también las confirmaciones y las fotos. No se puede deshacer.`)) return;
        setBusy(true);
        const res = await fetch(`/api/panel/${token}`, { method: "DELETE" }).catch(() => null);
        if (res?.ok) window.location.reload();
        else {
          alert("No se pudo eliminar. Inténtalo de nuevo.");
          setBusy(false);
        }
      }}
    >
      Eliminar
    </button>
  );
}

export function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/cuenta", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: new FormData(e.currentTarget).get("password") }),
    }).catch(() => null);
    if (res?.ok) {
      window.location.assign("/");
      return;
    }
    const body = await res?.json().catch(() => null);
    setError(body?.error ?? "No se pudo eliminar la cuenta");
    setBusy(false);
  }

  if (!open) {
    return (
      <button className="text-sm text-soft underline" onClick={() => setOpen(true)}>
        Eliminar mi cuenta
      </button>
    );
  }
  return (
    <form onSubmit={submit} className="max-w-sm space-y-3 rounded-2xl border border-rule bg-card p-5">
      <p className="text-sm">
        Se borrarán tu cuenta y <strong>todas</strong> tus invitaciones, con sus confirmaciones y fotos. No se puede
        deshacer. Escribe tu contraseña para confirmarlo.
      </p>
      <input name="password" type="password" required autoComplete="current-password" className="field" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={busy} className="btn bg-red-700 px-4 py-2 text-sm hover:bg-red-800">
          {busy ? "Eliminando…" : "Eliminar definitivamente"}
        </button>
        <button type="button" className="btn-ghost px-4 py-2 text-sm" onClick={() => setOpen(false)}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
