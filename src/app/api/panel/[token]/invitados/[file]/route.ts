import fs from "node:fs/promises";
import path from "node:path";
import { getByToken, removeGuestPhoto, UPLOADS_DIR } from "@/lib/db";
import { IMAGE_NAME, IMAGE_TYPES } from "@/lib/images";

type Ctx = { params: Promise<{ token: string; file: string }> };

async function resolve(ctx: Ctx) {
  const { token, file } = await ctx.params;
  const inv = getByToken(token);
  if (!inv || !IMAGE_NAME.test(file)) return null;
  return { slug: inv.slug, file, full: path.join(UPLOADS_DIR, inv.slug, "invitados", file) };
}

export async function GET(_req: Request, ctx: Ctx) {
  const r = await resolve(ctx);
  const buf = r && (await fs.readFile(r.full).catch(() => null));
  if (!r || !buf) return new Response("No encontrada", { status: 404 });
  return new Response(new Uint8Array(buf), {
    headers: { "Content-Type": IMAGE_TYPES[r.file.split(".")[1]], "Cache-Control": "private, max-age=3600" },
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const r = await resolve(ctx);
  if (!r) return Response.json({ error: "No encontrada" }, { status: 404 });
  await fs.rm(r.full, { force: true });
  removeGuestPhoto(r.slug, r.file);
  return Response.json({ ok: true });
}
