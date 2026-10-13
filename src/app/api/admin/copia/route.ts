import { spawn } from "node:child_process";
import { Readable } from "node:stream";
import { currentUser } from "@/lib/auth";
import { dailyBackup } from "@/lib/backup";
import { DATA_DIR } from "@/lib/db";
import { isAdmin } from "@/lib/stats";

// Copia completa para descargar: la base de datos del día y todas las fotos, en un archivo .tar.gz.
// Solo para la administradora.
export async function GET() {
  const user = await currentUser();
  if (!user || !isAdmin(user)) return new Response("No encontrado", { status: 404 });
  dailyBackup(); // asegura que existe la copia de hoy de la base de datos
  // Se empaquetan las copias de la base de datos y las fotos; la base de datos «en vivo» se deja fuera
  // porque copiarla mientras se usa puede dar un archivo a medias.
  const tar = spawn("tar", ["-czf", "-", "-C", DATA_DIR, "copias", "uploads"]);
  const day = new Date().toISOString().slice(0, 10);
  return new Response(Readable.toWeb(tar.stdout) as ReadableStream, {
    headers: {
      "Content-Type": "application/gzip",
      "Content-Disposition": `attachment; filename="invitalia-copia-${day}.tar.gz"`,
      "Cache-Control": "no-store",
    },
  });
}
