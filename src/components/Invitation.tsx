"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HEROES, Sparkle } from "./invitation/Heroes";
import {
  BRAND,
  formatDate,
  getTemplate,
  mapsLink,
  type EventBlock,
  type InvitationData,
  type SectionId,
  type Template,
} from "@/lib/templates";

type Mode = "live" | "demo" | "preview";

type Props = {
  template: string;
  data: InvitationData;
  // "live": invitación publicada, acepta confirmaciones. "demo"/"preview": el formulario no envía nada.
  mode: Mode;
  slug?: string;
  embedded?: boolean;
};

const label = "text-[11px] uppercase tracking-[0.4em]";

// Hace aparecer el contenido al entrar en pantalla. En miniaturas y vista previa se muestra directamente.
function Reveal({ children, off }: { children: React.ReactNode; off?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || off) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [off]);
  return (
    <div ref={ref} className={off ? "" : "reveal"}>
      {children}
    </div>
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
    return <p style={{ fontFamily: t.titleFont }} className="text-3xl">¡Hoy es el gran día!</p>;
  }
  const s = Math.floor(diff / 1000);
  const parts: [number, string][] = [
    [Math.floor(s / 86400), "días"],
    [Math.floor((s % 86400) / 3600), "horas"],
    [Math.floor((s % 3600) / 60), "min"],
    [s % 60, "seg"],
  ];
  const justify = t.align === "left" ? "" : "justify-center";

  if (t.count === "lineas") {
    return (
      <div className={`flex ${justify}`}>
        {parts.map(([n, unit], i) => (
          <div key={unit} className="px-4 text-center" style={{ borderLeft: i ? `1px solid ${t.line}` : undefined }}>
            <div className="text-4xl tabular-nums" style={{ fontFamily: t.titleFont }}>{n}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.25em]" style={{ color: t.muted, fontFamily: t.labelFont }}>{unit}</div>
          </div>
        ))}
      </div>
    );
  }
  const circle = t.count === "circulos";
  return (
    <div className={`flex gap-3 ${justify}`}>
      {parts.map(([n, unit], i) => (
        <div
          key={unit}
          className={`flex w-[4.5rem] flex-col items-center justify-center ${circle ? "h-[4.5rem]" : "py-4"}`}
          style={{
            background: circle && i === 0 ? t.accent : t.surface,
            color: circle && i === 0 ? t.surface : t.text,
            border: `1px solid ${t.line}`,
            borderRadius: circle ? "999px" : t.radius,
          }}
        >
          <div className="text-2xl leading-none tabular-nums" style={{ fontFamily: t.titleFont }}>{n}</div>
          <div className="mt-1 text-[10px] uppercase tracking-wider opacity-70">{unit}</div>
        </div>
      ))}
    </div>
  );
}

function Section({
  title,
  eyebrow,
  t,
  off,
  children,
}: {
  title: string;
  eyebrow: string;
  t: Template;
  off?: boolean;
  children: React.ReactNode;
}) {
  const left = t.align === "left";
  return (
    <section className={`px-6 py-16 ${left ? "text-left" : "text-center"}`} style={{ borderTop: `1px solid ${t.line}` }}>
      <Reveal off={off}>
        <div className={`mb-3 flex items-center gap-3 ${left ? "" : "justify-center"}`}>
          {!left && <Sparkle t={t} size={10} />}
          <p className={label} style={{ color: t.accent, fontFamily: t.labelFont }}>{eyebrow}</p>
          {!left && <Sparkle t={t} size={10} />}
        </div>
        <h2 className={`mb-8 ${left ? "text-5xl" : "text-[2.6rem]"} leading-[1.05] ${t.titleClass}`} style={{ fontFamily: t.titleFont }}>
          {title}
        </h2>
        {children}
      </Reveal>
    </section>
  );
}

