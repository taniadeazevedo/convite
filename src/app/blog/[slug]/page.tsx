import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContentBlocks, { FaqList, JsonLd, faqJsonLd } from "@/components/site/ContentBlocks";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import TrackSource from "@/components/TrackSource";
import { ARTICLES, getArticle } from "@/lib/content/articles";
import { BRAND, formatDate } from "@/lib/templates";

type Props = { params: Promise<{ slug: string }> };

// Las guías se generan al compilar: son páginas estáticas, muy rápidas
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return {
    title: a.seoTitle,
    description: a.description,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: { type: "article", title: a.seoTitle, description: a.description, url: `/blog/${a.slug}`, publishedTime: a.date },
  };
}

export default async function Article({ params }: Props) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const origin = process.env.SITE_URL ?? "";
  const others = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 2);
  return (
    <main>
      <TrackSource />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.description,
          datePublished: a.date,
          dateModified: a.updated ?? a.date,
          author: { "@type": "Organization", name: BRAND, url: origin || undefined },
          publisher: { "@type": "Organization", name: BRAND },
          mainEntityOfPage: `${origin}/blog/${a.slug}`,
        }}
      />
      {a.faq && <JsonLd data={faqJsonLd(a.faq)} />}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: BRAND, item: `${origin}/` },
            { "@type": "ListItem", position: 2, name: "Guías", item: `${origin}/blog` },
            { "@type": "ListItem", position: 3, name: a.title },
          ],
        }}
      />
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 pt-6 pb-16">
        <nav className="text-sm text-soft">
          <Link href="/blog" className="underline">Guías</Link> / <span>{a.title}</span>
        </nav>
        <h1 className="mt-6 font-serif text-5xl leading-[1.05] sm:text-6xl">{a.title}</h1>
        <p className="mt-4 text-sm text-soft">
          {formatDate(a.updated ?? a.date).replace(/^\S+\s/, "")} · {a.readingMinutes} min de lectura
        </p>
        <p className="mt-8 text-xl leading-relaxed text-ink">{a.intro}</p>
        <div className="mt-6">
          <ContentBlocks blocks={a.blocks} ctaHref="/#disenos" />
        </div>
        {a.faq && (
          <section className="mt-14">
            <h2 className="font-serif text-4xl">Preguntas frecuentes</h2>
            <div className="mt-4">
              <FaqList faq={a.faq} />
            </div>
          </section>
        )}
        {others.length > 0 && (
          <section className="mt-14 border-t border-rule pt-8">
            <p className="text-sm uppercase tracking-wider text-soft">Seguid leyendo</p>
            <ul className="mt-3 space-y-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/blog/${o.slug}`} className="font-serif text-2xl underline">{o.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
      <SiteFooter />
    </main>
  );
}
