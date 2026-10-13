import type { MetadataRoute } from "next";
import { TEMPLATES } from "@/lib/templates";

// Lista de páginas que queremos que Google conozca: la portada y la demo de cada diseño.
// Las invitaciones de las parejas no están: son privadas y llevan «noindex».
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.SITE_URL ?? "http://localhost:3000";
  return [
    { url: `${origin}/`, changeFrequency: "weekly", priority: 1 },
    ...TEMPLATES.map((t) => ({ url: `${origin}/demo/${t.id}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${origin}/crear`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
