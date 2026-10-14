import Link from "next/link";
import { LEGAL_LINKS } from "@/components/LegalPage";
import { ARTICLES } from "@/lib/content/articles";
import { PRODUCT_PAGES } from "@/lib/content/product-pages";
import { LEGAL } from "@/lib/legal";
import { BRAND } from "@/lib/templates";

// Pie común. Además de los textos legales enlaza las páginas de producto y las guías:
// así Google las encuentra desde cualquier página y entiende cómo se relacionan.
export default function SiteFooter() {
  return (
    <footer className="border-t border-rule px-6 py-10 text-sm text-soft">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
        <div>
          <p className="font-medium text-ink">Invitaciones</p>
          <ul className="mt-3 space-y-2">
            {PRODUCT_PAGES.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} className="hover:underline">{p.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-medium text-ink">Guías</p>
          <ul className="mt-3 space-y-2">
            {ARTICLES.map((a) => (
              <li key={a.slug}>
                <Link href={`/blog/${a.slug}`} className="hover:underline">{a.seoTitle}</Link>
              </li>
            ))}
            <li>
              <Link href="/blog" className="underline">Todas las guías</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-ink">{BRAND}</p>
          <ul className="mt-3 space-y-2">
            {LEGAL_LINKS.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:underline">{label}</Link>
              </li>
            ))}
            <li>
              <a href={`mailto:${LEGAL.email}`} className="hover:underline">{LEGAL.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <p className="mt-10 text-center">© {new Date().getFullYear()} {BRAND} · Fotos de ejemplo de Unsplash</p>
    </footer>
  );
}
