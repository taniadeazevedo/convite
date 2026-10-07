import { removeGuestPhoto } from "@/lib/db";
import { readUpload, removeUpload } from "@/lib/storage";
import { IMAGE_NAME, IMAGE_TYPES } from "@/lib/images";
import { ownedInvitation } from "@/lib/auth";

type Ctx = { params: Promise<{ token: string; file: string }> };

async function resolve(ctx: Ctx) {
  const { token, file } = await ctx.params;
  const inv = await ownedInvitation(token);
  if (!inv || !IMAGE_NAME.test(file)) return null;
  return { slug: inv.slug, file, parts: [inv.slug, "invitados", file] };
}

export async function GET(_req: Request, ctx: Ctx) {
  const r = await resolve(ctx);
  const buf = r && (await readUpload(r.parts));
  if (!r || !buf) return new Response("No encontrada", { status: 404 });
  return new Response(new Uint8Array(buf), {
    headers: { "Content-Type": IMAGE_TYPES[r.file.split(".")[1]], "Cache-Control": "private, max-age=3600" },
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const r = await resolve(ctx);
  if (!r) return Response.json({ error: "No encontrada" }, { status: 404 });
  await removeUpload(r.parts);
  removeGuestPhoto(r.slug, r.file);
  return Response.json({ ok: true });
}
