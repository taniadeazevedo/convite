import { markPaid } from "@/lib/db";
import { paidTokenFromWebhook } from "@/lib/payments";

// Activa la invitación aunque la pareja cierre la pestaña antes de volver del pago
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Falta la firma", { status: 400 });
  try {
    const token = paidTokenFromWebhook(await req.text(), signature);
    if (token) markPaid(token);
  } catch {
    return new Response("Firma no válida", { status: 400 });
  }
  return Response.json({ received: true });
}
