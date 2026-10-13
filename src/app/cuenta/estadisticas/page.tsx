import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { listStats } from "@/lib/db";
import { FUNNEL, firstDayOf, isAdmin } from "@/lib/stats";
import { BRAND, PLANS, UPGRADE_CENTS } from "@/lib/templates";

export const metadata = { title: `Estadísticas · ${BRAND}`, robots: { index: false } };
export const dynamic = "force-dynamic";

const DAYS = 30;

export default async function Estadisticas() {
  const user = await currentUser();
  if (!user) redirect("/entrar?next=/cuenta/estadisticas");
  // Solo la ve el correo indicado en la variable ADMIN_EMAIL; para el resto la página no existe
  if (!isAdmin(user.email)) notFound();

  const rows = listStats(firstDayOf(DAYS));
  // Primer día de cada periodo que se muestra
  const from: Record<number, string> = { 1: firstDayOf(1), 7: firstDayOf(7), [DAYS]: firstDayOf(DAYS) };
  const total = (event: string, days: number) =>
    rows.filter((r) => r.event === event && r.day >= from[days]).reduce((n, r) => n + r.n, 0);
  const days = [...new Set(rows.map((r) => r.day))];
  const cell = (day: string, event: string) => rows.find((r) => r.day === day && r.event === event)?.n ?? 0;
  // Cada venta cuenta al precio Esencial; las Premium y las mejoras suman la diferencia
  const revenue = (days: number) => {
    const cents = total("venta", days) * PLANS.basico.cents + (total("premium", days) + total("mejora", days)) * UPGRADE_CENTS;
    return `${(cents / 100).toLocaleString("es-ES")} €`;
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <Link href="/cuenta" className="text-sm text-soft underline">
        ← Mi cuenta
      </Link>
      <h1 className="mt-6 font-serif text-5xl">Estadísticas</h1>
      <p className="mt-2 text-sm text-soft">
        Cada fila es un paso hacia la venta. El porcentaje indica cuántos llegan a ese paso desde el anterior: donde
        más baje es donde se pierden clientes. No se cuentan robots ni vistas previas de WhatsApp.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-rule bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule text-left text-soft">
              <th className="p-3 font-medium">Paso</th>
              <th className="p-3 text-right font-medium">Hoy</th>
              <th className="p-3 text-right font-medium">7 días</th>
              <th className="p-3 text-right font-medium">{DAYS} días</th>
              <th className="p-3 text-right font-medium">Pasan del anterior</th>
            </tr>
          </thead>
          <tbody>
            {FUNNEL.map(([event, label], i) => {
              const now = total(event, DAYS);
              const prev = i > 0 ? total(FUNNEL[i - 1][0], DAYS) : 0;
              return (
                <tr key={event} className="border-b border-rule last:border-0">
                  <td className="p-3">{label}</td>
                  <td className="p-3 text-right tabular-nums">{total(event, 1)}</td>
                  <td className="p-3 text-right tabular-nums">{total(event, 7)}</td>
                  <td className="p-3 text-right font-semibold tabular-nums">{now}</td>
                  <td className="p-3 text-right tabular-nums text-soft">
                    {i > 0 && prev > 0 ? `${Math.round((now / prev) * 100)} %` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm">
        Ingresos estimados: <strong>{revenue(7)}</strong> en 7 días · <strong>{revenue(DAYS)}</strong> en {DAYS} días
        (a precio actual, sin descontar códigos promocionales ni comisiones de Stripe). De las ventas de {DAYS}{" "}
        días, {total("premium", DAYS)} fueron Premium y {total("mejora", DAYS)} mejoraron después.
      </p>

      <h2 className="mt-10 font-serif text-3xl">Día a día</h2>
      {days.length === 0 ? (
        <p className="mt-3 text-sm text-soft">Todavía no hay datos.</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-2xl border border-rule bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule text-left text-soft">
                <th className="p-3 font-medium">Día</th>
                {FUNNEL.map(([event, label]) => (
                  <th key={event} className="p-3 text-right font-medium" title={label}>
                    {event}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day} className="border-b border-rule last:border-0">
                  <td className="p-3 tabular-nums">{day.split("-").reverse().join("/")}</td>
                  {FUNNEL.map(([event]) => (
                    <td key={event} className="p-3 text-right tabular-nums">
                      {cell(day, event) || "·"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
