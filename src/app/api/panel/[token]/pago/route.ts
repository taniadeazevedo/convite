import { markPaid } from "@/lib/db";
import { createCheckout, demoPayments, stripeEnabled } from "@/lib/payments";
import { currentUser, ownedInvitation } from "@/lib/auth";
import { track } from "@/lib/stats";
import { isPlanId } from "@/lib/templates";

export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const inv = await ownedInvitation(token);
  if (!inv) return Response.json({ error: "No encontrada" }, { status: 404 });
  // Para publicar hace falta cuenta: es donde queda guardada la invitación y a donde llegan los avisos
  if (!(await currentUser())) return Response.json({ error: "Crea una cuenta para publicar" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const plan = isPlanId(body?.plan) ? body.plan : "basico";
  // Ya publicada: lo único que se puede comprar es la mejora de Esencial a Premium
  const upgrade = inv.paid;
  if (upgrade && !(inv.plan === "basico" && plan === "premium")) return Response.json({ url: `/panel/${token}` });
  if (!inv.data.name1 || !inv.data.name2 || !inv.data.date) {
    return Response.json({ error: "Rellena al menos los nombres y la fecha antes de publicar" }, { status: 400 });
  }

  if (!upgrade) track("pago");
  if (stripeEnabled) {
    const origin = process.env.SITE_URL ?? new URL(req.url).origin;
    return Response.json({ url: await createCheckout(token, origin, plan, upgrade) });
  }
  if (demoPayments) {
    markPaid(token, plan);
    return Response.json({ url: `/panel/${token}?pago=demo` });
  }
  return Response.json({ error: "El pago todavía no está configurado" }, { status: 503 });
}
