"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateButton({ template }: { template: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    const res = await fetch("/api/invitaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template }),
    }).catch(() => null);
    if (res?.ok) {
      const { token } = await res.json();
      router.push(`/panel/${token}`);
    } else {
      const body = await res?.json().catch(() => null);
      setBusy(false);
      alert(body?.error ?? "No se pudo crear la invitación. Inténtalo de nuevo.");
    }
  }

  return (
    <button onClick={create} disabled={busy} className="btn flex-1 text-sm">
      {busy ? "Creando…" : "Elegir este"}
    </button>
  );
}
