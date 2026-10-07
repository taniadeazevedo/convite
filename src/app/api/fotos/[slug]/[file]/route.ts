import fs from "node:fs/promises";
import path from "node:path";
import { UPLOADS_DIR } from "@/lib/db";
import { IMAGE_NAME, IMAGE_TYPES } from "@/lib/images";


export async function GET(_req: Request, ctx: { params: Promise<{ slug: string; file: string }> }) {
  const { slug, file } = await ctx.params;
  if (!/^[a-f0-9]{10}$/.test(slug) || !IMAGE_NAME.test(file)) {
    return new Response("No encontrada", { status: 404 });
  }
  const buf = await fs.readFile(path.join(UPLOADS_DIR, slug, file)).catch(() => null);
  if (!buf) return new Response("No encontrada", { status: 404 });
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": IMAGE_TYPES[file.split(".")[1]],
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
