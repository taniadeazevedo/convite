import { formatDate, formatDateDots, type InvitationData, type Template } from "@/lib/templates";

export type HeroProps = {
  t: Template;
  data: InvitationData;
  name1: string;
  name2: string;
  embedded?: boolean;
};

export function Sparkle({ t, size = 18 }: { t: Template; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={t.accent} aria-hidden>
      <path d="M12 0c.6 6.5 5.5 11.4 12 12c-6.5.6-11.4 5.5-12 12c-.6-6.500-5.500-11.400-12-12c6.500-.6 11.400-5.500 12-12Z" />
    </svg>
  );
}

// Foto de portada, o un monograma con las iniciales si todavía no han subido ninguna
function Photo({ t, src, name1, name2, className }: { t: Template; src: string; name1: string; name2: string; className: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className={`object-cover ${className}`} />;
  }
  return (
    <div
      className={`flex items-center justify-center text-5xl ${className}`}
      style={{ fontFamily: t.titleFont, color: t.accent, background: `linear-gradient(160deg, ${t.surface}, ${t.line})` }}
    >
      {name1[0]}
      <span className="mx-1 text-2xl">&</span>
      {name2[0]}
    </div>
  );
}

const label = "text-[11px] uppercase tracking-[0.4em]";

// Tamaño de letra que hace caber el nombre más largo en el ancho de la portada (en % del contenedor)
const fit = (chars: number, charWidth: number, max: number) =>
  `${Math.min(max, 92 / (Math.max(chars, 3) * charWidth)).toFixed(1)}cqw`;
const full = (p: HeroProps) => (p.embedded ? "" : "min-h-svh");

function HeroArco(p: HeroProps) {
  const { t, data, name1, name2 } = p;
  return (
    <header className={`flex flex-col items-center justify-center gap-7 px-6 py-16 text-center ${full(p)}`}>
      <p className={label} style={{ color: t.muted }}>nos casamos</p>
      <div className="rounded-t-full p-2" style={{ border: `1px solid ${t.accent}` }}>
        <div className="h-88 w-64 overflow-hidden rounded-t-full">
          <Photo t={t} src={data.cover} name1={name1} name2={name2} className="h-full w-full" />
        </div>
      </div>
      <h1 className={`text-6xl leading-[1.02] sm:text-7xl ${t.titleClass}`} style={{ fontFamily: t.titleFont }}>
        {name1}
        <span className="block text-3xl not-italic" style={{ color: t.accent }}>&</span>
        {name2}
      </h1>
      <div className="flex items-center gap-3">
        <Sparkle t={t} size={12} />
        <p className="text-sm tracking-[0.3em]">{formatDateDots(data.date) || "fecha por confirmar"}</p>
        <Sparkle t={t} size={12} />
      </div>
      {data.city && <p className={label} style={{ color: t.muted }}>{data.city}</p>}
    </header>
  );
}

function HeroPolaroid(p: HeroProps) {
  const { t, data, name1, name2 } = p;
  return (
    <header className={`flex flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16 text-center ${full(p)}`}>
      <p className="text-3xl" style={{ fontFamily: t.titleFont, color: t.accent }}>¡nos casamos!</p>
      <div className="relative">
        {/* segunda polaroid asomando por detrás */}
        <div className="absolute inset-0 translate-x-6 rotate-6 bg-white shadow-lg" />
        <div className="relative -rotate-3 bg-white p-3 pb-4 shadow-xl">
          {/* trozo de celo */}
          <div className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-2" style={{ background: t.accent, opacity: 0.35 }} />
          <Photo t={t} src={data.cover} name1={name1} name2={name2} className="h-72 w-60" />
          <p className="mt-3 text-2xl text-neutral-700" style={{ fontFamily: t.titleFont }}>
            {formatDateDots(data.date) || "muy pronto"}
          </p>
        </div>
      </div>
      <h1 className="text-6xl leading-none sm:text-7xl" style={{ fontFamily: t.titleFont }}>
        {name1} <span style={{ color: t.accent }}>+</span> {name2}
      </h1>
      {data.city && <p className={label} style={{ color: t.muted }}>{data.city}</p>}
    </header>
  );
}

