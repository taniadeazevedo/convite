import { ownedInvitation } from "@/lib/auth";
import { isValidAlias, slugify } from "@/lib/alias";
import { setAlias } from "@/lib/db";

// Cambia la dirección pública de la invitación (solo plan Premium)
export async function PUT(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const inv = await ownedInvitation(token);
  if (!inv) return Response.json({ error: "No encontrada" }, { status: 404 });
  if (!inv.paid || inv.plan !== "premium") {
    return Response.json({ error: "Elegir la dirección está incluido en el plan Premium" }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const alias = slugify(typeof body?.alias === "string" ? body.alias : "");
  if (!isValidAlias(alias)) {
    return Response.json({ error: "Usa entre 3 y 40 letras, números o guiones. Algunas palabras están reservadas." }, { status: 400 });
  }
  if (alias !== inv.alias && !setAlias(token, alias)) {
    return Response.json({ error: "Esa dirección ya está en uso. Probad con otra." }, { status: 409 });
  }
  return Response.json({ alias });
}
