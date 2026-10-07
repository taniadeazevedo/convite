import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GuestUpload from "@/components/GuestUpload";
import { getBySlug, listGuestPhotos } from "@/lib/db";
import { GUEST_PHOTO_LIMIT } from "@/lib/templates";

export const metadata: Metadata = { title: "Comparte tus fotos de la boda", robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const inv = getBySlug(slug);
  if (!inv || !inv.paid || inv.data.off.includes("album")) notFound();
  const left = GUEST_PHOTO_LIMIT - listGuestPhotos(slug).length;
  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-[11px] uppercase tracking-[0.4em] text-soft">
        {inv.data.name1} & {inv.data.name2}
      </p>
      <h1 className="mt-4 font-serif text-5xl italic">Comparte tus fotos</h1>
      <p className="mt-4 text-soft">Sube las fotos que hayas hecho en la boda y les llegarán directamente.</p>
      <GuestUpload slug={slug} initialLeft={left} />
      <Link href={`/i/${slug}`} className="mt-10 text-sm text-soft underline">
        Volver a la invitación
      </Link>
    </main>
  );
}