function EventCard({ name, b, t }: { name: string; b: EventBlock; t: Template }) {
  const link = mapsLink(b);
  if (!b.place && !b.time) return null;
  // el radio "píldora" de algunas plantillas no sirve para una tarjeta
  const radius = t.radius === "999px" ? "1.5rem" : t.radius;
  return (
    <div className="flex-1 p-7" style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: radius }}>
      <div className="text-[10px] uppercase tracking-[0.3em]" style={{ color: t.accent, fontFamily: t.labelFont }}>{name}</div>
      {b.time && <div className="mt-3 text-5xl leading-none" style={{ fontFamily: t.titleFont }}>{b.time}</div>}
      <div className={`my-4 h-px w-8 ${t.align === "left" ? "" : "mx-auto"}`} style={{ background: t.accent }} />
      {b.place && <div className="font-semibold">{b.place}</div>}
      {b.address && <div className="mt-1 text-sm" style={{ color: t.muted }}>{b.address}</div>}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block px-5 py-2 text-sm font-semibold"
          style={{ border: `1px solid ${t.accent}`, color: t.accent, borderRadius: t.pill }}
        >
          Cómo llegar →
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

function Gallery({ t, photos }: { t: Template; photos: string[] }) {
  const img = (src: string, className: string, style?: React.CSSProperties) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img key={src} src={src} alt="" loading="lazy" className={`w-full object-cover ${className}`} style={style} />
  );
  switch (t.hero) {
    case "polaroid":
    case "collage":
      return (
        <div className="grid grid-cols-2 gap-5 px-1">
          {photos.map((src, i) => (
            <div key={src} className={`bg-white p-2 shadow-lg ${t.hero === "polaroid" ? "pb-8" : ""} ${i % 2 ? "rotate-2" : "-rotate-2"}`}>
              {img(src, "aspect-square")}
            </div>
          ))}
        </div>
      );
    case "revista":
      return <div className="grid grid-cols-2 gap-px sm:grid-cols-3">{photos.map((src) => img(src, "aspect-[4/5] grayscale"))}</div>;
    case "gala":
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((src) => img(src, "aspect-square", { border: `1px solid ${t.accent}`, padding: 4 }))}
        </div>
      );
    case "boho":
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((src, i) => img(src, `aspect-square ${i % 2 ? "rounded-[2rem]" : "rounded-full"}`))}
        </div>
      );
    case "oval":
      return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{photos.map((src) => img(src, "aspect-[3/4] rounded-[50%]"))}</div>;
    case "curva":
    case "pop":
      // la primera foto ocupa todo el ancho
      return (
        <div className="grid grid-cols-2 gap-3">
          {photos.map((src, i) => (
            <div key={src} className={i === 0 ? "col-span-2" : ""}>
              {img(src, `${i === 0 ? "aspect-[16/10]" : "aspect-square"} ${t.hero === "pop" ? "rounded-[2rem]" : "rounded-2xl"}`)}
            </div>
          ))}
        </div>
      );
    case "ticket":
      return <div className="grid grid-cols-3 gap-2">{photos.map((src) => img(src, "aspect-square rounded-md"))}</div>;
    default:
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((src, i) => img(src, `aspect-[3/4] ${i % 2 ? "rounded-2xl" : "rounded-t-full"}`))}
        </div>
      );
  }
}

