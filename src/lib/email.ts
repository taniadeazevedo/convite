import fs from "node:fs";
import path from "node:path";
import { DATA_DIR } from "./db";
import { LEGAL } from "./legal";
import { BRAND } from "./templates";

// title: titular grande del correo. button: texto del botón; el enlace es la primera línea del texto
// que sea una dirección web (esa línea se sustituye por el botón en la versión con diseño).
// attachments: archivos adjuntos, con el contenido en base64 (lo usa la copia de seguridad)
type Mail = {
  to: string;
  subject: string;
  text: string;
  title?: string;
  button?: string;
  attachments?: { filename: string; content: string }[];
};

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Versión con diseño del correo, con los colores y la tipografía de la web.
// Va con estilos en línea y tablas porque es lo único que respetan todos los programas de correo.
function renderHtml({ subject, text, title, button }: Mail): string {
  const blocks = text.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  let buttonDone = false;
  const body = blocks
    .map((block) => {
      const isUrl = /^https?:\/\/\S+$/.test(block);
      if (isUrl && !buttonDone) {
        buttonDone = true;
        return `<p style="margin:28px 0;text-align:center"><a href="${escapeHtml(block)}" style="display:inline-block;background:#b0603f;color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 30px;border-radius:999px">${escapeHtml(button ?? "Abrir")}</a></p>`;
      }
      // Dentro de un párrafo, los saltos de línea se respetan y las direcciones se convierten en enlaces
      const html = escapeHtml(block)
        .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#b0603f">$1</a>')
        .replace(/\n/g, "<br>");
      return `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#2a2522">${html}</p>`;
    })
    .join("");
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#fbf8f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbf8f3"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td align="center" style="padding-bottom:24px;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:34px;color:#2a2522">${BRAND}</td></tr>
<tr><td style="background:#ffffff;border:1px solid #e9e1d6;border-radius:24px;padding:36px 32px">
${title ? `<h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:30px;line-height:1.15;color:#2a2522">${escapeHtml(title)}</h1>` : ""}
${body}
</td></tr>
<tr><td align="center" style="padding:24px 16px 0;font-size:13px;line-height:1.6;color:#766c64">
${BRAND} · Invitaciones de boda digitales<br>
¿Dudas? Responded a este correo y os contesta una persona.
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

// Envía un correo con Resend si hay clave configurada. Sin clave (desarrollo), lo deja escrito en
// data/correos.log para poder ver qué se habría enviado. Nunca lanza error: un correo que falla
// no debe romper el registro ni una confirmación de asistencia.
export async function sendEmail(mail: Mail): Promise<void> {
  const { to, subject, text } = mail;
  const body = `${text}\n\n— ${BRAND}`;
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  try {
    if (key && from) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        // Se envían las dos versiones: con diseño (html) y solo texto, para los programas que no muestran html.
        // El remitente no necesita buzón propio: las respuestas llegan al correo de contacto (o a EMAIL_REPLY_TO).
        body: JSON.stringify({ from, to, subject, text: body, html: renderHtml(mail), reply_to: process.env.EMAIL_REPLY_TO || LEGAL.email, attachments: mail.attachments }),
      });
      if (!res.ok) console.error("No se pudo enviar el correo:", res.status, await res.text());
      return;
    }
    fs.mkdirSync(/*turbopackIgnore: true*/ DATA_DIR, { recursive: true });
    fs.appendFileSync(
      path.join(/*turbopackIgnore: true*/ DATA_DIR, "correos.log"),
      `--- ${new Date().toISOString()}\nPara: ${to}\nAsunto: ${subject}\n\n${body}\n\n`,
    );
    // En desarrollo, la última versión con diseño queda en data/ultimo-correo.html para poder verla en el navegador
    fs.writeFileSync(path.join(/*turbopackIgnore: true*/ DATA_DIR, "ultimo-correo.html"), renderHtml(mail));
  } catch (e) {
    console.error("No se pudo enviar el correo:", e);
  }
}

export function siteOrigin(req: Request): string {
  return process.env.SITE_URL ?? new URL(req.url).origin;
}
