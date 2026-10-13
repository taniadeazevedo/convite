import { cookies } from "next/headers";
import { cleanSource, trackSource } from "@/lib/stats";

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|monitor|curl|wget|headless/i;

// La portada avisa aquí de por dónde ha llegado la visita. Se cuenta, y se recuerda 30 días en una cookie
// propia para poder saber después qué canal acabó en venta. No identifica a nadie: solo guarda «instagram».
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const source = cleanSource(body?.source);
  if (!source || BOT.test(req.headers.get("user-agent") ?? "")) return Response.json({ ok: true });
  trackSource("visita", source);
  const store = await cookies();
  // Se conserva el primer origen: si alguien llega por Instagram y vuelve otro día directo, la venta es de Instagram
  if (!store.get("origen")) {
    store.set("origen", source, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 30 * 86400 });
  }
  return Response.json({ ok: true });
}
