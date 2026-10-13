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
  const tall = t.hero === "arco" || t.hero === "oval";
  const cover = inv.data.cover;
  // Tamaño del título en % del ancho: las tipografías más anchas van algo más pequeñas, y con foto hay menos sitio
  const titleSize = (t.hero === "pop" ? 9.5 : t.hero === "gala" ? 11 : t.hero === "revista" ? 12.5 : 14.5) - (cover ? 3 : 0);

  return (
    <main className="flex min-h-svh flex-col items-center gap-6 bg-neutral-200 px-4 py-8 print:block print:bg-white print:p-0">
      <style>{`@page { size: A5; margin: 0 } @media print { body { background: #fff } * { -webkit-print-color-adjust: exact; print-color-adjust: exact } }`}</style>
      <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
        <PrintButton />
        <span className="text-sm text-neutral-600">Tamaño A5. En el diálogo de impresión, activa «Gráficos de fondo».</span>
      </div>
      {/* El marco exterior es el «contenedor»: dentro, todas las medidas van en % de su ancho (cqw),
          así el cartel se ve igual en pantalla y en papel. El contenedor no lleva relleno, porque las
          unidades cqw se calculan sobre su interior y un relleno encogería todo el diseño. */}
      <div className="w-full max-w-[148mm] shadow-2xl print:max-w-none print:shadow-none" style={{ containerType: "inline-size" }}>
        <div
          className={`relative flex aspect-[148/210] w-full flex-col items-center justify-between overflow-hidden px-[8cqw] py-[9cqw] text-center ${t.grain ? "grain" : ""}`}
          style={{ background: t.bg, color: t.text, fontFamily: t.bodyFont }}
        >
          {/* Marco fino que recoge la composición */}
          <div className="absolute inset-[3.5cqw]" style={{ border: `1px solid ${t.accent}`, opacity: 0.6, borderRadius: t.hero === "gala" || t.hero === "revista" ? 0 : "3cqw" }} />
          {t.hero === "boho" && (
            <>
              <div className="absolute -top-[12cqw] -left-[12cqw] h-[42cqw] w-[42cqw] rounded-full" style={{ background: t.accent, opacity: 0.14 }} />
              <div className="absolute -right-[10cqw] -bottom-[10cqw] h-[36cqw] w-[36cqw] rounded-full" style={{ background: t.accent, opacity: 0.1 }} />
            </>
          )}

          {/* Arriba: foto (si hay), nombres y título */}
          <div className="relative flex w-full flex-col items-center gap-[2.5cqw]">
            {cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="" className={`w-[15cqw] object-cover ${tall ? "h-[19cqw]" : "h-[15cqw]"} ${PHOTO_SHAPE[t.hero]}`} />
            )}
            <p className="text-[3.2cqw] uppercase tracking-[0.35em]" style={{ color: t.accent, fontFamily: t.labelFont }}>
              {inv.data.name1 || "Nuestra"} & {inv.data.name2 || "boda"}
            </p>
            <h1 className={`leading-[1.02] ${t.titleClass}`} style={{ fontFamily: t.titleFont, fontSize: `${titleSize}cqw` }}>
              Comparte
              <br />
              tus fotos
            </h1>
          </div>

          {/* Centro: el código, grande */}
          <div
            className="relative bg-white p-[3.5cqw] [&>div>svg]:h-auto [&>div>svg]:w-full"
            style={{
              width: `${cover ? 46 : 60}cqw`,
              borderRadius: t.radius === "999px" || t.radius === "1.75rem" ? "5cqw" : t.radius,
              border: `1px solid ${t.accent}`,
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          </div>

          {/* Abajo: instrucciones */}
          <div className="relative flex flex-col items-center gap-[2cqw]">
            <Sparkle t={t} size={16} />
            <p className="max-w-[76cqw] leading-snug" style={{ color: t.muted, fontSize: `${cover ? 3.5 : 3.8}cqw` }}>
              Apunta con la cámara del móvil al código y sube las fotos que hagas hoy. ¡Queremos verlas todas!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
