import { randomBytes } from "node:crypto";
import { addGuestPhoto, getBySlug, listGuestPhotos } from "@/lib/db";
import { writeUpload } from "@/lib/storage";
import { MAX_IMAGE_BYTES, processImage } from "@/lib/images";
import { GUEST_PHOTO_LIMIT } from "@/lib/templates";

// Los invitados suben fotos; solo la pareja puede verlas, desde su panel
export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const inv = getBySlug(slug);
  if (!inv || !inv.paid || inv.data.off.includes("album")) {
    return Response.json({ error: "Álbum no disponible" }, { status: 404 });
  }
  if (listGuestPhotos(slug).length >= GUEST_PHOTO_LIMIT) {
    return Response.json({ error: "El álbum ya está completo" }, { status: 429 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Falta la foto" }, { status: 400 });
  if (file.size > MAX_IMAGE_BYTES) return Response.json({ error: "La foto pesa más de 12 MB" }, { status: 400 });
  const buf = await processImage(Buffer.from(await file.arrayBuffer()));
  if (!buf) return Response.json({ error: "Formato no admitido. Usa JPG, PNG o WebP." }, { status: 400 });

  const name = `${randomBytes(8).toString("hex")}.jpg`;
  await writeUpload([slug, "invitados", name], buf);
  addGuestPhoto(slug, name);
  return Response.json({ ok: true, left: GUEST_PHOTO_LIMIT - listGuestPhotos(slug).length });
}
