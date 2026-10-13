import fs from "node:fs";
import path from "node:path";
import { DATA_DIR, snapshotDatabase } from "./db";
import { sendEmail } from "./email";
import { BRAND } from "./templates";

const BACKUP_DIR = path.join(/*turbopackIgnore: true*/ DATA_DIR, "copias");
const KEEP = 7; // días de copias que se conservan

const files = () =>
  fs.existsSync(/*turbopackIgnore: true*/ BACKUP_DIR)
    ? fs.readdirSync(/*turbopackIgnore: true*/ BACKUP_DIR).filter((f) => /^app-\d{4}-\d{2}-\d{2}\.db$/.test(f)).sort()
    : [];

// Día (AAAA-MM-DD) de la última copia, o null si no hay ninguna
export function lastBackupDay(): string | null {
  const last = files().at(-1);
  return last ? last.slice(4, 14) : null;
}

// Copia diaria de la base de datos (cuentas, invitaciones, confirmaciones). Protege de un borrado o un
// cambio que estropee los datos. Está en el mismo disco, así que no protege de perder el disco entero:
// para eso, si existe BACKUP_EMAIL la copia se envía también por correo a esa dirección, y desde
// las estadísticas se puede descargar la copia completa con las fotos.
export function dailyBackup() {
  const day = new Date().toISOString().slice(0, 10);
  const file = path.join(/*turbopackIgnore: true*/ BACKUP_DIR, `app-${day}.db`);
  if (fs.existsSync(/*turbopackIgnore: true*/ file)) return;
  fs.mkdirSync(/*turbopackIgnore: true*/ BACKUP_DIR, { recursive: true });
  snapshotDatabase(file);
  for (const old of files().slice(0, -KEEP)) fs.rmSync(path.join(/*turbopackIgnore: true*/ BACKUP_DIR, old));

  const to = process.env.BACKUP_EMAIL;
  if (!to) return;
  const size = fs.statSync(/*turbopackIgnore: true*/ file).size;
  // Los proveedores de correo rechazan adjuntos muy grandes; por encima de 20 MB se avisa en vez de enviar
  const fits = size < 20 * 1024 * 1024;
  void sendEmail({
    to,
    subject: `Copia de seguridad de ${BRAND} · ${day.split("-").reverse().join("/")}`,
    title: "Copia de seguridad diaria",
    text: fits
      ? `Adjunta va la copia de hoy de la base de datos (${Math.round(size / 1024)} KB): cuentas, invitaciones y confirmaciones. Las fotos no caben en un correo; descargad la copia completa desde las estadísticas de vez en cuando.\n\nGuardad este correo: contiene datos personales de parejas e invitados, así que no lo reenviéis.`
      : `La copia de hoy ocupa demasiado para enviarla por correo (${Math.round(size / 1024 / 1024)} MB). Descargad la copia completa desde las estadísticas.`,
    attachments: fits ? [{ filename: `invitalia-${day}.db`, content: fs.readFileSync(/*turbopackIgnore: true*/ file).toString("base64") }] : undefined,
  });
}
