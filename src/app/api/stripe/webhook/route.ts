import { siteOrigin } from "@/lib/email";
import { applyPayment } from "@/lib/publish";
import { paidFromWebhook } from "@/lib/payments";

// Activa la invitación aunque la pareja cierre la pestaña antes de volver del pago
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Falta la firma", { status: 400 });
  // Sin el secreto no se puede comprobar que el aviso viene de Stripe. Se responde con error (y no con «recibido»)
  // para que Stripe lo marque como fallido y lo reintente, en vez de darlo por entregado sin hacer nada.
  if (!process.env.STRIPE_WEBHOOK_SECRET) return new Response("Falta STRIPE_WEBHOOK_SECRET", { status: 503 });
  try {
    const paid = paidFromWebhook(await req.text(), signature);
    if (paid) applyPayment(paid.token, paid.plan, siteOrigin(req));
  } catch {
    return new Response("Firma no válida", { status: 400 });
  }
  return Response.json({ received: true });
}