function RsvpForm({ t, data, mode, slug }: { t: Template; data: InvitationData; mode: Mode; slug?: string }) {
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
      <p className="text-2xl" style={{ fontFamily: t.titleFont }}>
        {mode === "live" ? "¡Gracias! Hemos recibido tu respuesta." : "Así verán tus invitados la confirmación enviada."}
      </p>
    );
  }

  const fieldRadius = t.radius === "999px" ? "1.5rem" : t.radius;
  const input = { background: t.surface, border: `1px solid ${t.line}`, color: t.text, borderRadius: fieldRadius };
  const pill = (active: boolean) => ({
    border: `1px solid ${active ? t.accent : t.line}`,
    background: active ? t.accent : "transparent",
    color: active ? t.surface : t.text,
    borderRadius: t.pill,
  });

  return (
    <form onSubmit={submit} className={`max-w-sm space-y-3 text-left ${t.align === "left" ? "" : "mx-auto"}`}>
      <input name="name" required maxLength={80} placeholder="Nombre y apellidos" className="w-full px-4 py-3" style={input} />
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
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          {data.askAllergies && (
            <input name="allergies" maxLength={200} placeholder="Alergias o intolerancias (opcional)" className="w-full px-4 py-3" style={input} />
          )}
        </>
      )}
      <textarea name="message" maxLength={400} rows={3} placeholder="Mensaje para los novios (opcional)" className="w-full px-4 py-3" style={input} />
      {/* Campo trampa para bots: las personas no lo ven */}
      <input name="web" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {state === "error" && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={state === "sending"}
        className="w-full py-3.5 font-semibold"
        style={{ background: t.accent, color: t.surface, borderRadius: t.pill }}
      >
        {state === "sending" ? "Enviando…" : "Enviar confirmación"}
      </button>
    </form>
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
  const block = left ? "" : "mx-auto";
  const cardRadius = t.radius === "999px" ? "1.5rem" : t.radius;
  const plainMessage = t.hero === "pop" || t.hero === "revista";

  return (
    <div
      style={{ background: t.bg, color: t.text, fontFamily: t.bodyFont }}
      className={`${embedded ? "" : "min-h-svh"} ${t.grain ? "grain" : ""}`}
    >
      <div className="mx-auto max-w-2xl">
        <Hero t={t} data={data} name1={name1} name2={name2} embedded={embedded} />

        {(on("countdown") || data.message) && (
          <section className={`px-6 py-16 ${left ? "text-left" : "text-center"}`} style={{ borderTop: `1px solid ${t.line}` }}>
            <Reveal off={embedded}>
              {on("countdown") && (
                <>
                  <p className={`mb-6 ${label}`} style={{ color: t.muted, fontFamily: t.labelFont }}>Faltan</p>
                  <Countdown date={data.date} t={t} />
                </>
              )}
              {data.message && (
                <p
                  className={`max-w-md whitespace-pre-line ${on("countdown") ? "mt-12" : ""} ${block} ${
                    plainMessage ? "text-xl leading-relaxed" : "text-[1.7rem] leading-snug"
                  }`}
                  style={plainMessage ? undefined : { fontFamily: t.titleFont }}
                >
                  {data.message}
                </p>
              )}
            </Reveal>
          </section>
        )}

        {on("story") && (data.story || data.milestones.length > 0) && (
          <Section eyebrow="Cómo empezó todo" title="Nuestra historia" t={t} off={embedded}>
            {data.story && <p className={`max-w-md whitespace-pre-line leading-relaxed ${block}`}>{data.story}</p>}
            {data.milestones.length > 0 && (
              <ol className={`mt-10 max-w-sm text-left ${block}`} style={{ borderLeft: `1px solid ${t.accent}` }}>
                {data.milestones.map((m, i) => (
                  <li key={i} className="relative pb-8 pl-7 last:pb-0">
                    <span className="absolute top-2 -left-[5px] h-[9px] w-[9px] rounded-full" style={{ background: t.accent }} />
                    <div className="text-4xl leading-none" style={{ fontFamily: t.titleFont, color: t.accent }}>{m.year}</div>
                    <p className="mt-2 leading-relaxed">{m.text}</p>
                  </li>
                ))}
              </ol>
            )}
          </Section>
        )}

        {on("events") && hasEvents && (
          <Section eyebrow="Dónde y cuándo" title="El día" t={t} off={embedded}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <EventCard name="Ceremonia" b={data.ceremony} t={t} />
              <EventCard name="Celebración" b={data.party} t={t} />
            </div>
            {data.gettingThere && <Note t={t} title="Cómo llegar" text={data.gettingThere} />}
            {data.dressCode && <Note t={t} title="Vestimenta" text={data.dressCode} />}
          </Section>
        )}

        {on("timeline") && data.timeline.length > 0 && (
          <Section eyebrow="Minuto a minuto" title="Cronograma" t={t} off={embedded}>
            <ol className={`max-w-xs ${block}`}>
              {data.timeline.map((item, i) => (
                <li key={i} className="flex items-baseline gap-5 py-4 text-left" style={{ borderTop: i ? `1px solid ${t.line}` : undefined }}>
                  <span className="w-20 text-3xl leading-none tabular-nums" style={{ fontFamily: t.titleFont, color: t.accent }}>
                    {item.time}
                  </span>
                  <span className="text-lg">{item.label}</span>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {on("travel") && (data.lodging || data.transport) && (
          <Section eyebrow="Para los que venís de fuera" title="Alojamiento y transporte" t={t} off={embedded}>
            <div className="grid gap-4 text-left sm:grid-cols-2">
              {[
                ["Dónde dormir", data.lodging],
                ["Autobuses", data.transport],
              ]
                .filter(([, text]) => text)
                .map(([title, text]) => (
                  <div key={title} className="p-6" style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: cardRadius }}>
                    <div className="text-2xl" style={{ fontFamily: t.titleFont }}>{title}</div>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: t.muted }}>{text}</p>
                  </div>
                ))}
            </div>
          </Section>
        )}

        {on("gallery") && data.photos.length > 0 && (
          <Section eyebrow="Álbum" title="Nosotros" t={t} off={embedded}>
            <Gallery t={t} photos={data.photos} />
          </Section>
        )}

        {on("gifts") && (data.giftsText || data.iban || data.giftsUrl) && (
          <Section eyebrow="Si queréis tener un detalle" title="Regalo" t={t} off={embedded}>
            {data.giftsText && <p className={`max-w-md leading-relaxed ${block}`}>{data.giftsText}</p>}
            {data.iban && (
              <p
                className="mt-5 inline-block px-5 py-3 font-mono text-sm"
                style={{ background: t.surface, border: `1px dashed ${t.accent}`, borderRadius: cardRadius }}
              >
                {data.iban}
              </p>
            )}
            {data.giftsUrl && (
              <p className="mt-5">
                <a
                  href={data.giftsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-2 text-sm font-semibold"
                  style={{ border: `1px solid ${t.accent}`, color: t.accent, borderRadius: t.pill }}
                >
                  Ver lista de regalos →
                </a>
              </p>
            )}
          </Section>
        )}

        {on("faq") && data.faq.length > 0 && (
          <Section eyebrow="Por si os lo preguntáis" title="Preguntas frecuentes" t={t} off={embedded}>
            <div className={`max-w-md text-left ${block}`}>
              {data.faq.map((f, i) => (
                <details key={i} className="py-4" style={{ borderTop: `1px solid ${t.line}` }}>
                  <summary className="cursor-pointer text-lg font-medium">{f.q}</summary>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: t.muted }}>{f.a}</p>
                </details>
              ))}
            </div>
          </Section>
        )}

        {on("rsvp") && (
          <Section eyebrow="Confirma tu asistencia" title="¿Vienes?" t={t} off={embedded}>
            {data.rsvpDeadline && (
              <p className="mb-6 text-sm" style={{ color: t.muted }}>
                Por favor, responde antes del {formatDate(data.rsvpDeadline).replace(/^\S+\s/, "")}.
              </p>
            )}
            <RsvpForm t={t} data={data} mode={mode} slug={slug} />
          </Section>
        )}

        {on("album") && (
          <Section eyebrow="Después de la boda" title="Comparte tus fotos" t={t} off={embedded}>
            <p className={`max-w-md leading-relaxed ${block}`}>
              ¿Has hecho fotos en la boda? Súbelas aquí y nos llegarán directamente.
            </p>
            <p className="mt-5">
              <a
                href={mode === "live" && slug ? `/i/${slug}/fotos` : undefined}
                className="inline-block px-5 py-2 text-sm font-semibold"
                style={{ border: `1px solid ${t.accent}`, color: t.accent, borderRadius: t.pill }}
              >
                Subir fotos →
              </a>
            </p>
          </Section>
        )}

        <footer className="px-6 py-12 text-center" style={{ borderTop: `1px solid ${t.line}` }}>
          <p className={`text-4xl ${t.titleClass}`} style={{ fontFamily: t.titleFont }}>
            {name1} <span style={{ color: t.accent }}>&</span> {name2}
          </p>
          <p className="mt-4 text-xs" style={{ color: t.muted }}>
            Hecha con{" "}
            <Link href="/" className="underline">{BRAND}</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
