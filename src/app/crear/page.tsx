import Link from "next/link";
import { redirect } from "next/navigation";
import CreateButton from "@/components/CreateButton";
import TemplateCard from "@/components/TemplateCard";
import { currentUser } from "@/lib/auth";
import { BRAND, TEMPLATES } from "@/lib/templates";

export default async function Crear({ searchParams }: { searchParams: Promise<{ plantilla?: string }> }) {
  const { plantilla } = await searchParams;
  // La invitación se guarda en una cuenta, así que primero hay que tener una
  if (!(await currentUser())) redirect(`/registro?next=${encodeURIComponent(plantilla ? `/crear?plantilla=${plantilla}` : "/crear")}`);
  const templates = [...TEMPLATES].sort((a, b) => Number(b.id === plantilla) - Number(a.id === plantilla));
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <Link href="/" className="font-serif text-2xl italic">
        {BRAND}
      </Link>
      <h1 className="mt-8 font-serif text-5xl">Elige vuestro diseño</h1>
      <p className="mt-2 text-soft">Podrás cambiarlo después sin perder lo que hayas escrito.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {templates.map((t) => (
          <div key={t.id} className={t.id === plantilla ? "rounded-2xl ring-2 ring-brand ring-offset-4 ring-offset-paper" : ""}>
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
