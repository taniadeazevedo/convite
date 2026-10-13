import {
  deleteInvitationRows,
  deleteUserRows,
  getUserById,
  listAnonymousDraftsBefore,
  listPaidNotAskedForReview,
  markReviewAsked,
  listByUser,
  listDraftsToRemind,
  listPaidBefore,
  markExpiryNotified,
  markReminded,
  type Invitation,
} from "./db";
import { dailyBackup } from "./backup";
import { removeUpload } from "./storage";
import { sendEmail } from "./email";
import { BRAND, PLANS, PRICE_LABEL, type PlanId } from "./templates";

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

function notifyExpiry(inv: Invitation, months: number) {
  markExpiryNotified(inv.slug);
  const owner = inv.userId ? getUserById(inv.userId) : null;
  if (!owner) return;
  void sendEmail({
    to: owner.email,
    subject: `Vuestra invitación de ${BRAND} se retirará en un mes`,
    title: "Vuestra invitación se retira en un mes",
    text: `La invitación de ${inv.data.name1} y ${inv.data.name2} lleva casi ${months} meses publicada. Dentro de un mes se retirará y se borrarán sus datos, incluidas las confirmaciones y las fotos de los invitados.\n\nSi queréis conservar algo, entrad en vuestro panel y descargad la lista de confirmados y las fotos antes de esa fecha.`,
  });
}

// Los términos prometen 12 meses (24 en Premium): un mes antes se avisa por correo y al cumplirse se borra.
// Se ejecuta como mucho una vez al día, aprovechando las visitas a la web.
let lastRun = 0;
export function dailyCleanup() {
  const now = Date.now();
  if (now - lastRun < 86400_000) return;
  lastRun = now;
  try {
    // Lo primero, la copia de seguridad: si algo de lo siguiente fallara, los datos de ayer están a salvo
    dailyBackup();
  } catch (e) {
    console.error("Copia de seguridad:", e);
  }
  try {
    for (const plan of Object.keys(PLANS) as PlanId[]) {
      const months = PLANS[plan].months;
      for (const inv of listPaidBefore(new Date(now - months * MONTH).toISOString(), false, plan)) removeInvitation(inv.slug);
      for (const inv of listPaidBefore(new Date(now - (months - 1) * MONTH).toISOString(), true, plan)) {
        notifyExpiry(inv, months);
      }
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
          title: "Os quedasteis a medias",
          button: "Seguir con la invitación",
          text: `Empezasteis la invitación${names} en ${BRAND} y se quedó en borrador. Sigue guardada tal como la dejasteis:\n\n${origin}/panel/${inv.token}\n\nPodéis seguir editándola gratis; solo se paga al publicarla (${PRICE_LABEL}, una vez). Si tenéis alguna duda, responded a este correo.\n\nEs el único recordatorio que os enviaremos.`,
        });
      }
    }
    // Una semana después de la boda (y hasta dos meses después), se pide la opinión una sola vez
    const from = new Date(now - 60 * DAY).toISOString().slice(0, 10);
    const to = new Date(now - 7 * DAY).toISOString().slice(0, 10);
    for (const inv of listPaidNotAskedForReview()) {
      const date = inv.data.date;
      if (!date || date < from || date > to) continue;
      markReviewAsked(inv.slug);
      const owner = inv.userId ? getUserById(inv.userId) : null;
      if (!owner) continue;
      void sendEmail({
        to: owner.email,
        subject: "¿Qué tal fue la boda? 🤍",
        title: `¡Enhorabuena, ${inv.data.name1} y ${inv.data.name2}!`,
        text: `Esperamos que fuera un día redondo.\n\n¿Nos contáis en dos líneas qué tal os fue con la invitación de ${BRAND}? Basta con responder a este correo. Nos ayuda muchísimo, y a otras parejas a decidirse.\n\nSi os parece bien que publiquemos vuestra opinión en la web con vuestros nombres, decidnoslo en la respuesta; si no lo decís, no la publicamos.\n\nRecordad que desde vuestro panel podéis descargar las fotos que subieron los invitados y la lista de confirmados.`,
      });
    }
  } catch (e) {
    console.error("Limpieza diaria:", e);
  }
}
