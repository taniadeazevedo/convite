import Stripe from "stripe";
import { BRAND, PLANS, UPGRADE_CENTS, isPlanId, type PlanId } from "./templates";

export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);
// Sin clave de Stripe, en desarrollo se puede simular el pago para probar el flujo completo
export const demoPayments = !stripeEnabled && process.env.NODE_ENV !== "production";

function stripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

// upgrade: la invitación ya está publicada en Esencial y solo se cobra la diferencia hasta Premium
export async function createCheckout(token: string, origin: string, plan: PlanId, upgrade = false): Promise<string> {
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    // Solo tarjeta: Apple Pay y Google Pay van incluidos en "card"
    allowed_payment_method_types: ["card"],
    client_reference_id: token,
    // El plan viaja con el pago para saber qué activar cuando Stripe confirma el cobro
    metadata: { plan },
    // Casilla «Añadir código promocional»: los códigos se crean en Stripe (Productos → Cupones)
    allow_promotion_codes: true,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: upgrade ? UPGRADE_CENTS : PLANS[plan].cents,
          product_data: {
            name: upgrade ? `Mejora a ${PLANS.premium.name} · ${BRAND}` : `Invitación de boda digital ${PLANS[plan].name} · ${BRAND}`,
          },
        },
      },
    ],
    success_url: `${origin}/panel/${token}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/panel/${token}`,
  });
  return session.url!;
}

// Cobrado, o completado sin importe (código promocional del 100 %): en los dos casos se activa
const isSettled = (status: string) => status === "paid" || status === "no_payment_required";

const planOf = (metadata: Record<string, string> | null | undefined): PlanId => (isPlanId(metadata?.plan) ? metadata.plan : "basico");

// Devuelve el plan pagado, o null si esa sesión no es un pago completado de esta invitación
export async function paidPlanOfSession(sessionId: string, token: string): Promise<PlanId | null> {
  const session = await stripe().checkout.sessions.retrieve(sessionId);
  if (session.client_reference_id !== token || session.status !== "complete" || !isSettled(session.payment_status)) return null;
  return planOf(session.metadata);
}

// Aviso que Stripe envía a /api/stripe/webhook cuando un pago se completa.
// Devuelve la invitación pagada y su plan, o null si el aviso no es válido o no es un pago.
export function paidFromWebhook(body: string, signature: string): { token: string; plan: PlanId } | null {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeEnabled || !secret) return null;
  const event = stripe().webhooks.constructEvent(body, signature, secret);
  if (event.type !== "checkout.session.completed") return null;
  const session = event.data.object;
  if (!isSettled(session.payment_status) || !session.client_reference_id) return null;
  return { token: session.client_reference_id, plan: planOf(session.metadata) };
}
