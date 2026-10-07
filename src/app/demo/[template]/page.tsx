import Link from "next/link";
import { notFound } from "next/navigation";
import Invitation from "@/components/Invitation";
import { isTemplateId, sampleData } from "@/lib/templates";

// La fecha de ejemplo se calcula respecto a hoy, así que no se genera de antemano
export const dynamic = "force-dynamic";

export default async function Demo({ params }: { params: Promise<{ template: string }> }) {
  const { template } = await params;
  if (!isTemplateId(template)) notFound();
  return (
    <>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-rule bg-paper/95 px-4 py-3 text-sm backdrop-blur">
        <Link href="/#disenos" className="text-soft">
          ← Diseños
        </Link>
        <span className="hidden text-soft sm:inline">Invitación de ejemplo</span>
        <Link href={`/crear?plantilla=${template}`} className="btn px-4 py-2 text-sm">
          Usar este diseño
        </Link>
      </div>
      <Invitation template={template} data={sampleData()} mode="demo" />
    </>
  );
}
