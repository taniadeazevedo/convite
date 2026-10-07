import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import QRCode from "qrcode";
import PrintButton from "@/components/PrintButton";
import { Sparkle } from "@/components/invitation/Heroes";
import { currentUser, ownedInvitation } from "@/lib/auth";
import { getTemplate } from "@/lib/templates";

// Forma de la foto en el cartel, a juego con la portada de cada plantilla
const PHOTO_SHAPE: Record<string, string> = {
  arco: "rounded-t-full",
  polaroid: "border-[10px] border-b-[34px] border-white shadow-lg -rotate-3",
  boho: "rounded-full",
  revista: "grayscale",
  gala: "",
  curva: "rounded-[2rem]",
  oval: "rounded-[50%]",
  collage: "border-[8px] border-white shadow-lg rotate-2",
  ticket: "rounded-lg",
  pop: "rounded-[2rem]",
};

// Cartel para imprimir y poner en las mesas, con el mismo diseño que la invitación
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!(await currentUser())) redirect(`/entrar?next=/panel/${token}/qr`);
  const inv = await ownedInvitation(token);
  if (!inv) notFound();
  const t = getTemplate(inv.template);
  const h = await headers();
  const origin =
    process.env.SITE_URL ?? `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host") ?? "localhost:3000"}`;
  // El QR siempre en negro sobre blanco: es lo que mejor leen las cámaras
  const svg = await QRCode.toString(`${origin}/i/${inv.slug}/fotos`, { type: "svg", margin: 0, width: 230 });
  const left = t.align === "left";
  const tall = t.hero === "arco" || t.hero === "oval";

  return (
    <main className="flex min-h-svh flex-col items-center gap-6 bg-neutral-200 px-4 py-8 print:block print:bg-white print:p-0">
      <style>{`@page { size: A5; margin: 0 } @media print { body { background: #fff } * { -webkit-print-color-adjust: exact; print-color-adjust: exact } }`}</style>
      <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
        <PrintButton />
        <span className="text-sm text-neutral-600">Tamaño A5. En el diálogo de impresión, activa «Gráficos de fondo».</span>
      </div>
      {/* Todas las medidas van en % del ancho del cartel (cqw), para que se vea igual en pantalla y en papel */}
      <div
        className={`relative flex aspect-[148/210] w-full max-w-[148mm] flex-col justify-between overflow-hidden p-[9cqw] shadow-2xl print:max-w-none print:shadow-none ${
          left ? "items-start text-left" : "items-center text-center"
        } ${t.grain ? "grain" : ""}`}
        style={{ background: t.bg, color: t.text, fontFamily: t.bodyFont, containerType: "inline-size" }}
      >
        {t.hero === "gala" && <div className="absolute inset-[4cqw]" style={{ border: `1px solid ${t.accent}` }} />}
        {t.hero === "boho" && (
          <>
            <div className="absolute -top-[12cqw] -left-[12cqw] h-[38cqw] w-[38cqw] rounded-full" style={{ background: t.accent, opacity: 0.14 }} />
            <div className="absolute -right-[10cqw] -bottom-[10cqw] h-[32cqw] w-[32cqw] rounded-full" style={{ background: t.accent, opacity: 0.1 }} />
          </>
        )}

        <div className={`relative flex w-full flex-col gap-[2.5cqw] ${left ? "items-start" : "items-center"}`}>
          {inv.data.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={inv.data.cover} alt="" className={`w-[19cqw] object-cover ${tall ? "h-[25cqw]" : "h-[19cqw]"} ${PHOTO_SHAPE[t.hero]}`} />
          )}
          <p className="text-[2.3cqw] uppercase tracking-[0.4em]" style={{ color: t.accent, fontFamily: t.labelFont }}>
            {inv.data.name1 || "Nuestra"} & {inv.data.name2 || "boda"}
          </p>
          <h1
            className={`leading-[1.02] ${t.titleClass}`}
            style={{ fontFamily: t.titleFont, fontSize: t.hero === "pop" ? "9.5cqw" : t.hero === "gala" ? "8.5cqw" : "12cqw" }}
          >
            Comparte
            <br />
            tus fotos
          </h1>
        </div>

        <div
          className="relative w-[54cqw] bg-white p-[3.5cqw] [&>div>svg]:h-auto [&>div>svg]:w-full"
          style={{ borderRadius: t.radius === "999px" || t.radius === "1.75rem" ? "5cqw" : t.radius, border: `1px solid ${t.accent}` }}
        >
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        </div>

        <div className={`relative flex flex-col gap-[2.5cqw] ${left ? "items-start" : "items-center"}`}>
          {!left && <Sparkle t={t} size={14} />}
          <p className="max-w-[62cqw] text-[3.1cqw] leading-relaxed" style={{ color: t.muted }}>
            Apunta con la cámara del móvil al código y sube las fotos que hagas hoy. ¡Queremos verlas todas!
          </p>
        </div>
      </div>
    </main>
  );
}
