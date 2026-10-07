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
    } else if (res?.status === 401) {
      router.push("/registro?next=/crear");
    } else {
      setBusy(false);
      alert("No se pudo crear la invitación. Inténtalo de nuevo.");
    }
  }

  return (
    <button onClick={create} disabled={busy} className="btn flex-1 text-sm">
      {busy ? "Creando…" : "Elegir este"}
    </button>
  );
}
