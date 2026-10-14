"use client";

import Link from "next/link";
import { useState } from "react";
import TemplateCard from "./TemplateCard";
import { TEMPLATES } from "@/lib/templates";

// Los diez diseños de la portada. La pareja puede escribir sus nombres y verlos al momento en todos;
// los nombres viajan después a la demo y al editor, para no tener que escribirlos otra vez.
// featured: diseños que se enseñan primero (en las páginas de un estilo concreto)
export default function DesignsGrid({ featured = [] }: { featured?: string[] }) {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const n1 = name1.trim();
  const n2 = name2.trim();
  const query = new URLSearchParams({ ...(n1 && { n1 }), ...(n2 && { n2 }) }).toString();
  // Posición de cada diseño: primero los destacados, en el orden en que se indican; luego el resto
  const rank = (id: string) => (featured.includes(id) ? featured.indexOf(id) : featured.length);
  const withNames = (path: string) => (query ? `${path}${path.includes("?") ? "&" : "?"}${query}` : path);

  return (
    <>
      <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-rule bg-card p-5">
        <p className="text-center text-sm font-medium">Probadla con vuestros nombres</p>
        <div className="mt-3 flex items-center gap-2">
          <input
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            maxLength={40}
            placeholder="Lucía"
            aria-label="Primer nombre"
            className="field min-w-0 flex-1 text-center"
          />
          <span className="font-serif text-2xl italic text-brand">&</span>
          <input
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            maxLength={40}
            placeholder="Marcos"
            aria-label="Segundo nombre"
            className="field min-w-0 flex-1 text-center"
          />
        </div>
        {(n1 || n2) && (
          <div className="mt-4 text-center">
            <Link href={withNames("/crear")} className="btn text-sm">
              Crear la nuestra
            </Link>
          </div>
        )}
      </div>
      <p className="mt-6 text-center text-soft">Toca cualquiera para verla completa, como la vería un invitado.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {[...TEMPLATES].sort((a, b) => rank(a.id) - rank(b.id)).map((t) => (
          <TemplateCard key={t.id} t={t} href={withNames(`/demo/${t.id}`)} names={{ name1: n1, name2: n2 }} />
        ))}
      </div>
    </>
  );
}
