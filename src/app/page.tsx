import Link from "next/link";
import TemplateCard from "@/components/TemplateCard";
import TemplatePhone from "@/components/TemplatePhone";
import { LEGAL_LINKS } from "@/components/LegalPage";
import { countInvitations } from "@/lib/db";
import { REVIEWS } from "@/lib/reviews";
import { BRAND, PRICE_LABEL, SAMPLE_PHOTOS, TEMPLATES } from "@/lib/templates";

const photo = (i: number) => SAMPLE_PHOTOS[i % SAMPLE_PHOTOS.length];

const STEPS = [
  ["Elige un diseño", "Diez estilos distintos. Puedes cambiarlo cuando quieras sin perder nada."],
  ["Rellena vuestros datos", "Nombres, fecha, lugares, fotos… y oculta las secciones que no necesitéis."],
  ["Comparte el enlace", "Por WhatsApp o donde queráis. Las confirmaciones llegan a vuestro panel."],
];

const FEATURES = [
  {
    eyebrow: "Confirmaciones",
    title: "Se acabó perseguir a los invitados",
    text: "Cada invitado confirma desde el móvil, indica cuántos son y sus alergias. Tú ves el recuento al momento y lo descargas en Excel para el catering.",
    photo: 2,
  },
  {
    eyebrow: "Vuestra historia",
    title: "Contad cómo empezó todo",
    text: "Una línea del tiempo por años, vuestras fotos favoritas y un mensaje de bienvenida. La invitación se parece a vosotros, no a una plantilla.",
    photo: 7,
  },
  {
    eyebrow: "Álbum con QR",
    title: "Las fotos de todos, en un solo sitio",
    text: "Os generamos el cartel con el código QR, con el mismo diseño que vuestra invitación. Solo tenéis que imprimirlo y ponerlo en las mesas: los invitados suben sus fotos y solo las veis vosotros.",
    photo: 4,
  },
];

const INCLUDES = [
  "Cuenta atrás hasta el gran día",
  "Lugares y horarios con botón a Google Maps",
  "Confirmación de asistencia con alergias y acompañantes",
  "Vuestra historia con línea del tiempo",
  "Cronograma, alojamiento y autobuses",
  "Lista de regalos o número de cuenta",
  "Galería con vuestras fotos",
  "Preguntas frecuentes",
  "Lista de confirmados descargable en Excel",
  "Álbum con QR para que los invitados suban sus fotos",
  "Contador de visitas",
  "Cambios ilimitados después de publicar",
];

const FAQ = [
  ["¿Puedo probarlo antes de pagar?", "Sí. Creas y editas la invitación gratis, la ves tal cual quedará, y solo pagas cuando quieras publicarla."],
  ["¿Puedo cambiar cosas después de publicarla?", "Todas las veces que quieras, sin coste. Los cambios se ven al momento."],
  ["¿Mis invitados necesitan instalar algo?", "No. Abren un enlace en el móvil y listo."],
  ["¿Puedo quitar secciones que no necesito?", "Sí, cada sección tiene un interruptor. Si no hay autobuses o no queréis lista de regalos, se oculta."],
  ["¿Cómo se paga?", `Con tarjeta, en una página segura de Stripe, justo cuando decidís publicarla. Son ${PRICE_LABEL} una sola vez, sin suscripción.`],
  ["¿Necesito una cuenta?", "Sí, con vuestro correo y una contraseña. Así la invitación queda guardada y podéis volver a entrar cuando queráis para editarla o ver quién ha confirmado."],
];

