import { createHash, randomBytes } from "node:crypto";
import { tooManyAttempts } from "@/lib/auth";
import { createReset, getUserWithPassword } from "@/lib/db";
import { sendEmail, siteOrigin } from "@/lib/email";
import { BRAND } from "@/lib/templates";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
  if (tooManyAttempts(`recuperar:${email}`)) {
    return Response.json({ error: "Demasiados intentos. Prueba en unos minutos." }, { status: 429 });
  }
  const user = getUserWithPassword(email);
  if (user) {
    const token = randomBytes(32).toString("hex");
    createReset(createHash("sha256").update(token).digest("hex"), user.id, new Date(Date.now() + 3600_000).toISOString());
    await sendEmail({
      to: user.email,
      subject: `Cambia tu contraseña de ${BRAND}`,
      text: `Hola:\n\nPara elegir una contraseña nueva, abre este enlace (caduca en una hora):\n\n${siteOrigin(req)}/restablecer/${token}\n\nSi no lo has pedido tú, ignora este correo: tu contraseña sigue siendo la misma.`,
    });
  }
  // Misma respuesta exista o no la cuenta, para no revelar qué correos están registrados
  return Response.json({ ok: true });
}
