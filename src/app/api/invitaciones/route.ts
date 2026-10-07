import { currentUser } from "@/lib/auth";
import { createInvitation } from "@/lib/db";
import { isTemplateId } from "@/lib/templates";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Entra en tu cuenta para crear una invitación" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!isTemplateId(body?.template)) {
    return Response.json({ error: "Plantilla no válida" }, { status: 400 });
  }
  const inv = createInvitation(body.template, user.id);
  return Response.json({ token: inv.token });
}
