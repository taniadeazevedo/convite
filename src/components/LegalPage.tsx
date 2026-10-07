import Link from "next/link";
import { LEGAL } from "@/lib/legal";
import { BRAND } from "@/lib/templates";

export const LEGAL_LINKS = [
  ["/legal/terminos", "Términos y condiciones"],
  ["/legal/privacidad", "Privacidad"],
  ["/legal/cookies", "Cookies"],
  ["/legal/aviso-legal", "Aviso legal"],
] as const;

export function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 mb-3 font-serif text-3xl">{children}</h2>;
}

export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-8">
      <Link href="/" className="font-serif text-3xl italic">{BRAND}</Link>
      <h1 className="mt-10 font-serif text-5xl">{title}</h1>
      <p className="mt-2 text-sm text-soft">Última actualización: {LEGAL.updated}</p>
      <div className="mt-6 space-y-4 leading-relaxed [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1">{children}</div>
      <nav className="mt-14 flex flex-wrap gap-x-5 gap-y-2 border-t border-rule pt-6 text-sm text-soft">
        {LEGAL_LINKS.map(([href, label]) => (
          <Link key={href} href={href} className="underline">{label}</Link>
        ))}
      </nav>
    </main>
  );
}
