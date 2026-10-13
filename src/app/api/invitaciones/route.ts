import { cookies } from "next/headers";
import { currentUser, tooManyAttempts } from "@/lib/auth";
import { createInvitation } from "@/lib/db";
import { track } from "@/lib/stats";
import { isTemplateId } from "@/lib/templates";

export async function POST(req: Request) {
  const user = await currentUser();
  const body = await req.json().catch(() => null);
  if (!isTemplateId(body?.template)) {
    return Response.json({ error: "Plantilla no válida" }, { status: 400 });
  }
  // Sin cuenta se puede probar, pero con un límite por conexión para que nadie llene el disco
  if (!user) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "desconocida";
    if (tooManyAttempts(`crear:${ip}`)) {
      return Response.json({ error: "Demasiados borradores seguidos. Crea una cuenta para continuar." }, { status: 429 });
    }
  }
  const inv = createInvitation(body.template, user?.id ?? null);
  track("borrador");
  // Sin cuenta, el navegador recuerda el borrador 7 días para poder volver a él
  if (!user) {
    (await cookies()).set("borrador", inv.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 86400,
    });
  }
  return Response.json({ token: inv.token });
}