function Img({ i, className }: { i: number; className: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={photo(i)} alt="" loading="lazy" className={`object-cover ${className}`} />;
}

// La cifra de parejas se lee de la base de datos en cada visita
export const dynamic = "force-dynamic";

// A partir de cuántas invitaciones creadas se enseña la cifra
const MIN_TO_SHOW = 25;

export default function Home() {
  const couples = countInvitations();
  return (
    <main className="overflow-x-clip">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-serif text-3xl italic">{BRAND}</span>
        <nav className="hidden gap-7 text-sm text-soft sm:flex">
          <a href="#disenos">Diseños</a>
          <a href="#como">Cómo funciona</a>
          <a href="#precio">Precio</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/entrar" className="text-sm font-medium">
            Entrar
          </Link>
          <Link href="/crear" className="btn text-sm">
            Crear invitación
          </Link>
        </div>
      </header>

      {/* Portada */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-10 pb-20 lg:grid-cols-[1fr_auto]">
        <div className="text-center lg:text-left">
          <p className="text-[11px] uppercase tracking-[0.4em] text-soft">Invitaciones de boda digitales</p>
          <h1 className="mt-5 font-serif text-6xl leading-[0.98] sm:text-7xl lg:text-8xl">
            La invitación que <em className="text-brand">todos</em> van a abrir
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-soft lg:mx-0">
            Elige un diseño, rellena vuestros datos y compártela por WhatsApp. Tus invitados confirman desde el
            móvil y tú lo ves todo en un panel.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link href="/crear" className="btn">
              Empezar gratis
            </Link>
            <a href="#disenos" className="btn-ghost">
              Ver los 10 diseños
            </a>
          </div>
          <p className="mt-4 text-sm text-soft">Solo pagas al publicarla · {PRICE_LABEL} pago único</p>
          {/* Cifra real: sale sola cuando haya suficientes invitaciones creadas */}
          {couples >= MIN_TO_SHOW && (
            <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
              <div className="flex -space-x-2">
                {["#b0603f", "#7d8f73", "#c98b86", "#1d3b5c"].map((c) => (
                  <span key={c} className="grid h-9 w-9 place-items-center rounded-full border-2 border-paper text-sm text-white" style={{ background: c }}>
                    ♥
                  </span>
                ))}
              </div>
              <p className="text-sm">
                <strong>{couples} parejas</strong> ya han creado su invitación con {BRAND}
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <TemplatePhone template="terracota" className="mt-16 hidden -rotate-6 sm:block" />
          <TemplatePhone template="lino" className="z-10 sm:-mx-8" />
          <TemplatePhone template="pop" className="mt-16 hidden rotate-6 sm:block" />
        </div>
      </section>

      {/* Tira de fotos en movimiento */}
      <section className="overflow-hidden py-6" aria-hidden>
        <div className="marquee flex w-max gap-4">
          {[...Array(2)].flatMap((_, k) =>
            SAMPLE_PHOTOS.slice(0, 10).map((_, i) => (
              <Img
                key={`${k}-${i}`}
                i={i}
                className={`h-64 w-48 shrink-0 ${i % 3 === 0 ? "rounded-t-full" : i % 3 === 1 ? "rounded-2xl" : "rounded-[50%]"}`}
              />
            )),
          )}
        </div>
      </section>

      {/* Diseños */}
      <section id="disenos" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-center text-[11px] uppercase tracking-[0.4em] text-brand">Diseños</p>
        <h2 className="mt-3 text-center font-serif text-5xl sm:text-6xl">
          Diez estilos, <em>diez bodas distintas</em>
        </h2>
        <p className="mt-3 text-center text-soft">Toca cualquiera para verla completa, como la vería un invitado.</p>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {TEMPLATES.map((t) => (
            <TemplateCard key={t.id} t={t} href={`/demo/${t.id}`} />
          ))}
        </div>
      </section>

      {/* Ventajas con foto */}
      <section className="mx-auto max-w-5xl space-y-24 px-6 py-16">
        {FEATURES.map((f, i) => (
          <div key={f.title} className="grid items-center gap-10 md:grid-cols-2">
            <div className={`relative mx-auto w-full max-w-sm ${i % 2 ? "md:order-2" : ""}`}>
              <div className={`absolute inset-0 translate-x-4 translate-y-4 border border-brand ${i % 2 ? "rounded-[2rem]" : "rounded-t-full"}`} />
              <Img i={f.photo} className={`relative aspect-[4/5] w-full ${i % 2 ? "rounded-[2rem]" : "rounded-t-full"}`} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-brand">{f.eyebrow}</p>
              <h3 className="mt-3 font-serif text-5xl leading-[1.02]">{f.title}</h3>
              <p className="mt-4 text-lg text-soft">{f.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Cómo funciona */}
      <section id="como" className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center font-serif text-5xl">Lista en diez minutos</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {STEPS.map(([title, text], i) => (
            <div key={title} className="rounded-3xl border border-rule bg-card p-7">
              <div className="font-serif text-6xl italic text-brand">{i + 1}</div>
              <h3 className="mt-3 text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mosaico de fotos */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid h-[34rem] grid-cols-2 grid-rows-2 gap-3 md:grid-cols-4">
          <Img i={0} className="row-span-2 h-full w-full rounded-3xl" />
          <Img i={9} className="h-full w-full rounded-3xl" />
          <Img i={3} className="hidden h-full w-full rounded-3xl md:block" />
          <Img i={12} className="row-span-2 hidden h-full w-full rounded-3xl md:block" />
          <Img i={10} className="h-full w-full rounded-3xl" />
          <div className="hidden flex-col justify-center rounded-3xl bg-brand p-6 text-white md:flex">
            <p className="font-serif text-3xl italic leading-tight">Vuestra boda no es como las demás. Vuestra invitación tampoco.</p>
          </div>
        </div>
      </section>

      {/* Opiniones: solo aparece cuando hay opiniones reales en src/lib/reviews.ts */}
      {REVIEWS.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-center font-serif text-5xl">Lo que dicen las parejas</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="rounded-3xl border border-rule bg-card p-7">
                <div className="text-brand">★★★★★</div>
                <blockquote className="mt-3 font-serif text-2xl leading-snug">«{r.text}»</blockquote>
                <figcaption className="mt-4 text-sm text-soft">
                  {r.name} · {r.place}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Precio */}
      <section id="precio" className="mx-auto max-w-4xl px-6 py-20">
        <div className="grid gap-8 rounded-[2rem] border border-rule bg-card p-8 sm:grid-cols-[1fr_auto] sm:p-12">
          <div>
            <h2 className="font-serif text-5xl">Todo incluido</h2>
            <ul className="mt-6 grid gap-2.5 text-sm sm:grid-cols-2">
              {INCLUDES.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="text-brand">✓</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center justify-center border-rule sm:border-l sm:pl-12">
            <div className="font-serif text-7xl">{PRICE_LABEL}</div>
            <div className="text-sm text-soft">pago único, sin suscripción</div>
            <Link href="/crear" className="btn mt-6">
              Crear la mía
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-20">
        <h2 className="text-center font-serif text-5xl">Preguntas frecuentes</h2>
        <div className="mt-8">
          {FAQ.map(([q, a]) => (
            <details key={q} className="border-t border-rule py-5">
              <summary className="cursor-pointer text-lg font-medium">{q}</summary>
              <p className="mt-2 text-soft">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Llamada final sobre foto */}
      <section className="relative mx-4 mb-10 overflow-hidden rounded-[2.5rem] sm:mx-8">
        <Img i={5} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative px-6 py-28 text-center text-white">
          <h2 className="mx-auto max-w-2xl font-serif text-6xl leading-none sm:text-7xl">
            Empezad hoy. <em>Es gratis hasta publicarla.</em>
          </h2>
          <Link href="/crear" className="btn mt-8">
            Crear nuestra invitación
          </Link>
        </div>
      </section>

      <footer className="border-t border-rule px-6 py-8 text-center text-sm text-soft">
        <nav className="mb-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {LEGAL_LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="underline">
              {label}
            </Link>
          ))}
        </nav>
        © {new Date().getFullYear()} {BRAND} · Fotos de ejemplo de Unsplash
      </footer>
    </main>
  );
}
