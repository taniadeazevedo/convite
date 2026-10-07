export const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
export const IMAGE_TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };
export const IMAGE_NAME = /^[a-f0-9]{16}\.(jpg|png|webp)$/;

// Se mira el contenido real del archivo, no la extensión que diga el navegador
export function detectImageType(b: Buffer): "jpg" | "png" | "webp" | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP") return "webp";
  return null;
}
