import Link from "next/link";
import SimpleForm from "@/components/SimpleForm";
import { BRAND } from "@/lib/templates";

export const metadata = { title: `Nueva contraseña · ${BRAND}`, robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <main className="mx-auto flex min-h-svh max-w-sm flex-col justify-center px-6 py-12 text-center">
      <Link href="/" className="font-serif text-3xl italic">{BRAND}</Link>
      <h1 className="mt-8 font-serif text-5xl">Elige una contraseña nueva</h1>
      <SimpleForm
        action="/api/cuenta/restablecer"
        field="password"
        label="Contraseña nueva (mínimo 8 caracteres)"
        button="Guardar y entrar"
        extra={{ token }}
        redirectTo="/cuenta"
      />
    </main>
  );
}
