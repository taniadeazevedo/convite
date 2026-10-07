import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Invitation from "@/components/Invitation";
import { addVisit, getBySlug } from "@/lib/db";
import { formatDate } from "@/lib/templates";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const inv = getBySlug(slug);
  if (!inv) return {};
  const { name1, name2, date, cover } = inv.data;
  return {
    title: `${name1 || "Nuestra"} & ${name2 || "boda"} · ¡Nos casamos!`,
    description: date ? `Os esperamos el ${formatDate(date)}.` : "Estáis invitados a nuestra boda.",
    openGraph: cover ? { images: [cover] } : undefined,
    robots: { index: false },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const inv = getBySlug(slug);
  if (!inv) notFound();
  if (inv.paid) addVisit(slug);
  return (
    <>
      {!inv.paid && (
        <div className="sticky top-0 z-10 bg-ink px-4 py-2 text-center text-sm text-white">
          Vista previa · todavía no está publicada y no acepta confirmaciones
        </div>
      )}
      <Invitation template={inv.template} data={inv.data} mode={inv.paid ? "live" : "preview"} slug={inv.slug} />
    </>
  );
}
