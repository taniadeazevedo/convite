import Link from "next/link";
import { notFound } from "next/navigation";
import Invitation from "@/components/Invitation";
import TrackSource from "@/components/TrackSource";
import SiteFooter from "@/components/site/SiteFooter";
import { DESIGN_INFO } from "@/lib/content/designs";
import { trackVisit } from "@/lib/stats";
import { BRAND, TEMPLATES, isTemplateId, sampleData } from "@/lib/templates";

// La fecha de ejemplo se calcula respecto a hoy, así que no se genera de antemano
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ template: string }>;
  searchParams: Promise<{ n1?: string; n2?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { template } = await params;
  const t = TEMPLATES.find((x) => x.id === template);
  if (!t) return {};
  return {
    title: `Invitación de boda digital «${t.name}» · ${BRAND}`,
    description: `Diseño ${t.name}: ${t.tagline.toLowerCase()}. ${DESIGN_INFO[t.id]?.ideal ?? "Vedla completa, como la recibiría un invitado."}`.slice(0, 160),
    alternates: { canonical: `/demo/${t.id}` },
  };
}

export default async function Demo({ params, searchParams }: Props) {
  const { template } = await params;
  // ?n1=…&n2=… permite ver cómo queda el diseño con otros nombres
  const { n1, n2 } = await searchParams;
  const data = sampleData(template);
  if (n1) data.name1 = n1.slice(0, 40);
  if (n2) data.name2 = n2.slice(0, 40);
  if (!isTemplateId(template)) notFound();
  await trackVisit("demo");
  const t = TEMPLATES.find((x) => x.id === template);
  const info = DESIGN_INFO[template];
  return (
    <>
      <TrackSource />
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-rule bg-paper/95 px-4 py-3 text-sm backdrop-blur">
        <Link href="/#disenos" className="text-soft">
          ← Diseños
        </Link>
        <span className="hidden text-soft sm:inline">Invitación de ejemplo</span>
        <Link
          href={`/crear?${new URLSearchParams({ plantilla: template, ...(n1 && { n1: n1.slice(0, 40) }), ...(n2 && { n2: n2.slice(0, 40) }) })}`}
          className="btn px-4 py-2 text-sm"
        >
          Usar este diseño
        </Link>
      </div>
      <Invitation template={template} data={data} mode="demo" />
      {/* Sobre este diseño: texto propio de cada demo y enlace a su página de estilo */}
      {info && t && (
        <section className="border-t border-rule bg-paper px-6 py-14">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-brand">Diseño {t.name}</p>
            <h1 className="mt-3 font-serif text-4xl">Invitación de boda digital «{t.name}»</h1>
            <p className="mt-4 text-lg text-soft">{info.detail}</p>
            <p className="mt-3 text-soft">
              <strong className="text-ink">Ideal para:</strong> {info.ideal}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={`/crear?${new URLSearchParams({ plantilla: template, ...(n1 && { n1: n1.slice(0, 40) }), ...(n2 && { n2: n2.slice(0, 40) }) })}`}
                className="btn"
              >
                Usar este diseño
              </Link>
              <Link href={`/${info.stylePage}`} className="btn-ghost">
                Ver diseños parecidos
              </Link>
            </div>
          </div>
        </section>
      )}
      <SiteFooter />
    </>
  );
}
