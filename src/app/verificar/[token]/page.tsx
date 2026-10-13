import Link from "next/link";
import { verifyEmailToken } from "@/lib/db";
import { BRAND } from "@/lib/templates";
import { hashToken } from "@/lib/verify";

export const metadata = { title: `Confirmar correo · ${BRAND}`, robots: { index: false } };

// Página a la que lleva el enlace del correo de bienvenida
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const ok = verifyEmailToken(hashToken((await params).token));
  return (
    <main className="mx-auto flex min-h-svh max-w-sm flex-col justify-center px-6 py-12 text-center">
      <Link href="/" className="font-serif text-3xl italic">{BRAND}</Link>
      <h1 className="mt-8 font-serif text-5xl">{ok ? "Correo confirmado" : "Enlace caducado"}</h1>
      <p className="mt-3 text-soft">
        {ok
          ? "Ya está todo listo. Podéis seguir con vuestra invitación."
          : "Este enlace ya se ha usado o ha caducado. Entrad en vuestra cuenta y pedid uno nuevo desde el aviso que aparece arriba."}
      </p>
      <Link href="/cuenta" className="btn mt-8">
        Ir a nuestra cuenta
      </Link>
    </main>
  );
}
