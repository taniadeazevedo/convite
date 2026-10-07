import { addRsvp, countRsvps, getBySlug } from "@/lib/db";

const MAX_RSVPS = 500;

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const inv = getBySlug(slug);
  if (!inv || !inv.paid || inv.data.off.includes("rsvp")) return Response.json({ error: "Invitación no disponible" }, { status: 404 });

  const body = await req.json().catch(() => null);
  // Campo trampa relleno = bot: se responde OK sin guardar nada
  if (body?.web) return Response.json({ ok: true });

  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : "";
  if (!name) return Response.json({ error: "Escribe tu nombre" }, { status: 400 });
  if (countRsvps(slug) >= MAX_RSVPS) {
    return Response.json({ error: "Esta invitación ya no admite más respuestas" }, { status: 429 });
  }

  const attending = body.attending !== false;
  const guests = attending ? Math.min(Math.max(Math.trunc(Number(body.guests)) || 1, 1), 10) : 0;
  addRsvp(slug, {
    name,
    attending,
    guests,
    allergies: typeof body.allergies === "string" ? body.allergies.trim().slice(0, 200) : "",
    message: typeof body.message === "string" ? body.message.trim().slice(0, 400) : "",
  });
  return Response.json({ ok: true });
}
