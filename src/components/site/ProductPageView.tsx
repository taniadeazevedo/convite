import type { Metadata } from "next";
import DesignsGrid from "@/components/DesignsGrid";
import TrackSource from "@/components/TrackSource";
import ContentBlocks, { FaqList, JsonLd, faqJsonLd } from "./ContentBlocks";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import type { ProductPage } from "@/lib/content/types";

export function productMetadata(p: ProductPage): Metadata {
  return {
    title: p.seoTitle,
    description: p.description,
    alternates: { canonical: `/${p.slug}` },
    openGraph: { title: p.seoTitle, description: p.description, url: `/${p.slug}` },
  };
}

// Página de producto: texto pensado para una búsqueda concreta + los diseños para probar con vuestros nombres
export default function ProductPageView({ page }: { page: ProductPage }) {
  return (
    <main>
      <TrackSource />
      <JsonLd data={faqJsonLd(page.faq)} />
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 pt-10 pb-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-brand">{page.eyebrow}</p>
        <h1 className="mt-4 font-serif text-5xl leading-[1.02] sm:text-6xl">{page.title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-soft">{page.intro}</p>
      </section>
      <article className="mx-auto max-w-3xl px-6 py-8">
        <ContentBlocks blocks={page.blocks} ctaHref="#disenos" />
      </article>
      <section id="disenos" className="mx-auto max-w-6xl scroll-mt-6 px-6 py-16">
        <h2 className="text-center font-serif text-5xl">{page.featured?.length ? "Los diseños que mejor encajan" : "Elegid vuestro diseño"}</h2>
        <DesignsGrid featured={page.featured} />
      </section>
      <section className="mx-auto max-w-2xl px-6 pb-20">
        <h2 className="text-center font-serif text-4xl">Preguntas frecuentes</h2>
        <div className="mt-6">
          <FaqList faq={page.faq} />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
