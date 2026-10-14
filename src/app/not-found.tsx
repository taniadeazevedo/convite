import Link from "next/link";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

// Página para direcciones que no existen (o invitaciones que ya se retiraron)
export default function NotFound() {
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-brand">Error 404</p>
        <h1 className="mt-4 font-serif text-6xl">Esta página no existe</h1>
        <p className="mt-4 text-lg text-soft">
          Puede que el enlace esté mal escrito o que la invitación ya no esté publicada. Si buscabais la invitación de una
          boda, pedid el enlace de nuevo a los novios.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn">Ir al inicio</Link>
          <Link href="/#disenos" className="btn-ghost">Ver los diseños</Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
