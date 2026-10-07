import { hashPassword, startSession, tooManyAttempts } from "@/lib/auth";
import { createUser } from "@/lib/db";
import { sendEmail, siteOrigin } from "@/lib/email";
import { BRAND } from "@/lib/templates";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Escribe un correo válido" }, { status: 400 });
  }
  if (password.length < 8 || password.length > 200) {
    return Response.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
  }
  if (body?.terms !== true) {
    return Response.json({ error: "Tienes que aceptar los términos y la política de privacidad" }, { status: 400 });
  }
  if (tooManyAttempts(`registro:${email}`)) {
    return Response.json({ error: "Demasiados intentos. Prueba en unos minutos." }, { status: 429 });
  }
  const user = createUser(email, hashPassword(password));
  if (!user) return Response.json({ error: "Ya existe una cuenta con ese correo. Entra con ella." }, { status: 409 });
  await startSession(user.id);
  void sendEmail({
    to: user.email,
    subject: `Bienvenidos a ${BRAND}`,
    text: `Hola:\n\nVuestra cuenta ya está creada. Desde aquí podéis crear y editar la invitación, y ver quién ha confirmado:\n\n${siteOrigin(req)}/cuenta\n\nCrear y editar es gratis; solo se paga al publicarla.`,
  });
  return Response.json({ ok: true });
}
