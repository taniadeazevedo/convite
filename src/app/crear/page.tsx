import Link from "next/link";
import { cookies } from "next/headers";
import CreateButton from "@/components/CreateButton";
import TemplateCard from "@/components/TemplateCard";
import { currentUser } from "@/lib/auth";
import { getByToken } from "@/lib/db";
import { trackVisit } from "@/lib/stats";
import { BRAND, TEMPLATES } from "@/lib/templates";

export default async function Crear({ searchParams }: { searchParams: Promise<{ plantilla?: string }> }) {
  const { plantilla } = await searchParams;
  await trackVisit("elegir");
  // Se puede empezar sin cuenta. Si ya hay un borrador a medias en este navegador, se ofrece seguir con él.
  const user = await currentUser();
  const draftToken = user ? undefined : (await cookies()).get("borrador")?.value;
  const draft = draftToken ? getByToken(draftToken) : null;
  const resume = draft && draft.userId === null && !draft.paid ? draft : null;
  const templates = [...TEMPLATES].sort((a, b) => Number(b.id === plantilla) - Number(a.id === plantilla));
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <Link href="/" className="font-serif text-2xl italic">
        {BRAND}
      </Link>
      <h1 className="mt-8 font-serif text-5xl">Elige vuestro diseño</h1>
      <p className="mt-2 text-soft">
        Sin registro y sin tarjeta. Podrás cambiarlo después sin perder lo que hayas escrito.
      </p>
      {resume && (
        <p className="mt-6 rounded-2xl border border-brand bg-card p-4 text-sm">
          Tenéis un borrador a medias{resume.data.name1 ? ` (${resume.data.name1}${resume.data.name2 ? ` y ${resume.data.name2}` : ""})` : ""}.{" "}
          <Link href={`/panel/${resume.token}`} className="font-semibold underline">
            Seguir con él
          </Link>
        </p>
      )}
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
