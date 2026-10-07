import { hashPassword, startSession, tooManyAttempts } from "@/lib/auth";
import { createUser } from "@/lib/db";

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
  return Response.json({ ok: true });
}
