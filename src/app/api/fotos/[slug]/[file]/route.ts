import { readUpload } from "@/lib/storage";
import { IMAGE_NAME, IMAGE_TYPES } from "@/lib/images";


export async function GET(_req: Request, ctx: { params: Promise<{ slug: string; file: string }> }) {
  const { slug, file } = await ctx.params;
  if (!/^[a-f0-9]{10}$/.test(slug) || !IMAGE_NAME.test(file)) {
    return new Response("No encontrada", { status: 404 });
  }
  const buf = await readUpload([slug, file]);
  if (!buf) return new Response("No encontrada", { status: 404 });
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": IMAGE_TYPES[file.split(".")[1]],
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
