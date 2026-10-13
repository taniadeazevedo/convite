import { createHash, randomBytes } from "node:crypto";
import { createVerification, type User } from "./db";
import { sendEmail } from "./email";
import { BRAND } from "./templates";

export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

// Envía el correo de bienvenida con el enlace para confirmar que la dirección es de quien se registra.
// El enlace vale 7 días; en la base de datos solo se guarda su huella, no el enlace.
export async function sendVerification(user: User, origin: string) {
  const token = randomBytes(24).toString("hex");
  createVerification(hashToken(token), user.id, new Date(Date.now() + 7 * 86400_000).toISOString());
  await sendEmail({
    to: user.email,
    subject: `Confirmad vuestro correo en ${BRAND} 🤍`,
    title: "¡Enhorabuena por la boda!",
    button: "Confirmar nuestro correo",
    text: `Vuestra cuenta de ${BRAND} ya está creada. Solo falta un clic para confirmar que este correo es vuestro: así os llegarán el enlace de la invitación y los avisos cuando alguien confirme.\n\n${origin}/verificar/${token}\n\nTres cosas que conviene saber:\n· Crear y editar es gratis, todo el tiempo que necesitéis.\n· Solo se paga al publicarla, una única vez.\n· Después podéis cambiar lo que queráis; los invitados siempre ven la última versión.\n\nSi no os habéis registrado vosotros, ignorad este correo.`,
  });
}
