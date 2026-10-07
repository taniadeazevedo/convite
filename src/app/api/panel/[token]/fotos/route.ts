import { randomBytes } from "node:crypto";
import { saveInvitation } from "@/lib/db";
import { removeUpload, writeUpload } from "@/lib/storage";
import { IMAGE_NAME, MAX_IMAGE_BYTES, processImage } from "@/lib/images";
import { MAX_PHOTOS } from "@/lib/templates";
import { ownedInvitation } from "@/lib/auth";

function fileFromUrl(slug: string, url: unknown): string | null {
  const prefix = `/api/fotos/${slug}/`;
  if (typeof url !== "string" || !url.startsWith(prefix)) return null;
  const name = url.slice(prefix.length);
  return IMAGE_NAME.test(name) ? name : null;
}

export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const inv = await ownedInvitation(token);
  if (!inv) return Response.json({ error: "No encontrada" }, { status: 404 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const kind = form?.get("kind") === "cover" ? "cover" : "gallery";
  if (!(file instanceof File)) return Response.json({ error: "Falta la foto" }, { status: 400 });
  if (file.size > MAX_IMAGE_BYTES) return Response.json({ error: "La foto pesa más de 12 MB" }, { status: 400 });
  if (kind === "gallery" && inv.data.photos.length >= MAX_PHOTOS) {
    return Response.json({ error: `Máximo ${MAX_PHOTOS} fotos en la galería` }, { status: 400 });
  }

  const buf = await processImage(Buffer.from(await file.arrayBuffer()));
  if (!buf) return Response.json({ error: "Formato no admitido. Usa JPG, PNG o WebP." }, { status: 400 });

  const name = `${randomBytes(8).toString("hex")}.jpg`;
  await writeUpload([inv.slug, name], buf);
  const url = `/api/fotos/${inv.slug}/${name}`;

  const data = { ...inv.data };
  if (kind === "cover") {
    const old = fileFromUrl(inv.slug, data.cover);
    if (old) await removeUpload([inv.slug, old]);
    data.cover = url;
  } else {
    data.photos = [...data.photos, url];
  }
  saveInvitation(token, inv.template, data);
  return Response.json({ cover: data.cover, photos: data.photos });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const inv = await ownedInvitation(token);
  if (!inv) return Response.json({ error: "No encontrada" }, { status: 404 });
  const body = await req.json().catch(() => null);
  const name = fileFromUrl(inv.slug, body?.url);
  if (!name) return Response.json({ error: "Foto no válida" }, { status: 400 });

  await removeUpload([inv.slug, name]);
  const data = {
    ...inv.data,
    cover: inv.data.cover === body.url ? "" : inv.data.cover,
    photos: inv.data.photos.filter((p) => p !== body.url),
  };
  saveInvitation(token, inv.template, data);
  return Response.json({ cover: data.cover, photos: data.photos });
}
