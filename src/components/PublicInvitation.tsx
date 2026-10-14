import type { Metadata } from "next";
import Invitation from "./Invitation";
import { dailyCleanup } from "@/lib/cleanup";
import { addVisit, type Invitation as Inv } from "@/lib/db";
import { formatDate, isAfterWedding } from "@/lib/templates";

// Lo que ven los invitados. Lo usan las dos direcciones de una invitación:
// /lucia-y-marcos (con los nombres) y /i/codigo (la interna, que sigue funcionando).

export function publicMetadata(inv: Inv | null): Metadata {
  if (!inv) return {};
  const { name1, name2, date, cover } = inv.data;
  return {
    title: `${name1 || "Nuestra"} & ${name2 || "boda"} · ${isAfterWedding(date) ? "¡Nos hemos casado!" : "¡Nos casamos!"}`,
    description: date ? `Os esperamos el ${formatDate(date)}.` : "Estáis invitados a nuestra boda.",
    openGraph: cover ? { images: [cover] } : undefined,
    robots: { index: false },
  };
}

export default function PublicInvitation({ inv }: { inv: Inv }) {
  dailyCleanup();
  if (inv.paid) addVisit(inv.slug);
  return (
    <>
      {!inv.paid && (
        <div className="sticky top-0 z-10 bg-ink px-4 py-2 text-center text-sm text-white">
          Vista previa · todavía no está publicada y no acepta confirmaciones
        </div>
      )}
      {/* En Premium no aparece el «Hecha con Invitalia» del pie */}
      <Invitation template={inv.template} data={inv.data} mode={inv.paid ? "live" : "preview"} slug={inv.slug} branding={inv.plan !== "premium"} afterWedding={isAfterWedding(inv.data.date)} />
    </>
  );
}
