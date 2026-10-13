import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Editor from "@/components/Editor";
import { getByToken, listGuestPhotos, listRsvps, markPaid } from "@/lib/db";
import { demoPayments, paidPlanOfSession, stripeEnabled } from "@/lib/payments";
import { currentUser, ownedInvitation } from "@/lib/auth";

export const metadata: Metadata = { title: "Tu invitación · Panel", robots: { index: false } };

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

export default async function Panel({ params, searchParams }: Props) {
  const { token } = await params;
  const user = await currentUser();
  const { session_id } = await searchParams;
  let inv = await ownedInvitation(token);
  // Sin sesión solo se abren borradores sin dueño; para el resto hay que entrar
  if (!inv && !user) redirect(`/entrar?next=/panel/${token}`);
  if (!inv) notFound();

  // Vuelta de Stripe: se comprueba el pago contra Stripe, no se confía en la URL
  if (session_id && stripeEnabled && (!inv.paid || inv.plan === "basico")) {
    const plan = await paidPlanOfSession(session_id, token).catch(() => null);
    if (plan) {
      markPaid(token, plan);
      inv = getByToken(token) ?? inv; // se relee para tener ya el plan y la dirección con los nombres
    }
  }

  const h = await headers();
  const origin =
    process.env.SITE_URL ?? `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host") ?? "localhost:3000"}`;

  return <Editor initial={inv} rsvps={listRsvps(inv.slug)} guestPhotos={listGuestPhotos(inv.slug)} demoPayments={demoPayments} origin={origin} guest={!user} />;
}
