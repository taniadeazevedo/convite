import { getByToken, getUserById, markPaid } from "./db";
import { sendEmail } from "./email";
import { BRAND, PLANS, type PlanId } from "./templates";

// Aplica un pago y avisa a la pareja por correo. Lo llaman el aviso de Stripe, la vuelta del pago y el
// modo de prueba; como markPaid solo devuelve algo la primera vez, el correo nunca sale repetido.
export function applyPayment(token: string, plan: PlanId, origin: string) {
  const change = markPaid(token, plan);
  if (!change) return;
  const inv = getByToken(token); // se relee: ya trae la dirección con los nombres
  const owner = inv?.userId ? getUserById(inv.userId) : null;
  if (!inv || !owner) return;
  const link = `${origin}/${inv.alias ?? `i/${inv.slug}`}`;
  const panel = `${origin}/panel/${inv.token}`;
  if (change === "published") {
    void sendEmail({
      to: owner.email,
      subject: "Vuestra invitación ya está publicada 🎉",
      title: "¡Ya podéis enviarla!",
      button: "Ver nuestra invitación",
      text: `La invitación de ${inv.data.name1} y ${inv.data.name2} está publicada. Este es el enlace para vuestros invitados; guardad este correo para tenerlo siempre a mano:\n\n${link}\n\nPara compartirla, copiad esta dirección y pegadla en WhatsApp; se verá con vuestra foto y vuestros nombres:\n${link}\n\nDesde vuestro panel podéis ver quién confirma, descargar la lista para el catering, imprimir el cartel con QR para las fotos y cambiar lo que queráis:\n${panel}\n\nPlan ${PLANS[inv.plan].name} · publicada durante ${PLANS[inv.plan].months} meses.`,
    });
  } else {
    void sendEmail({
      to: owner.email,
      subject: `Vuestra invitación ya es ${PLANS.premium.name}`,
      title: `Ya tenéis el plan ${PLANS.premium.name}`,
      button: "Elegir nuestra dirección",
      text: `Desde ahora podéis elegir la dirección de vuestra invitación, ya no aparece «Hecha con ${BRAND}», y tenéis hasta ${PLANS.premium.photos} fotos en la galería, ${PLANS.premium.guestPhotos} fotos de invitados y ${PLANS.premium.months} meses publicada.\n\n${panel}\n\nSi vais a cambiar la dirección, hacedlo antes de enviar la invitación: el enlace anterior deja de funcionar.`,
    });
  }
}
