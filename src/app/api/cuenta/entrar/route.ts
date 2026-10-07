import { startSession, tooManyAttempts, verifyPassword } from "@/lib/auth";
import { getUserWithPassword } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
  const password = typeof body?.password === "string" ? body.password.slice(0, 200) : "";
  if (tooManyAttempts(`entrar:${email}`)) {
    return Response.json({ error: "Demasiados intentos. Prueba en unos minutos." }, { status: 429 });
  }
  const user = getUserWithPassword(email);
  // Mismo mensaje si falla el correo o la contraseña, para no revelar qué cuentas existen
  if (!user || !verifyPassword(password, user.password)) {
    return Response.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
  }
  await startSession(user.id);
  return Response.json({ ok: true });
}
