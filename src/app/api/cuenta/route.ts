import { currentUser, endSession, verifyPassword } from "@/lib/auth";
import { removeAccount } from "@/lib/cleanup";
import { getUserWithPassword } from "@/lib/db";

// Elimina la cuenta con todas sus invitaciones, confirmaciones y fotos. Pide la contraseña otra vez.
export async function DELETE(req: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "No has iniciado sesión" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const stored = getUserWithPassword(user.email);
  if (!stored || typeof body?.password !== "string" || !verifyPassword(body.password, stored.password)) {
    return Response.json({ error: "Contraseña incorrecta" }, { status: 403 });
  }
  await endSession();
  removeAccount(user.id);
  return Response.json({ ok: true });
}
