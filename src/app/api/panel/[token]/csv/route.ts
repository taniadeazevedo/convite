import { getByToken, listRsvps } from "@/lib/db";

// Comillas dobles escapadas, y apóstrofo delante de = + - @ para que Excel no lo trate como fórmula
function cell(v: string | number): string {
  let s = String(v);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const inv = getByToken(token);
  if (!inv) return new Response("No encontrada", { status: 404 });

  const rows = listRsvps(inv.slug).map((r) =>
    [r.name, r.attending ? "Sí" : "No", r.guests, r.allergies, r.message, r.createdAt.slice(0, 10)]
      .map(cell)
      .join(";"),
  );
  const csv = ["Nombre;Asiste;Personas;Alergias;Mensaje;Fecha", ...rows].join("\r\n");
  // BOM para que Excel lea bien las tildes
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="confirmaciones.csv"',
    },
  });
}