function HeroBoho(p: HeroProps) {
  const { t, data, name1, name2 } = p;
  return (
    <header className={`relative flex flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16 text-center ${full(p)}`}>
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full" style={{ background: t.accent, opacity: 0.14 }} />
      <div className="absolute -right-20 bottom-10 h-52 w-52 rounded-full" style={{ background: t.accent, opacity: 0.1 }} />
      <div className="relative">
        <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-full" style={{ border: `1.5px solid ${t.accent}` }} />
        <div className="relative h-72 w-72 overflow-hidden rounded-full">
          <Photo t={t} src={data.cover} name1={name1} name2={name2} className="h-full w-full" />
        </div>
      </div>
      <div className="relative">
        <h1 className={`text-5xl leading-tight sm:text-6xl ${t.titleClass}`} style={{ fontFamily: t.titleFont }}>
          {name1} <span style={{ color: t.accent }}>y</span> {name2}
        </h1>
        {/* arcoíris boho */}
        <svg className="mx-auto mt-6" width="72" height="38" viewBox="0 0 72 38" fill="none" aria-hidden>
          {[34, 25, 16].map((r, i) => (
            <path key={r} d={`M${36 - r} 38a${r} ${r} 0 0 1 ${r * 2} 0`} stroke={t.accent} strokeWidth="3" opacity={1 - i * 0.3} />
          ))}
        </svg>
        <p className="mt-6 text-lg">{formatDate(data.date) || "Fecha por confirmar"}</p>
        {data.city && <p className={`mt-2 ${label}`} style={{ color: t.muted }}>{data.city}</p>}
      </div>
    </header>
  );
}

function HeroRevista(p: HeroProps) {
  const { t, data, name1, name2 } = p;
  const [y, m, d] = data.date ? data.date.split("-") : ["", "", ""];
  return (
    <header className={`@container flex flex-col px-6 py-8 ${full(p)}`}>
      <div className="flex justify-between pb-3 text-[10px] uppercase tracking-[0.3em]" style={{ borderBottom: `1px solid ${t.text}` }}>
        <span>La boda</span>
        <span>{data.city || "Edición única"}</span>
      </div>
      <h1
        className={`py-6 leading-[0.9] ${t.titleClass}`}
        style={{ fontFamily: t.titleFont, fontSize: fit(Math.max(name1.length, name2.length + 2), 0.66, 22) }}
      >
        {name1}
        <br />
        <span className="italic normal-case">&</span> {name2}
      </h1>
      <Photo t={t} src={data.cover} name1={name1} name2={name2} className="aspect-[4/5] w-full grayscale" />
      <div className="mt-4 flex items-end justify-between pt-3" style={{ borderTop: `1px solid ${t.text}` }}>
        <p className="max-w-[9rem] text-[10px] uppercase leading-relaxed tracking-[0.3em]" style={{ color: t.muted }}>
          Reserva la fecha
        </p>
        <p className="text-5xl font-light tabular-nums" style={{ fontFamily: t.titleFont }}>
          {data.date ? `${d}.${m}.${y.slice(2)}` : "--.--.--"}
        </p>
      </div>
    </header>
  );
}

