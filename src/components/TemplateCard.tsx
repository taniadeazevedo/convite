import Link from "next/link";
import Invitation from "./Invitation";
import { sampleData, type Template } from "@/lib/templates";

// Miniatura real de la plantilla: la invitación de ejemplo renderizada en pequeño
// names: si la pareja ha escrito sus nombres en la portada, la miniatura los enseña en vez de los de ejemplo
export default function TemplateCard({ t, href, names }: { t: Template; href?: string; names?: { name1?: string; name2?: string } }) {
  const data = sampleData(t.id);
  if (names?.name1) data.name1 = names.name1;
  if (names?.name2) data.name2 = names.name2;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-rule bg-card transition-transform hover:-translate-y-1">
      <div className="h-[400px] overflow-hidden" inert>
        <div className="w-[200%] origin-top-left scale-50">
          <Invitation template={t.id} data={data} mode="demo" embedded teaser />
        </div>
      </div>
      <div className="border-t border-rule p-3">
        <div className="font-serif text-2xl">{t.name}</div>
        <div className="text-xs text-soft">{t.tagline}</div>
      </div>
      {href && <Link href={href} aria-label={`Ver la plantilla ${t.name}`} className="absolute inset-0" />}
    </div>
  );
}
