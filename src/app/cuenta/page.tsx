import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { currentUser } from "@/lib/auth";
import { countRsvps, listByUser } from "@/lib/db";
import { BRAND, formatDate, getTemplate } from "@/lib/templates";

export const metadata = { title: `Mi cuenta · ${BRAND}`, robots: { index: false } };

export default async function Cuenta() {
  const user = await currentUser();
  if (!user) redirect("/entrar?next=/cuenta");
  const invitations = listByUser(user.id);
  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <header className="flex items-center justify-between">
        <Link href="/" className="font-serif text-3xl italic">{BRAND}</Link>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-soft sm:inline">{user.email}</span>
          <LogoutButton />
        </div>
      </header>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-5xl">Mis invitaciones</h1>
        <Link href="/crear" className="btn text-sm">+ Nueva invitación</Link>
      </div>
      {invitations.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-rule bg-card p-8 text-center text-soft">
          Todavía no has creado ninguna. Elige un diseño y empieza: es gratis hasta que la publiques.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {invitations.map((inv) => (
            <li key={inv.slug} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rule bg-card p-5">
              <div>
                <div className="font-serif text-3xl">
                  {inv.data.name1 || "Sin nombres"} & {inv.data.name2 || "todavía"}
                </div>
                <div className="mt-1 text-sm text-soft">
                  {getTemplate(inv.template).name} · {formatDate(inv.data.date) || "sin fecha"} ·{" "}
                  {inv.paid ? `Publicada · ${countRsvps(inv.slug)} respuestas · ${inv.visits} visitas` : "Borrador"}
                </div>
              </div>
              <Link href={`/panel/${inv.token}`} className="btn-ghost px-4 py-2 text-sm">Abrir panel</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
