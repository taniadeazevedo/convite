import {
  deleteInvitationRows,
  deleteUserRows,
  getUserById,
  listAnonymousDraftsBefore,
  listByUser,
  listDraftsToRemind,
  listPaidBefore,
  markExpiryNotified,
  markReminded,
} from "./db";
import { removeUpload } from "./storage";
import { sendEmail } from "./email";
import { BRAND, PRICE_LABEL } from "./templates";

const DAY = 86400_000;
const MONTH = 30 * DAY;

// Borra una invitación entera: datos, confirmaciones y todas sus fotos
export function removeInvitation(slug: string) {
  if (/^[a-f0-9]{10}$/.test(slug)) void removeUpload([slug]).catch(() => {});
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
    // Borradores de prueba que nadie guardó en una cuenta: fuera a los 7 días (lo mismo que dura su cookie)
    for (const inv of listAnonymousDraftsBefore(new Date(now - 7 * DAY).toISOString())) removeInvitation(inv.slug);
    // Un único recordatorio a quien empezó una invitación hace 2-10 días y no la ha publicado
    const origin = process.env.SITE_URL;
    if (origin) {
      for (const inv of listDraftsToRemind(new Date(now - 10 * DAY).toISOString(), new Date(now - 2 * DAY).toISOString())) {
        markReminded(inv.slug);
        const owner = inv.userId ? getUserById(inv.userId) : null;
        if (!owner) continue;
        const names = inv.data.name1 && inv.data.name2 ? ` de ${inv.data.name1} y ${inv.data.name2}` : "";
        void sendEmail({
          to: owner.email,
          subject: "Vuestra invitación os está esperando",
          text: `Hola:\n\nEmpezasteis la invitación${names} en ${BRAND} y se quedó en borrador. Sigue guardada tal como la dejasteis:\n\n${origin}/panel/${inv.token}\n\nPodéis seguir editándola gratis; solo se paga al publicarla (${PRICE_LABEL}, una vez). Si tenéis alguna duda, responded a este correo.\n\nEs el único recordatorio que os enviaremos.`,
        });
      }
    }
  } catch (e) {
    console.error("Limpieza diaria:", e);
  }
}
