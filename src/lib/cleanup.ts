import fs from "node:fs";
import path from "node:path";
import {
  deleteInvitationRows,
  deleteUserRows,
  getUserById,
  listByUser,
  listPaidBefore,
  markExpiryNotified,
  UPLOADS_DIR,
} from "./db";
import { sendEmail } from "./email";
import { BRAND } from "./templates";

const MONTH = 30 * 86400_000;

// Borra una invitación entera: datos, confirmaciones y todas sus fotos
export function removeInvitation(slug: string) {
  if (/^[a-f0-9]{10}$/.test(slug)) fs.rmSync(path.join(UPLOADS_DIR, slug), { recursive: true, force: true });
  deleteInvitationRows(slug);
}

export function removeAccount(userId: number) {
  for (const inv of listByUser(userId)) removeInvitation(inv.slug);
  deleteUserRows(userId);
}

// Los términos prometen 12 meses: a los 11 se avisa por correo y a los 12 se borra.
// Se ejecuta como mucho una vez al día, aprovechando las visitas a la web.
let lastRun = 0;
export function dailyCleanup() {
  const now = Date.now();
  if (now - lastRun < 86400_000) return;
  lastRun = now;
  try {
    for (const inv of listPaidBefore(new Date(now - 12 * MONTH).toISOString(), false)) removeInvitation(inv.slug);
    for (const inv of listPaidBefore(new Date(now - 11 * MONTH).toISOString(), true)) {
      markExpiryNotified(inv.slug);
      const owner = inv.userId ? getUserById(inv.userId) : null;
      if (!owner) continue;
      void sendEmail({
        to: owner.email,
        subject: `Vuestra invitación de ${BRAND} se retirará en un mes`,
        text: `Hola:\n\nLa invitación de ${inv.data.name1} y ${inv.data.name2} lleva casi 12 meses publicada. Dentro de un mes se retirará y se borrarán sus datos, incluidas las confirmaciones y las fotos de los invitados.\n\nSi queréis conservar algo, entrad en vuestro panel y descargad la lista de confirmados y las fotos antes de esa fecha.`,
      });
    }
  } catch (e) {
    console.error("Limpieza diaria:", e);
  }
}
