import type { MetadataRoute } from "next";

// Qué pueden recorrer los buscadores: la web pública sí; paneles, cuentas y la parte interna, no
export default function robots(): MetadataRoute.Robots {
  const origin = process.env.SITE_URL ?? "http://localhost:3000";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/panel/", "/cuenta", "/api/", "/i/", "/restablecer/", "/verificar/"] }],
    sitemap: `${origin}/sitemap.xml`,
  };
}
