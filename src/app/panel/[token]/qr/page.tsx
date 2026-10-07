import { headers } from "next/headers";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import PrintButton from "@/components/PrintButton";
import { getByToken } from "@/lib/db";

// Cartel para imprimir y poner en las mesas
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const inv = getByToken(token);
  if (!inv) notFound();
  const h = await headers();
  const origin =
    process.env.SITE_URL ?? `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host") ?? "localhost:3000"}`;
  const svg = await QRCode.toString(`${origin}/i/${inv.slug}/fotos`, { type: "svg", margin: 0, width: 260 });
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 bg-white px-6 py-12 text-center">
      <p className="text-[11px] uppercase tracking-[0.4em] text-soft">
        {inv.data.name1} & {inv.data.name2}
      </p>
      <h1 className="font-serif text-6xl italic">Comparte tus fotos</h1>
      <div dangerouslySetInnerHTML={{ __html: svg }} />
      <p className="max-w-xs text-soft">Apunta con la cámara del móvil al código y sube las fotos que hagas hoy.</p>
      <PrintButton />
    </main>
  );
}
