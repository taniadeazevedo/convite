import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Editor from "@/components/Editor";
import { getByToken, listGuestPhotos, listRsvps, markPaid } from "@/lib/db";
import { demoPayments, isSessionPaid, stripeEnabled } from "@/lib/payments";

export const metadata: Metadata = { title: "Tu invitación · Panel", robots: { index: false } };

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

export default async function Panel({ params, searchParams }: Props) {
  const { token } = await params;
  const { session_id } = await searchParams;
  let inv = getByToken(token);
  if (!inv) notFound();

  // Vuelta de Stripe: se comprueba el pago contra Stripe, no se confía en la URL
  if (!inv.paid && session_id && stripeEnabled) {
    const paid = await isSessionPaid(session_id, token).catch(() => false);
    if (paid) {
      markPaid(token);
      inv = { ...inv, paid: true };
    }
  }

  const h = await headers();
  const origin =
    process.env.SITE_URL ?? `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host") ?? "localhost:3000"}`;

  return <Editor initial={inv} rsvps={listRsvps(inv.slug)} guestPhotos={listGuestPhotos(inv.slug)} demoPayments={demoPayments} origin={origin} />;
}
