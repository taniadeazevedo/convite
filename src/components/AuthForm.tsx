"use client";

import Link from "next/link";
import { useState } from "react";

// Solo se aceptan destinos internos, para que nadie pueda usar el login como redirección a otra web
const safeNext = (next: string | undefined) => (next && /^\/(?!\/)/.test(next) ? next : "/cuenta");

export default function AuthForm({ mode, next }: { mode: "registro" | "entrar"; next?: string }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const register = mode === "registro";
  const dest = safeNext(next);
  const other = `${register ? "/entrar" : "/registro"}?next=${encodeURIComponent(dest)}`;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const res = await fetch(`/api/cuenta/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: f.get("email"), password: f.get("password"), terms: f.get("terms") === "on" }),
    }).catch(() => null);
    if (res?.ok) {
      window.location.href = dest;
      return;
    }
    const body = await res?.json().catch(() => null);
    setError(body?.error ?? "No se pudo completar. Inténtalo de nuevo.");
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4 text-left">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Correo electrónico</span>
        <input name="email" type="email" required autoComplete="email" className="field" />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Contraseña</span>
        <input
          name="password"
          type="password"
          required
          minLength={register ? 8 : undefined}
          autoComplete={register ? "new-password" : "current-password"}
          className="field"
        />
        {register ? (
          <span className="mt-1 block text-xs text-soft">Mínimo 8 caracteres.</span>
        ) : (
          <Link href="/recuperar" className="mt-1 block text-xs text-soft underline">He olvidado mi contraseña</Link>
        )}
      </label>
      {register && (
        <label className="flex items-start gap-2 text-sm">
          <input name="terms" type="checkbox" required className="mt-0.5 h-4 w-4 accent-[var(--brand)]" />
          <span>
            Acepto los{" "}
            <Link href="/legal/terminos" target="_blank" className="underline">términos y condiciones</Link> y la{" "}
            <Link href="/legal/privacidad" target="_blank" className="underline">política de privacidad</Link>.
          </span>
        </label>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={busy} className="btn w-full">
        {busy ? "Un momento…" : register ? "Crear cuenta" : "Entrar"}
      </button>
      <p className="text-center text-sm text-soft">
        {register ? "¿Ya tienes cuenta?" : "¿Todavía no tienes cuenta?"}{" "}
        <Link href={other} className="underline">{register ? "Entra" : "Créala gratis"}</Link>
      </p>
    </form>
  );
}
