import { currentUser, tooManyAttempts } from "@/lib/auth";
import { siteOrigin } from "@/lib/email";
import { sendVerification } from "@/lib/verify";

// Vuelve a enviar el correo para confirmar la dirección
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Entra en tu cuenta" }, { status: 401 });
  if (user.verified) return Response.json({ ok: true, verified: true });
  if (tooManyAttempts(`verificar:${user.id}`)) {
    return Response.json({ error: "Ya os lo hemos enviado varias veces. Revisad el spam o probad en unos minutos." }, { status: 429 });
  }
  await sendVerification(user, siteOrigin(req));
  return Response.json({ ok: true });
}
