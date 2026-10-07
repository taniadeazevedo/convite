import sharp from "sharp";

export const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
// Las fotos nuevas se guardan siempre como JPG; png y webp siguen admitidos para las subidas antiguas
export const IMAGE_TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };
export const IMAGE_NAME = /^[a-f0-9]{16}\.(jpg|png|webp)$/;

// Se mira el contenido real del archivo, no la extensión que diga el navegador
export function detectImageType(b: Buffer): "jpg" | "png" | "webp" | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP") return "webp";
  return null;
}

// Prepara una foto subida para la web: la endereza, la reduce y la guarda como JPG ligero.
// De paso elimina los metadatos (ubicación GPS, modelo de móvil…). Devuelve null si no es una imagen válida.
export async function processImage(buf: Buffer): Promise<Buffer | null> {
  if (!detectImageType(buf)) return null;
  try {
    return await sharp(buf)
      .rotate()
      .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82 })
      .toBuffer();
  } catch {
    return null;
  }
}
