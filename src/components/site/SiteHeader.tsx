import Link from "next/link";
import { BRAND } from "@/lib/templates";

// Cabecera de las páginas de contenido (guías y páginas de producto)
export default function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <Link href="/" className="font-serif text-3xl italic">
        {BRAND}
      </Link>
      <nav className="hidden gap-7 text-sm text-soft sm:flex">
        <Link href="/#disenos">Diseños</Link>
        <Link href="/#precio">Precio</Link>
        <Link href="/blog">Guías</Link>
      </nav>
      <Link href="/crear" className="btn text-sm">
        Crear invitación
      </Link>
    </header>
  );
}
