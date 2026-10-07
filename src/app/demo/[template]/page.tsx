import Link from "next/link";
import { notFound } from "next/navigation";
import Invitation from "@/components/Invitation";
import { isTemplateId, sampleData } from "@/lib/templates";

// La fecha de ejemplo se calcula respecto a hoy, así que no se genera de antemano
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ template: string }>;
  searchParams: Promise<{ n1?: string; n2?: string }>;
};

export default async function Demo({ params, searchParams }: Props) {
  const { template } = await params;
  // ?n1=…&n2=… permite ver cómo queda el diseño con otros nombres
  const { n1, n2 } = await searchParams;
  const data = sampleData(template);
  if (n1) data.name1 = n1.slice(0, 40);
  if (n2) data.name2 = n2.slice(0, 40);
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
      <Invitation template={template} data={data} mode="demo" />
    </>
  );
}
