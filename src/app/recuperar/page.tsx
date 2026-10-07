import Link from "next/link";
import SimpleForm from "@/components/SimpleForm";
import { BRAND } from "@/lib/templates";

export const metadata = { title: `Recuperar contraseña · ${BRAND}` };

export default function Page() {
  return (
    <main className="mx-auto flex min-h-svh max-w-sm flex-col justify-center px-6 py-12 text-center">
      <Link href="/" className="font-serif text-3xl italic">{BRAND}</Link>
      <h1 className="mt-8 font-serif text-5xl">¿Has olvidado la contraseña?</h1>
      <p className="mt-2 text-soft">Escribe tu correo y te enviamos un enlace para elegir una nueva.</p>
      <SimpleForm
        action="/api/cuenta/recuperar"
        field="email"
        label="Correo electrónico"
        button="Enviar enlace"
        done="Si hay una cuenta con ese correo, acabamos de enviarle un enlace. Revisa también la carpeta de spam."
      />
      <Link href="/entrar" className="mt-6 text-sm text-soft underline">Volver a entrar</Link>
    </main>
  );
}
