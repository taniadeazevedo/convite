"use client";

import { useState } from "react";

export default function GuestUpload({ slug, initialLeft }: { slug: string; initialLeft: number }) {
  const [left, setLeft] = useState(initialLeft);
  const [sent, setSent] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch(`/api/i/${slug}/fotos`, { method: "POST", body }).catch(() => null);
      const json = await res?.json().catch(() => null);
      if (!res?.ok) {
        setError(json?.error ?? "No se pudo subir la foto");
        break;
      }
      setLeft(json.left);
      setSent((n) => n + 1);
    }
    setBusy(false);
  }

  if (left <= 0) return <p className="mt-8 text-soft">El álbum ya está completo. ¡Gracias!</p>;

  return (
    <div className="mt-8">
      <label className={`btn cursor-pointer ${busy ? "opacity-60" : ""}`}>
        {busy ? "Subiendo…" : "Elegir fotos"}
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            upload(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
      {sent > 0 && (
        <p className="mt-4 font-semibold">
          {sent === 1 ? "1 foto enviada" : `${sent} fotos enviadas`}. ¡Gracias!
        </p>
      )}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <p className="mt-4 text-xs text-soft">JPG, PNG o WebP, hasta 12 MB cada una. Solo las verán los novios.</p>
    </div>
  );
}
