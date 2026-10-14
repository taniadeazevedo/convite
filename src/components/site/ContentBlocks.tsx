import Link from "next/link";
import type { Block, Faq } from "@/lib/content/types";

// Pinta los bloques de texto de guías y páginas de producto con el estilo de la web.
// ctaHref: a dónde lleva el botón de los bloques «cta».
export default function ContentBlocks({ blocks, ctaHref }: { blocks: Block[]; ctaHref: string }) {
  return (
    <div className="space-y-5 text-lg leading-relaxed">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return <h2 key={i} className="pt-6 font-serif text-4xl leading-tight text-ink">{b.text}</h2>;
          case "h3":
            return <h3 key={i} className="pt-2 text-xl font-semibold text-ink">{b.text}</h3>;
          case "p":
            return <p key={i} className="text-soft">{b.text}</p>;
          case "ul":
            return (
              <ul key={i} className="space-y-2 text-soft">
                {b.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-brand">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="space-y-3 text-soft">
                {b.items.map((item, n) => (
                  <li key={item} className="flex gap-4">
                    <span className="font-serif text-3xl italic leading-none text-brand">{n + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote key={i} className="rounded-2xl border-l-4 border-brand bg-card px-6 py-4 font-serif text-2xl leading-snug text-ink">
                «{b.text}»
              </blockquote>
            );
          case "cta":
            return (
              <div key={i} className="rounded-3xl border border-brand bg-card p-6 text-center">
                <p className="font-serif text-3xl text-ink">{b.text}</p>
                <p className="mt-1 text-base text-soft">Gratis hasta publicarla, sin registraros.</p>
                <Link href={ctaHref} className="btn mt-4 text-base">
                  Empezar gratis
                </Link>
              </div>
            );
        }
      })}
    </div>
  );
}

// Preguntas frecuentes en acordeón
export function FaqList({ faq }: { faq: Faq[] }) {
  return (
    <div>
      {faq.map(([q, a]) => (
        <details key={q} className="border-t border-rule py-5">
          <summary className="cursor-pointer text-lg font-medium text-ink">{q}</summary>
          <p className="mt-2 text-soft">{a}</p>
        </details>
      ))}
    </div>
  );
}

// Datos estructurados de preguntas frecuentes para Google
export function faqJsonLd(faq: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}

// Inserta datos estructurados sin permitir que un «<» cierre la etiqueta
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
