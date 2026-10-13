import { headers } from "next/headers";
import { addStat } from "./db";

// Pasos del embudo, en orden. Se cuentan en el servidor, sin cookies ni datos personales.
export const FUNNEL = [
  ["portada", "Visitas a la portada"],
  ["demo", "Ven un diseño de ejemplo"],
  ["elegir", "Entran a elegir diseño"],
  ["borrador", "Empiezan una invitación"],
  ["cuenta", "Crean cuenta"],
  ["pago", "Pulsan «Publicar»"],
  ["venta", "Pagan"],
] as const;

// "premium": ventas hechas directamente en Premium · "mejora": Esencial que pasa después a Premium
export type StatEvent = (typeof FUNNEL)[number][0] | "premium" | "mejora";

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|monitor|curl|wget|headless/i;

// Suma uno al contador de hoy. Nunca lanza error: medir no debe romper la página.
export function track(event: StatEvent) {
  try {
    addStat(event);
  } catch (e) {
    console.error("Estadísticas:", e);
  }
}

// Para páginas: no cuenta robots ni las vistas previas de WhatsApp y redes
export async function trackVisit(event: StatEvent) {
  const agent = (await headers()).get("user-agent") ?? "";
  if (!agent || BOT.test(agent)) return;
  track(event);
}

// --- Origen de las visitas (instagram, google, un colaborador…)

// Solo letras, números y guiones, para poder usarlo como nombre de contador
export function cleanSource(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const s = value.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 30);
  return s || null;
}

// Contadores por origen: visita@instagram, borrador@instagram, venta@instagram
export function trackSource(step: "visita" | "borrador", source: string) {
  try {
    addStat(`${step}@${source}`);
  } catch (e) {
    console.error("Estadísticas:", e);
  }
}

// Día (AAAA-MM-DD) de hace `days - 1` días: el primer día de un periodo de `days` días que acaba hoy
export function firstDayOf(days: number): string {
  return new Date(Date.now() - (days - 1) * 86400_000).toISOString().slice(0, 10);
}

// Quién puede ver /cuenta/estadisticas: el correo de la variable ADMIN_EMAIL, y solo si lo ha confirmado
// (así nadie puede registrarse con esa dirección sin tener acceso a su buzón y ver las cifras)
export function isAdminEmail(email: string): boolean {
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(admin) && email.toLowerCase() === admin;
}
export function isAdmin(user: { email: string; verified: boolean }): boolean {
  return user.verified && isAdminEmail(user.email);
}
