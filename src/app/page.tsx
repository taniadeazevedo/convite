import Link from "next/link";
import TemplateCard from "@/components/TemplateCard";
import { BRAND, PRICE_LABEL, TEMPLATES } from "@/lib/templates";

const STEPS = [
  ["Elige un diseño", "Cinco estilos distintos. Puedes cambiarlo cuando quieras sin perder nada."],
  ["Rellena vuestros datos", "Nombres, fecha, lugares, fotos… y oculta las secciones que no necesitéis."],
  ["Comparte el enlace", "Por WhatsApp o donde queráis. Las confirmaciones llegan a vuestro panel."],
];

const INCLUDES = [
  "Cuenta atrás hasta el gran día",
  "Lugares y horarios con botón a Google Maps",
  "Confirmación de asistencia con alergias y acompañantes",
  "Cronograma, alojamiento y autobuses",
  "Lista de regalos o número de cuenta",
  "Galería con vuestras fotos",
  "Preguntas frecuentes",
  "Lista de confirmados descargable en Excel",
  "Álbum con QR para que los invitados suban sus fotos",
  "Contador de visitas",
];

const FAQ = [
  ["¿Puedo probarlo antes de pagar?", "Sí. Creas y editas la invitación gratis, la ves tal cual quedará, y solo pagas cuando quieras publicarla."],
  ["¿Puedo cambiar cosas después de publicarla?", "Todas las veces que quieras, sin coste. Los cambios se ven al momento."],
  ["¿Mis invitados necesitan instalar algo?", "No. Abren un enlace en el móvil y listo."],
  ["¿Es un pago único?", `Sí, ${PRICE_LABEL} una sola vez. Sin suscripción.`],
];

export default function Home() {
  return (
    <main>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-serif text-2xl italic">{BRAND}</span>
        <Link href="/crear" className="btn text-sm">
          Crear invitación
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-6 pt-14 pb-16 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-soft">Invitaciones de boda digitales</p>
        <h1 className="mt-5 font-serif text-5xl leading-[1.05] sm:text-7xl">
          Vuestra invitación, <em>lista en diez minutos</em>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-soft">
          Elige un diseño, rellena vuestros datos y compártela por WhatsApp. Tus invitados confirman desde el
          móvil y tú lo ves todo en un panel.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/crear" className="btn">
            Empezar gratis
          </Link>
          <a href="#disenos" className="btn-ghost">
            Ver diseños
          </a>
        </div>
        <p className="mt-4 text-sm text-soft">Solo pagas al publicarla · {PRICE_LABEL} pago único</p>
      </section>

      <section id="disenos" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-center font-serif text-4xl">Cinco estilos, cinco bodas distintas</h2>
        <p className="mt-2 text-center text-soft">Toca cualquiera para verla completa, como la vería un invitado.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <TemplateCard key={t.id} t={t} href={`/demo/${t.id}`} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center font-serif text-4xl">Cómo funciona</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STEPS.map(([title, text], i) => (
            <div key={title} className="rounded-2xl border border-rule bg-card p-6">
              <div className="font-serif text-4xl italic text-brand">{i + 1}</div>
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="grid gap-8 rounded-3xl border border-rule bg-card p-8 sm:grid-cols-[1fr_auto] sm:p-10">
          <div>
            <h2 className="font-serif text-4xl">Todo incluido</h2>
            <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
              {INCLUDES.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="text-brand">✓</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center justify-center border-rule sm:border-l sm:pl-10">
            <div className="font-serif text-6xl">{PRICE_LABEL}</div>
            <div className="text-sm text-soft">pago único</div>
            <Link href="/crear" className="btn mt-5">
              Crear la mía
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-16">
        <h2 className="text-center font-serif text-4xl">Preguntas frecuentes</h2>
        <div className="mt-8 space-y-2">
          {FAQ.map(([q, a]) => (
            <details key={q} className="rounded-xl border border-rule bg-card px-5 py-4">
              <summary className="cursor-pointer font-semibold">{q}</summary>
              <p className="mt-2 text-sm text-soft">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-rule px-6 py-8 text-center text-sm text-soft">
        © {new Date().getFullYear()} {BRAND}
      </footer>
    </main>
  );
}
