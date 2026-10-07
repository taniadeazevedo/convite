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
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {TEMPLATES.map((t) => (
          <div key={t.id}>
            <TemplateCard t={t} />
            <div className="mt-3 flex flex-col gap-2">
              <CreateButton template={t.id} />
              <Link href={`/demo/${t.id}`} className="text-center text-sm text-soft underline">
                Ver ejemplo
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
