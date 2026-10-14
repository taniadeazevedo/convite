import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/content/articles";
import { PRODUCT_PAGES } from "@/lib/content/product-pages";
import { TEMPLATES } from "@/lib/templates";

// Lista de páginas que queremos que Google conozca: la portada y la demo de cada diseño.
// Las invitaciones de las parejas no están: son privadas y llevan «noindex».
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.SITE_URL ?? "http://localhost:3000";
  return [
    { url: `${origin}/`, changeFrequency: "weekly", priority: 1 },
    ...TEMPLATES.map((t) => ({ url: `${origin}/demo/${t.id}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...PRODUCT_PAGES.map((p) => ({ url: `${origin}/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: `${origin}/blog`, changeFrequency: "weekly", priority: 0.7 },
    ...ARTICLES.map((a) => ({ url: `${origin}/blog/${a.slug}`, lastModified: a.updated ?? a.date, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${origin}/crear`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