function HeroGala(p: HeroProps) {
  const { t, data, name1, name2 } = p;
  return (
    <header className={`relative flex items-center justify-center p-4 text-center ${p.embedded ? "min-h-[640px]" : "min-h-svh"}`}>
      {data.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0" style={{ background: t.bg, opacity: data.cover ? 0.68 : 1 }} />
      <div className="absolute inset-4" style={{ border: `1px solid ${t.accent}` }} />
      <div className="absolute inset-6" style={{ border: `1px solid ${t.accent}`, opacity: 0.4 }} />
      <div className="relative flex flex-col items-center gap-7 px-8 py-20">
        <Sparkle t={t} size={22} />
        <p className={label} style={{ color: t.accent }}>Tenemos el honor de invitaros</p>
        <h1 className={`text-4xl leading-snug sm:text-5xl ${t.titleClass}`} style={{ fontFamily: t.titleFont }}>
          {name1}
          <span className="my-2 block text-2xl italic normal-case tracking-normal" style={{ color: t.accent }}>y</span>
          {name2}
        </h1>
        <div className="h-px w-16" style={{ background: t.accent }} />
        <p className="text-sm tracking-[0.3em]">{formatDateDots(data.date) || "fecha por confirmar"}</p>
        {data.city && <p className={label} style={{ color: t.muted }}>{data.city}</p>}
      </div>
    </header>
  );
}

function HeroCurva(p: HeroProps) {
  const { t, data, name1, name2 } = p;
  return (
    <header className={`flex flex-col text-center ${full(p)}`}>
      <div className="relative">
        <Photo t={t} src={data.cover} name1={name1} name2={name2} className={`w-full ${p.embedded ? "h-[26rem]" : "h-[62svh]"}`} />
        {/* la foto termina en curva, como una ola */}
        <svg className="absolute bottom-[-1px] left-0 w-full" viewBox="0 0 400 46" preserveAspectRatio="none" height="46" aria-hidden>
          <path d="M0 46V26C70 -6 130 46 200 26S330 -6 400 26V46Z" fill={t.bg} />
        </svg>
        <div
          className="absolute top-5 right-5 flex h-20 w-20 flex-col items-center justify-center rounded-full text-[10px] font-semibold uppercase leading-tight tracking-widest"
          style={{ background: t.accent, color: t.surface }}
        >
          <span>save</span>
          <span>the date</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-10">
        <p className={label} style={{ color: t.accent }}>{data.city || "nos casamos"}</p>
        <h1 className={`text-5xl leading-tight sm:text-6xl ${t.titleClass}`} style={{ fontFamily: t.titleFont }}>
          {name1} <span className="italic" style={{ color: t.accent }}>&</span> {name2}
        </h1>
        <p className="text-lg">{formatDate(data.date) || "Fecha por confirmar"}</p>
      </div>
    </header>
  );
}

function HeroOval(p: HeroProps) {
  const { t, data, name1, name2 } = p;
  return (
    <header className={`flex flex-col items-center justify-center gap-6 px-6 py-16 text-center ${full(p)}`}>
      <p className={label} style={{ color: t.muted }}>{formatDateDots(data.date) || "muy pronto"}</p>
      <h1 className="sr-only">{name1} y {name2}</h1>
      <p className={`text-6xl leading-none sm:text-7xl ${t.titleClass}`} style={{ fontFamily: t.titleFont }} aria-hidden>{name1}</p>
      <div className="relative">
        <div className="rounded-[50%] p-2.5" style={{ border: `1px solid ${t.accent}` }}>
          <div className="h-80 w-60 overflow-hidden rounded-[50%]">
            <Photo t={t} src={data.cover} name1={name1} name2={name2} className="h-full w-full" />
          </div>
        </div>
        <span
          className="absolute -right-5 -bottom-2 flex h-16 w-16 items-center justify-center rounded-full text-3xl italic"
          style={{ background: t.accent, color: t.surface, fontFamily: t.titleFont }}
        >
          &
        </span>
      </div>
      <p className={`text-6xl leading-none sm:text-7xl ${t.titleClass}`} style={{ fontFamily: t.titleFont }} aria-hidden>
        {name2}
      </p>
      {data.city && <p className={label} style={{ color: t.muted }}>{data.city}</p>}
    </header>
  );
}

function HeroCollage(p: HeroProps) {
  const { t, data, name1, name2 } = p;
  const [, m, d] = data.date ? data.date.split("-") : ["", "--", "--"];
  const extra = (i: number, className: string) =>
    data.photos[i] ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={data.photos[i]} alt="" className={`absolute border-[6px] border-white object-cover shadow-lg ${className}`} />
    ) : (
      <div className={`absolute shadow-lg ${className}`} style={{ background: i ? t.accent : t.line }} />
    );
  return (
    <header className={`flex flex-col justify-center gap-8 overflow-hidden px-6 py-14 ${full(p)}`}>
      <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: t.accent, fontFamily: t.labelFont }}>
        ✂ nos casamos — {data.city || "guardad la fecha"}
      </p>
      <div className="relative mx-auto h-[23rem] w-full max-w-sm">
        {extra(0, "top-0 right-0 h-44 w-36 rotate-6")}
        {extra(1, "bottom-0 left-0 h-36 w-32 -rotate-6")}
        <div className="absolute top-8 left-10 -rotate-2 border-[8px] border-white shadow-xl">
          <Photo t={t} src={data.cover} name1={name1} name2={name2} className="h-64 w-52" />
        </div>
        <div
          className="absolute right-2 bottom-4 flex h-24 w-24 rotate-12 flex-col items-center justify-center rounded-full text-center"
          style={{ background: t.accent, color: t.surface }}
        >
          <span className="text-3xl leading-none" style={{ fontFamily: t.titleFont }}>{d}.{m}</span>
          <span className="text-[9px] uppercase tracking-widest" style={{ fontFamily: t.labelFont }}>el día</span>
        </div>
      </div>
      <h1 className={`text-6xl leading-[0.95] sm:text-7xl ${t.titleClass}`} style={{ fontFamily: t.titleFont }}>
        {name1}
        <br />
        <span style={{ color: t.accent }}>&</span> {name2}
      </h1>
    </header>
  );
}

