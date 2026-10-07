import Stripe from "stripe";
import { BRAND, PRICE_CENTS } from "./templates";

export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);
// Sin clave de Stripe, en desarrollo se puede simular el pago para probar el flujo completo
export const demoPayments = !stripeEnabled && process.env.NODE_ENV !== "production";

function stripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function createCheckout(token: string, origin: string): Promise<string> {
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    // Solo tarjeta: Apple Pay y Google Pay van incluidos en "card"
    allowed_payment_method_types: ["card"],
    client_reference_id: token,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: PRICE_CENTS,
          product_data: { name: `Invitación de boda digital · ${BRAND}` },
        },
      },
    ],
    success_url: `${origin}/panel/${token}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/panel/${token}`,
  });
  return session.url!;
}

export async function isSessionPaid(sessionId: string, token: string): Promise<boolean> {
  const session = await stripe().checkout.sessions.retrieve(sessionId);
  return session.client_reference_id === token && session.payment_status === "paid";
}

// Aviso que Stripe envía a /api/stripe/webhook cuando un pago se completa.
// Devuelve el identificador de la invitación pagada, o null si el aviso no es válido o no es un pago.
export function paidTokenFromWebhook(body: string, signature: string): string | null {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeEnabled || !secret) return null;
  const event = stripe().webhooks.constructEvent(body, signature, secret);
  if (event.type !== "checkout.session.completed") return null;
  const session = event.data.object;
  return session.payment_status === "paid" ? session.client_reference_id : null;
}
