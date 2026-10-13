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

export type StatEvent = (typeof FUNNEL)[number][0];

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

// Día (AAAA-MM-DD) de hace `days - 1` días: el primer día de un periodo de `days` días que acaba hoy
export function firstDayOf(days: number): string {
  return new Date(Date.now() - (days - 1) * 86400_000).toISOString().slice(0, 10);
}

// Quién puede ver /cuenta/estadisticas: el correo de la variable ADMIN_EMAIL
export function isAdmin(email: string): boolean {
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(admin) && email.toLowerCase() === admin;
}
