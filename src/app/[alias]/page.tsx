import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicInvitation, { publicMetadata } from "@/components/PublicInvitation";
import { getByAlias } from "@/lib/db";

// Dirección con los nombres de la pareja: invitalia.es/lucia-y-marcos.
// Las páginas fijas de la web (/crear, /cuenta…) tienen prioridad sobre esta ruta.
type Props = { params: Promise<{ alias: string }> };

const find = (alias: string) => getByAlias(decodeURIComponent(alias).toLowerCase());

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return publicMetadata(find((await params).alias));
}

export default async function Page({ params }: Props) {
  const inv = find((await params).alias);
  if (!inv) notFound();
  return <PublicInvitation inv={inv} />;
}
