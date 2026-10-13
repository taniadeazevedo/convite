import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicInvitation, { publicMetadata } from "@/components/PublicInvitation";
import { getBySlug } from "@/lib/db";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return publicMetadata(getBySlug((await params).slug));
}

export default async function Page({ params }: Props) {
  const inv = getBySlug((await params).slug);
  if (!inv) notFound();
  return <PublicInvitation inv={inv} />;
}
