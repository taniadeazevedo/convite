import { createInvitation } from "@/lib/db";
import { isTemplateId } from "@/lib/templates";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!isTemplateId(body?.template)) {
    return Response.json({ error: "Plantilla no válida" }, { status: 400 });
  }
  const inv = createInvitation(body.template);
  return Response.json({ token: inv.token });
}
