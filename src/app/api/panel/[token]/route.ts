import { getByToken, saveInvitation } from "@/lib/db";
import { isTemplateId, sanitizeData } from "@/lib/templates";

export async function PUT(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const inv = getByToken(token);
  if (!inv) return Response.json({ error: "No encontrada" }, { status: 404 });
  const body = await req.json().catch(() => null);
  const template = isTemplateId(body?.template) ? body.template : inv.template;
  const data = sanitizeData(body?.data, inv.data);
  saveInvitation(token, template, data);
  return Response.json({ template, data });
}
