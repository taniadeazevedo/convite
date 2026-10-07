import Link from "next/link";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { currentUser } from "@/lib/auth";
import { BRAND } from "@/lib/templates";

export const metadata = { title: "Crea tu cuenta · " + BRAND };

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await currentUser()) redirect("/cuenta");
  return (
    <main className="mx-auto flex min-h-svh max-w-sm flex-col justify-center px-6 py-12 text-center">
      <Link href="/" className="font-serif text-3xl italic">{BRAND}</Link>
      <h1 className="mt-8 font-serif text-5xl">Crea tu cuenta</h1>
      <p className="mt-2 text-soft">Es gratis. Con ella guardas vuestra invitación y ves quién ha confirmado.</p>
      <AuthForm mode="registro" next={next} />
    </main>
  );
}
