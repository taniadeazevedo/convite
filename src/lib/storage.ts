import fs from "node:fs/promises";
import path from "node:path";
import { UPLOADS_DIR } from "./db";

// Todo el acceso a las fotos en disco pasa por aquí. Las rutas dependen de DATA_DIR, que solo se
// conoce al arrancar; los comentarios turbopackIgnore evitan que el compilador intente seguirlas.
const file = (...parts: string[]) => path.join(/*turbopackIgnore: true*/ UPLOADS_DIR, ...parts);

export async function writeUpload(parts: string[], data: Buffer) {
  const target = file(...parts);
  await fs.mkdir(/*turbopackIgnore: true*/ path.dirname(target), { recursive: true });
  await fs.writeFile(/*turbopackIgnore: true*/ target, data);
}

export function readUpload(parts: string[]): Promise<Buffer | null> {
  return fs.readFile(/*turbopackIgnore: true*/ file(...parts)).catch(() => null);
}

// Borra una foto, o una carpeta entera si se pasa solo el identificador de la invitación
export async function removeUpload(parts: string[]) {
  await fs.rm(/*turbopackIgnore: true*/ file(...parts), { recursive: true, force: true });
}
