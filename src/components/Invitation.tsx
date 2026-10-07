"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BRAND,
  formatDate,
  formatDateDots,
  getTemplate,
  mapsLink,
  type EventBlock,
  type InvitationData,
  type SectionId,
  type Template,
} from "@/lib/templates";

type Props = {
  template: string;
  data: InvitationData;
  // "live": invitación publicada, acepta confirmaciones. "demo"/"preview": el formulario no envía nada.
  mode: "live" | "demo" | "preview";
  slug?: string;
  embedded?: boolean;
};

function Sparkle({ t, size = 18 }: { t: Template; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={t.accent} aria-hidden>
      <path d="M12 0c.6 6.5 5.5 11.400 12 12c-6.500.6-11.400 5.500-12 12c-.6-6.500-5.500-11.400-12-12c6.500-.6 11.400-5.500 12-12Z" />
    </svg>
  );
}

function Countdown({ date, t }: { date: string; t: Template }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  if (!date || now === null) return <div className="h-20" />;
  const diff = new Date(date + "T12:00:00").getTime() - now;
  if (diff <= 0) {
    return <p style={{ fontFamily: t.titleFont }} className="text-2xl italic">¡Hoy es el gran día!</p>;
  }
  const s = Math.floor(diff / 1000);
  const parts: [number, string][] = [
    [Math.floor(s / 86400), "días"],
    [Math.floor((s % 86400) / 3600), "horas"],
    [Math.floor((s % 3600) / 60), "min"],
    [s % 60, "seg"],
  ];
  return (
    <div className={`flex gap-3 ${t.align === "left" ? "" : "justify-center"}`}>
      {parts.map(([n, label]) => (
        <div
          key={label}
          className={`flex w-16 flex-col items-center justify-center ${t.hero === "boho" ? "h-16" : "py-3"}`}
          style={{
            background: t.hero === "revista" ? "transparent" : t.surface,
            border: `1px solid ${t.line}`,
            borderRadius: t.hero === "boho" ? "999px" : t.radius,
          }}
        >
          <div className="text-2xl tabular-nums" style={{ fontFamily: t.titleFont }}>
            {n}
          </div>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: t.muted }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

function Section({ title, t, children }: { title: string; t: Template; children: React.ReactNode }) {
  const left = t.align === "left";
  return (
    <section
      className={`px-6 py-14 ${left ? "text-left" : "text-center"}`}
      style={{ borderTop: `1px solid ${t.line}` }}
    >
      {!left && (
        <div className="mb-3 flex justify-center">
          <Sparkle t={t} size={14} />
        </div>
      )}
      <h2
        className={`mb-7 ${left ? "text-5xl" : "text-4xl"} ${t.titleClass}`}
        style={{ fontFamily: t.titleFont }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function EventCard({ label, b, t }: { label: string; b: EventBlock; t: Template }) {
  const link = mapsLink(b);
  if (!b.place && !b.time) return null;
  return (
    <div
      className="flex-1 p-6"
      style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: t.radius }}
    >
      <div className="text-xs uppercase tracking-[0.2em]" style={{ color: t.accent }}>
        {label}
      </div>
      {b.time && (
        <div className="mt-2 text-3xl" style={{ fontFamily: t.titleFont }}>
          {b.time}
        </div>
      )}
      {b.place && <div className="mt-2 font-semibold">{b.place}</div>}
      {b.address && (
        <div className="mt-1 text-sm" style={{ color: t.muted }}>
          {b.address}
        </div>
      )}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block px-4 py-2 text-sm font-semibold"
          style={{ border: `1px solid ${t.accent}`, color: t.accent, borderRadius: t.pill }}
        >
          Cómo llegar
        </a>
      )}
    </div>
  );
}

function Note({ t, title, text }: { t: Template; title: string; text: string }) {
  return (
    <p className={`mt-6 max-w-md text-sm leading-relaxed ${t.align === "left" ? "" : "mx-auto"}`} style={{ color: t.muted }}>
      <span className="font-semibold" style={{ color: t.text }}>{title}:</span> {text}
    </p>
  );
}

function RsvpForm({ t, data, mode, slug }: { t: Template; data: InvitationData; mode: Props["mode"]; slug?: string }) {
  const [attending, setAttending] = useState(true);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (mode !== "live" || !slug) {
      setState("done");
      return;
    }
    const f = new FormData(e.currentTarget);
    setState("sending");
    const res = await fetch(`/api/i/${slug}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: f.get("name"),
        attending,
        guests: Number(f.get("guests") ?? 1),
        allergies: f.get("allergies") ?? "",
        message: f.get("message") ?? "",
        web: f.get("web") ?? "",
      }),
    }).catch(() => null);
    if (res?.ok) {
      setState("done");
    } else {
      const body = await res?.json().catch(() => null);
      setError(body?.error ?? "No se pudo enviar. Inténtalo de nuevo.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="text-lg" style={{ fontFamily: t.titleFont }}>
        {mode === "live" ? "¡Gracias! Hemos recibido tu respuesta." : "Así verán tus invitados la confirmación enviada."}
      </p>
    );
  }

  const input = {
    background: t.surface,
    border: `1px solid ${t.line}`,
    color: t.text,
    borderRadius: t.radius,
  };
  const pill = (active: boolean) => ({
    border: `1px solid ${active ? t.accent : t.line}`,
    background: active ? t.accent : "transparent",
    color: active ? t.bg : t.text,
    borderRadius: t.pill,
  });

  return (
    <form onSubmit={submit} className={`max-w-sm space-y-3 text-left ${t.align === "left" ? "" : "mx-auto"}`}>
      <input
        name="name"
        required
        maxLength={80}
        placeholder="Nombre y apellidos"
        className="w-full px-4 py-3"
        style={input}
      />
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setAttending(true)} className="py-3 font-semibold" style={pill(attending)}>
          Asistiré
        </button>
        <button type="button" onClick={() => setAttending(false)} className="py-3 font-semibold" style={pill(!attending)}>
          No podré ir
        </button>
      </div>
      {attending && (
        <>
          <label className="block text-sm" style={{ color: t.muted }}>
            ¿Cuántos sois en total?
            <select name="guests" defaultValue="1" className="mt-1 w-full px-4 py-3" style={input}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          {data.askAllergies && (
            <input
              name="allergies"
              maxLength={200}
              placeholder="Alergias o intolerancias (opcional)"
              className="w-full px-4 py-3"
              style={input}
            />
          )}
        </>
      )}
      <textarea
        name="message"
        maxLength={400}
        rows={3}
        placeholder="Mensaje para los novios (opcional)"
        className="w-full px-4 py-3"
        style={input}
      />
      {/* Campo trampa para bots: las personas no lo ven */}
      <input name="web" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {state === "error" && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={state === "sending"}
        className="w-full py-3 font-semibold"
        style={{ background: t.accent, color: t.bg, borderRadius: t.pill }}
      >
        {state === "sending" ? "Enviando…" : "Enviar confirmación"}
      </button>
    </form>
  );
}

type HeroProps = { t: Template; data: InvitationData; name1: string; name2: string; embedded?: boolean };

function Photo({ t, data, name1, name2, className }: HeroProps & { className: string }) {
  if (data.cover) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={data.cover} alt="" className={`object-cover ${className}`} />;
  }
  return (
    <div
      className={`flex items-center justify-center text-5xl ${className}`}
      style={{
        fontFamily: t.titleFont,
        color: t.accent,
        background: `linear-gradient(160deg, ${t.surface}, ${t.line})`,
      }}
    >
      {name1[0]}
      <span className="mx-1 text-2xl">&</span>
      {name2[0]}
    </div>
  );
}

const label = "text-[11px] uppercase tracking-[0.4em]";

function HeroArco(p: HeroProps) {
  const { t, data, name1, name2 } = p;
  return (
    <header className={`flex flex-col items-center justify-center gap-7 px-6 py-16 text-center ${p.embedded ? "" : "min-h-svh"}`}>
      <p className={label} style={{ color: t.muted }}>nos casamos</p>
      <div className="h-80 w-60 overflow-hidden rounded-t-full" style={{ border: `1px solid ${t.line}` }}>
        <Photo {...p} className="h-full w-full" />
      </div>
      <h1 className={`text-5xl leading-[1.05] sm:text-6xl ${t.titleClass}`} style={{ fontFamily: t.titleFont }}>
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
    <header className={`flex flex-col items-center justify-center gap-8 px-6 py-16 text-center ${p.embedded ? "" : "min-h-svh"}`}>
      <p className="text-3xl" style={{ fontFamily: t.titleFont, color: t.accent }}>¡nos casamos!</p>
      <div className="relative -rotate-3 bg-white p-3 pb-4 shadow-xl">
        {/* trozo de celo */}
        <div className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-2" style={{ background: t.accent, opacity: 0.35 }} />
        <Photo {...p} className="h-64 w-56" />
        <p className="mt-3 text-2xl text-neutral-700" style={{ fontFamily: t.titleFont }}>
          {formatDateDots(data.date) || "muy pronto"}
        </p>
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
    <header className={`relative flex flex-col items-center justify-center gap-8 overflow-hidden px-6 py-16 text-center ${p.embedded ? "" : "min-h-svh"}`}>
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full" style={{ background: t.accent, opacity: 0.14 }} />
      <div className="absolute -right-20 bottom-10 h-52 w-52 rounded-full" style={{ background: t.accent, opacity: 0.1 }} />
      <div className="relative">
        <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-full" style={{ border: `1.5px solid ${t.accent}` }} />
        <div className="relative h-64 w-64 overflow-hidden rounded-full">
          <Photo {...p} className="h-full w-full" />
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
    <header className={`flex flex-col px-6 py-8 ${p.embedded ? "" : "min-h-svh"}`}>
      <div className="flex justify-between pb-3 text-[10px] uppercase tracking-[0.3em]" style={{ borderBottom: `1px solid ${t.text}` }}>
        <span>La boda</span>
        <span>{data.city || "Edición única"}</span>
      </div>
      <h1 className={`py-6 text-[4.2rem] leading-[0.9] sm:text-8xl ${t.titleClass}`} style={{ fontFamily: t.titleFont }}>
        {name1}
        <br />
        <span className="italic normal-case">&</span> {name2}
      </h1>
      <Photo {...p} className="aspect-[4/5] w-full grayscale" />
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
    <header className={`relative flex items-center justify-center p-4 text-center ${p.embedded ? "min-h-[600px]" : "min-h-svh"}`}>
      {data.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0" style={{ background: t.bg, opacity: data.cover ? 0.7 : 1 }} />
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

const HEROES = { arco: HeroArco, polaroid: HeroPolaroid, boho: HeroBoho, revista: HeroRevista, gala: HeroGala };

function Gallery({ t, photos }: { t: Template; photos: string[] }) {
  if (t.hero === "polaroid") {
    return (
      <div className="grid grid-cols-2 gap-5">
        {photos.map((src, i) => (
          <div key={src} className={`bg-white p-2 pb-8 shadow-lg ${i % 2 ? "rotate-2" : "-rotate-2"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="aspect-square w-full object-cover" />
          </div>
        ))}
      </div>
    );
  }
  const shape = (i: number) => {
    switch (t.hero) {
      case "arco":
        return `aspect-[3/4] ${i % 2 ? "rounded-2xl" : "rounded-t-full"}`;
      case "boho":
        return `aspect-square ${i % 2 ? "rounded-[2rem]" : "rounded-full"}`;
      case "revista":
        return "aspect-[4/5] grayscale";
      default:
        return "aspect-square";
    }
  };
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 ${t.hero === "revista" ? "gap-px" : "gap-3"}`}>
      {photos.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className={`w-full object-cover ${shape(i)}`}
          style={t.hero === "gala" ? { border: `1px solid ${t.accent}`, padding: 4 } : undefined}
        />
      ))}
    </div>
  );
}

export default function Invitation({ template, data, mode, slug, embedded }: Props) {
  const t = getTemplate(template);
  const name1 = data.name1 || "Nombre";
  const name2 = data.name2 || "Nombre";
  const hasEvents = data.ceremony.place || data.ceremony.time || data.party.place || data.party.time;
  const Hero = HEROES[t.hero];
  const left = t.align === "left";
  const on = (id: SectionId) => !data.off.includes(id);

  return (
    <div style={{ background: t.bg, color: t.text, fontFamily: t.bodyFont }} className={embedded ? "" : "min-h-svh"}>
      <div className="mx-auto max-w-2xl">
        <Hero t={t} data={data} name1={name1} name2={name2} embedded={embedded} />

        {(on("countdown") || data.message) && (
          <section className={`px-6 py-14 ${left ? "text-left" : "text-center"}`} style={{ borderTop: `1px solid ${t.line}` }}>
            {on("countdown") && (
              <>
                <p className={`mb-5 ${label}`} style={{ color: t.muted }}>Faltan</p>
                <Countdown date={data.date} t={t} />
              </>
            )}
            {data.message && (
              <p
                className={`max-w-md whitespace-pre-line leading-relaxed ${on("countdown") ? "mt-10" : ""} ${left ? "text-lg" : "mx-auto text-2xl"}`}
                style={left ? undefined : { fontFamily: t.titleFont }}
              >
                {data.message}
              </p>
            )}
          </section>
        )}

        {on("story") && data.story && (
          <Section title="Nuestra historia" t={t}>
            <p className={`max-w-md whitespace-pre-line leading-relaxed ${left ? "" : "mx-auto"}`}>{data.story}</p>
          </Section>
        )}

        {on("events") && hasEvents && (
          <Section title="El día" t={t}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <EventCard label="Ceremonia" b={data.ceremony} t={t} />
              <EventCard label="Celebración" b={data.party} t={t} />
            </div>
            {data.gettingThere && <Note t={t} title="Cómo llegar" text={data.gettingThere} />}
            {data.dressCode && <Note t={t} title="Vestimenta" text={data.dressCode} />}
          </Section>
        )}

        {on("timeline") && data.timeline.length > 0 && (
          <Section title="Cronograma" t={t}>
            <ol className={`max-w-xs ${left ? "" : "mx-auto"}`}>
              {data.timeline.map((item, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-5 py-3 text-left"
                  style={{ borderTop: i ? `1px solid ${t.line}` : undefined }}
                >
                  <span className="w-16 text-2xl tabular-nums" style={{ fontFamily: t.titleFont, color: t.accent }}>
                    {item.time}
                  </span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {on("travel") && (data.lodging || data.transport) && (
          <Section title="Alojamiento y transporte" t={t}>
            {data.lodging && <Note t={t} title="Dónde dormir" text={data.lodging} />}
            {data.transport && <Note t={t} title="Autobuses" text={data.transport} />}
          </Section>
        )}

        {on("gallery") && data.photos.length > 0 && (
          <Section title="Nosotros" t={t}>
            <Gallery t={t} photos={data.photos} />
          </Section>
        )}

        {on("gifts") && (data.giftsText || data.iban || data.giftsUrl) && (
          <Section title="Regalo" t={t}>
            {data.giftsText && <p className={`max-w-md leading-relaxed ${left ? "" : "mx-auto"}`}>{data.giftsText}</p>}
            {data.iban && (
              <p
                className="mt-4 inline-block px-4 py-3 font-mono text-sm"
                style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: t.radius }}
              >
                {data.iban}
              </p>
            )}
            {data.giftsUrl && (
              <p className="mt-4">
                <a
                  href={data.giftsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-2 text-sm font-semibold"
                  style={{ border: `1px solid ${t.accent}`, color: t.accent, borderRadius: t.pill }}
                >
                  Ver lista de regalos
                </a>
              </p>
            )}
          </Section>
        )}

        {on("faq") && data.faq.length > 0 && (
          <Section title="Preguntas frecuentes" t={t}>
            <div className={`max-w-md space-y-2 text-left ${left ? "" : "mx-auto"}`}>
              {data.faq.map((f, i) => (
                <details
                  key={i}
                  className="px-4 py-3"
                  style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: t.radius }}
                >
                  <summary className="cursor-pointer font-semibold">{f.q}</summary>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: t.muted }}>{f.a}</p>
                </details>
              ))}
            </div>
          </Section>
        )}

        {on("rsvp") && (
          <Section title="¿Vienes?" t={t}>
            {data.rsvpDeadline && (
              <p className="mb-6 text-sm" style={{ color: t.muted }}>
                Por favor, responde antes del {formatDate(data.rsvpDeadline).replace(/^\S+\s/, "")}.
              </p>
            )}
            <RsvpForm t={t} data={data} mode={mode} slug={slug} />
          </Section>
        )}

        {on("album") && (
          <Section title="Comparte tus fotos" t={t}>
            <p className={`max-w-md leading-relaxed ${left ? "" : "mx-auto"}`}>
              ¿Has hecho fotos en la boda? Súbelas aquí y nos llegarán directamente.
            </p>
            <p className="mt-5">
              <a
                href={mode === "live" && slug ? `/i/${slug}/fotos` : undefined}
                className="inline-block px-5 py-2 text-sm font-semibold"
                style={{ border: `1px solid ${t.accent}`, color: t.accent, borderRadius: t.pill }}
              >
                Subir fotos
              </a>
            </p>
          </Section>
        )}

        <footer className="px-6 py-8 text-center text-xs" style={{ color: t.muted, borderTop: `1px solid ${t.line}` }}>
          {name1} & {name2} · Hecha con{" "}
          <Link href="/" className="underline">{BRAND}</Link>
        </footer>
      </div>
    </div>
  );
}
