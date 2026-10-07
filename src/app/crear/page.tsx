import Link from "next/link";
import CreateButton from "@/components/CreateButton";
import TemplateCard from "@/components/TemplateCard";
import { BRAND, TEMPLATES } from "@/lib/templates";

export default function Crear() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <Link href="/" className="font-serif text-2xl italic">
        {BRAND}
      </Link>
      <h1 className="mt-8 font-serif text-5xl">Elige vuestro diseño</h1>
      <p className="mt-2 text-soft">Podrás cambiarlo después sin perder lo que hayas escrito.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <div key={t.id}>
            <TemplateCard t={t} />
            <div className="mt-3 flex gap-2">
              <CreateButton template={t.id} />
              <Link href={`/demo/${t.id}`} className="btn-ghost text-sm">
                Ver ejemplo
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
