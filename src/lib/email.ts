import fs from "node:fs";
import path from "node:path";
import { DATA_DIR } from "./db";
import { BRAND } from "./templates";

type Mail = { to: string; subject: string; text: string };

// Envía un correo con Resend si hay clave configurada. Sin clave (desarrollo), lo deja escrito en
// data/correos.log para poder ver qué se habría enviado. Nunca lanza error: un correo que falla
// no debe romper el registro ni una confirmación de asistencia.
export async function sendEmail({ to, subject, text }: Mail): Promise<void> {
  const body = `${text}\n\n— ${BRAND}`;
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  try {
    if (key && from) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, subject, text: body }),
      });
      if (!res.ok) console.error("No se pudo enviar el correo:", res.status, await res.text());
      return;
    }
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.appendFileSync(
      path.join(DATA_DIR, "correos.log"),
      `--- ${new Date().toISOString()}\nPara: ${to}\nAsunto: ${subject}\n\n${body}\n\n`,
    );
  } catch (e) {
    console.error("No se pudo enviar el correo:", e);
  }
}

export function siteOrigin(req: Request): string {
  return process.env.SITE_URL ?? new URL(req.url).origin;
}
