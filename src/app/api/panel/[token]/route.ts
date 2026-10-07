import { saveInvitation } from "@/lib/db";
import { isTemplateId, sanitizeData } from "@/lib/templates";
import { ownedInvitation } from "@/lib/auth";
import { removeInvitation } from "@/lib/cleanup";

export async function PUT(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const inv = await ownedInvitation(token);
  if (!inv) return Response.json({ error: "No encontrada" }, { status: 404 });
  const body = await req.json().catch(() => null);
  const template = isTemplateId(body?.template) ? body.template : inv.template;
  const data = sanitizeData(body?.data, inv.data);
  saveInvitation(token, template, data);
  return Response.json({ template, data });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const inv = await ownedInvitation(token);
  if (!inv) return Response.json({ error: "No encontrada" }, { status: 404 });
  removeInvitation(inv.slug);
  return Response.json({ ok: true });
}
