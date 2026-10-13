"use client";

import { useState } from "react";

// Aviso para quien todavía no ha confirmado su correo, con botón para volver a enviarlo
export default function VerifyNotice({ email }: { email: string }) {
  const [msg, setMsg] = useState("");
  async function resend() {
    setMsg("Enviando…");
    const res = await fetch("/api/cuenta/verificar", { method: "POST" }).catch(() => null);
    const json = await res?.json().catch(() => null);
    setMsg(res?.ok ? "Enviado. Revisad también la carpeta de spam." : (json?.error ?? "No se pudo enviar. Probad otra vez."));
  }
  return (
    <div className="mb-6 rounded-2xl border border-brand bg-card p-5 text-sm">
      <div className="font-semibold">Confirmad vuestro correo para poder publicar</div>
      <p className="mt-1 text-soft">
        Os hemos enviado un enlace a <strong className="text-ink">{email}</strong>. Si no es vuestra dirección o está mal
        escrita, no os llegarán ni la invitación ni los avisos de confirmaciones.
      </p>
      <button onClick={resend} className="btn-ghost mt-3 px-4 py-2 text-sm">
        Volver a enviar el correo
      </button>
      {msg && <p className="mt-2 text-soft">{msg}</p>}
    </div>
  );
}
