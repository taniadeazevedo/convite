import Link from "next/link";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import TrackSource from "@/components/TrackSource";
import { ARTICLES } from "@/lib/content/articles";
import { BRAND, formatDate } from "@/lib/templates";

export const metadata = {
  title: `Guías para organizar vuestra boda · ${BRAND}`,
  description: "Textos para invitaciones, cuándo enviarlas, cómo pedir confirmación y más: guías prácticas para organizar vuestra boda.",
  alternates: { canonical: "/blog" },
};

// Índice de guías, de la más reciente a la más antigua
export default function Blog() {
  const articles = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <main>
      <TrackSource />
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 pt-10 pb-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-brand">Guías</p>
        <h1 className="mt-4 font-serif text-6xl">Ideas para vuestra boda</h1>
        <p className="mt-4 text-lg text-soft">Todo lo que hay que saber sobre las invitaciones, explicado sin rodeos.</p>
      </section>
      <section className="mx-auto grid max-w-5xl gap-5 px-6 py-10 md:grid-cols-2">
        {articles.map((a) => (
          <Link key={a.slug} href={`/blog/${a.slug}`} className="rounded-3xl border border-rule bg-card p-7 transition-transform hover:-translate-y-1">
            <p className="text-xs uppercase tracking-wider text-soft">
              {formatDate(a.date).replace(/^\S+\s/, "")} · {a.readingMinutes} min de lectura
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight">{a.title}</h2>
            <p className="mt-3 text-soft">{a.description}</p>
            <p className="mt-4 text-sm font-medium underline">Leer la guía</p>
          </Link>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