function HeroTicket(p: HeroProps) {
  const { t, data, name1, name2 } = p;
  const mono = { fontFamily: t.labelFont };
  const cell = (k: string, v: string) => (
    <div>
      <div className="text-[9px] uppercase tracking-[0.25em]" style={{ ...mono, color: t.muted }}>{k}</div>
      <div className="mt-1 text-sm font-bold uppercase" style={mono}>{v || "—"}</div>
    </div>
  );
  const notch = "absolute h-7 w-7 rounded-full";
  return (
    <header className={`flex flex-col items-center justify-center gap-6 px-5 py-14 ${full(p)}`}>
      <p className="text-[11px] uppercase tracking-[0.35em]" style={{ ...mono, color: t.accent }}>✈ destino: sí, quiero</p>
      <div className="w-full max-w-sm shadow-xl" style={{ background: t.surface, borderRadius: "1rem" }}>
        <div className="flex items-center justify-between px-5 py-3 text-[10px] uppercase tracking-[0.25em]" style={{ ...mono, background: t.accent, color: t.surface, borderRadius: "1rem 1rem 0 0" }}>
          <span>Tarjeta de embarque</span>
          <span>N.º 001</span>
        </div>
        <Photo t={t} src={data.cover} name1={name1} name2={name2} className="h-56 w-full" />
        <div className="px-5 pt-5 pb-4 text-center">
          <h1 className={`text-5xl leading-none ${t.titleClass}`} style={{ fontFamily: t.titleFont }}>
            {name1} <span className="italic" style={{ color: t.accent }}>&</span> {name2}
          </h1>
        </div>
        {/* línea de corte con las muescas del billete */}
        <div className="relative">
          <div className={`${notch} -left-3.5 -top-3.5`} style={{ background: t.bg }} />
          <div className={`${notch} -right-3.5 -top-3.5`} style={{ background: t.bg }} />
          <div className="mx-6" style={{ borderTop: `2px dashed ${t.line}` }} />
        </div>
        <div className="grid grid-cols-3 gap-3 px-5 py-5 text-left">
          {cell("Fecha", formatDateDots(data.date).replace(/ · /g, "."))}
          {cell("Hora", data.ceremony.time)}
          {cell("Destino", data.city)}
        </div>
        <div className="mx-5 mb-5 h-10" style={{ background: `repeating-linear-gradient(90deg, ${t.text} 0 2px, transparent 2px 5px, ${t.text} 5px 6px, transparent 6px 10px)`, opacity: 0.85 }} aria-hidden />
      </div>
    </header>
  );
}

function HeroPop(p: HeroProps) {
  const { t, data, name1, name2 } = p;
  return (
    <header className={`@container flex flex-col justify-center gap-6 overflow-hidden px-5 py-12 ${full(p)}`}>
      <div className="flex items-center justify-between text-xs font-bold uppercase">
        <span className="rounded-full px-3 py-1" style={{ background: t.text, color: t.bg }}>¡nos casamos!</span>
        <span>{formatDateDots(data.date).replace(/ · /g, "/") || "muy pronto"}</span>
      </div>
      <h1
        className={`leading-[0.84] ${t.titleClass}`}
        style={{ fontFamily: t.titleFont, fontSize: fit(Math.max(name1.length, name2.length + 1), 1.0, 24) }}
      >
        {name1}
        <br />
        <span style={{ color: t.accent }}>&</span>
        {name2}
      </h1>
      <div className="relative">
        <Photo t={t} src={data.cover} name1={name1} name2={name2} className="aspect-[4/5] w-full rounded-[2.5rem]" />
        {/* pegatina giratoria */}
        <div className="absolute -top-8 -right-2 h-28 w-28 rounded-full" style={{ background: t.accent }}>
          <svg viewBox="0 0 100 100" className="spin-slow h-full w-full" aria-hidden>
            <defs>
              <path id="pop-circle" d="M50 50m-36 0a36 36 0 1 1 72 0a36 36 0 1 1 -72 0" />
            </defs>
            <text fontSize="11" fontWeight="700" letterSpacing="2.6" fill={t.surface} style={{ fontFamily: t.bodyFont }}>
              <textPath href="#pop-circle">SÍ, QUIERO ✦ SÍ, QUIERO ✦ SÍ, QUIERO ✦</textPath>
            </text>
          </svg>
        </div>
        {data.city && (
          <span className="absolute bottom-4 left-4 rounded-full px-4 py-2 text-sm font-bold uppercase" style={{ background: t.bg, color: t.text }}>
            📍 {data.city}
          </span>
        )}
      </div>
    </header>
  );
}

export const HEROES = {
  arco: HeroArco,
  polaroid: HeroPolaroid,
  boho: HeroBoho,
  revista: HeroRevista,
  gala: HeroGala,
  curva: HeroCurva,
  oval: HeroOval,
  collage: HeroCollage,
  ticket: HeroTicket,
  pop: HeroPop,
};
