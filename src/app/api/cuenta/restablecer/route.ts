import { createHash } from "node:crypto";
import { hashPassword, startSession } from "@/lib/auth";
import { getResetUser, setPassword } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (password.length < 8 || password.length > 200) {
    return Response.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
  }
  const userId = getResetUser(createHash("sha256").update(token).digest("hex"));
  if (!userId) return Response.json({ error: "El enlace ha caducado o ya se ha usado. Pide uno nuevo." }, { status: 400 });
  setPassword(userId, hashPassword(password));
  await startSession(userId);
  return Response.json({ ok: true });
}
