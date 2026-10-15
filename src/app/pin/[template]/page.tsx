import { notFound } from "next/navigation";
import TemplatePhone from "@/components/TemplatePhone";
import { DESIGN_INFO } from "@/lib/content/designs";
import { BRAND, TEMPLATES } from "@/lib/templates";

// Imagen vertical (1000 × 1500) de cada diseño para publicar en Pinterest.
// No es una página para visitantes: se abre y se captura como imagen.
export const metadata = { robots: { index: false } };

export default async function Pin({ params }: { params: Promise<{ template: string }> }) {
  const { template } = await params;
  const t = TEMPLATES.find((x) => x.id === template);
  if (!t) notFound();
  return (
    <main className="relative flex h-[1500px] w-[1000px] flex-col items-center overflow-hidden bg-paper px-16 pt-20 text-center">
      <p className="text-[22px] uppercase tracking-[0.4em] text-brand">Invitación de boda digital</p>
      <h1 className="mt-4 font-serif text-[110px] italic leading-none">{t.name}</h1>
      <p className="mt-5 max-w-[760px] text-[30px] leading-snug text-soft">{DESIGN_INFO[t.id]?.ideal ?? t.tagline}</p>
      {/* Móvil con el diseño, ampliado para que se vea bien en el pin */}
      <div className="mt-14 origin-top scale-[1.75]">
        <TemplatePhone template={t.id} />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-brand px-16 py-10 text-white">
        <p className="font-serif text-[44px] italic leading-none">Probadla con vuestros nombres</p>
        <p className="mt-3 text-[26px] tracking-wide">{BRAND.toLowerCase()}.es · confirmación de asistencia por WhatsApp</p>
      </div>
    </main>
  );
}
