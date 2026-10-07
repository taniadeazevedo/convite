"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Invitation from "./Invitation";
import type { Invitation as Inv, Rsvp } from "@/lib/db";
import {
  BRAND,
  GUEST_PHOTO_LIMIT,
  MAX_PHOTOS,
  PRICE_LABEL,
  SECTIONS,
  TEMPLATES,
  type EventBlock,
  type InvitationData,
  type SectionId,
  type TemplateId,
} from "@/lib/templates";

type Props = { initial: Inv; rsvps: Rsvp[]; guestPhotos: string[]; demoPayments: boolean; origin: string };

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-soft">{hint}</span>}
    </label>
  );
}

function Group({
  title,
  section,
  data,
  toggle,
  children,
}: {
  title: string;
  section?: SectionId;
  data: InvitationData;
  toggle: (id: SectionId) => void;
  children?: React.ReactNode;
}) {
  const hidden = section ? data.off.includes(section) : false;
  return (
    <section className="rounded-2xl border border-rule bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl">{title}</h2>
        {section && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-soft">
            <input type="checkbox" checked={!hidden} onChange={() => toggle(section)} className="h-4 w-4 accent-[var(--brand)]" />
            {hidden ? "Oculta" : "Visible"}
          </label>
        )}
      </div>
      {!hidden && children && <div className="mt-4 space-y-3">{children}</div>}
    </section>
  );
}

export default function Editor({ initial, rsvps, guestPhotos, demoPayments, origin }: Props) {
  const [template, setTemplate] = useState<TemplateId>(initial.template);
  const [data, setData] = useState<InvitationData>(initial.data);
  const [tab, setTab] = useState<"editar" | "confirmaciones" | "album">("editar");
  const [album, setAlbum] = useState(guestPhotos);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">("saved");
  const [uploading, setUploading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [accepted, setAccepted] = useState(false);
  // En pantallas pequeñas se alterna entre el formulario y la vista previa
  const [mobilePreview, setMobilePreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const first = useRef(true);
  const api = `/api/panel/${initial.token}`;

  // Guardado automático un momento después del último cambio
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setSaveState("saving");
    const id = setTimeout(async () => {
      const res = await fetch(api, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, data }),
      }).catch(() => null);
      setSaveState(res?.ok ? "saved" : "error");
    }, 700);
    return () => clearTimeout(id);
  }, [template, data, api]);

  const set = <K extends keyof InvitationData>(key: K, value: InvitationData[K]) =>
    setData((d) => ({ ...d, [key]: value }));
  const setBlock = (key: "ceremony" | "party", patch: Partial<EventBlock>) =>
    setData((d) => ({ ...d, [key]: { ...d[key], ...patch } }));
  const toggle = (id: SectionId) =>
    setData((d) => ({ ...d, off: d.off.includes(id) ? d.off.filter((x) => x !== id) : [...d.off, id] }));

  async function upload(files: FileList | null, kind: "cover" | "gallery") {
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.set("file", file);
      body.set("kind", kind);
      const res = await fetch(`${api}/fotos`, { method: "POST", body }).catch(() => null);
      const json = await res?.json().catch(() => null);
      if (!res?.ok) {
        alert(json?.error ?? "No se pudo subir la foto");
        break;
      }
      setData((d) => ({ ...d, cover: json.cover, photos: json.photos }));
    }
    setUploading(false);
  }

  async function removePhoto(url: string) {
    const res = await fetch(`${api}/fotos`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    }).catch(() => null);
    if (res?.ok) {
      const json = await res.json();
      setData((d) => ({ ...d, cover: json.cover, photos: json.photos }));
    }
  }

  async function pay() {
    setPaying(true);
    const res = await fetch(`${api}/pago`, { method: "POST" }).catch(() => null);
    const json = await res?.json().catch(() => null);
    if (res?.ok && json?.url) {
      window.location.href = json.url;
    } else {
      alert(json?.error ?? "No se pudo iniciar el pago");
      setPaying(false);
    }
  }

  async function removeGuestPhoto(file: string) {
    if (!confirm("¿Borrar esta foto? No se puede deshacer.")) return;
    const res = await fetch(`${api}/invitados/${file}`, { method: "DELETE" }).catch(() => null);
    if (res?.ok) setAlbum((a) => a.filter((f) => f !== file));
  }

  const publicUrl = `${origin}/i/${initial.slug}`;
  const going = rsvps.filter((r) => r.attending);
  const totalGuests = going.reduce((n, r) => n + r.guests, 0);

  const eventFields = (key: "ceremony" | "party") => (
    <div className="grid gap-3 sm:grid-cols-[7rem_1fr]">
      <Field label="Hora">
        <input type="time" className="field" value={data[key].time} onChange={(e) => setBlock(key, { time: e.target.value })} />
      </Field>
      <Field label="Lugar">
        <input className="field" maxLength={120} value={data[key].place} onChange={(e) => setBlock(key, { place: e.target.value })} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Dirección" hint="El botón «Cómo llegar» abre Google Maps con esta dirección.">
          <input className="field" maxLength={200} value={data[key].address} onChange={(e) => setBlock(key, { address: e.target.value })} />
        </Field>
      </div>
    </div>
  );

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-20 border-b border-rule bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <Link href="/cuenta" className="font-serif text-2xl italic" title="Mis invitaciones">{BRAND}</Link>
          <nav className="flex gap-1 rounded-full border border-rule bg-card p-1 text-sm">
            {(["editar", "confirmaciones", "album"] as const).map((id) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`rounded-full px-3 py-1.5 font-medium ${tab === id ? "bg-ink text-white" : "text-soft"}`}
              >
                {id === "editar" ? "Editar" : id === "album" ? `Fotos de invitados (${album.length})` : `Confirmaciones (${rsvps.length})`}
              </button>
            ))}
          </nav>
          <span className="ml-auto text-xs text-soft">
            {saveState === "saving" ? "Guardando…" : saveState === "error" ? "Error al guardar" : "Guardado"}
          </span>
          <a href={`/i/${initial.slug}`} target="_blank" className="btn-ghost px-4 py-2 text-sm">
            Ver
          </a>
          {!initial.paid && (
            <button onClick={pay} disabled={paying || !accepted} className="btn px-4 py-2 text-sm" title={accepted ? undefined : "Marca la casilla de abajo para publicar"}>
              {paying ? "Un momento…" : `Publicar · ${PRICE_LABEL}`}
            </button>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pt-6 pb-24 lg:pb-6">
        {initial.paid ? (
          <div className="mb-6 rounded-2xl border border-rule bg-card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="font-semibold">Publicada. Este es el enlace para vuestros invitados:</div>
              <div className="text-sm text-soft">Visitas a la invitación: {initial.visits}</div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <input readOnly value={publicUrl} className="field min-w-0 flex-1 basis-full font-mono text-sm sm:basis-0" onFocus={(e) => e.target.select()} />
              <button
                className="btn px-4 py-2 text-sm"
                onClick={async () => {
                  await navigator.clipboard.writeText(publicUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? "Copiado" : "Copiar"}
              </button>
              <a
                className="btn-ghost px-4 py-2 text-sm"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://wa.me/?text=${encodeURIComponent(`¡Nos casamos! Aquí tenéis nuestra invitación: ${publicUrl}`)}`}
              >
                Enviar por WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded-2xl border border-rule bg-card p-5 text-sm">
            <div className="font-semibold">Borrador: podéis editarlo gratis todo el tiempo que queráis.</div>
            <p className="mt-1 text-soft">
              Al publicar se paga una sola vez ({PRICE_LABEL}) con tarjeta en una página segura de Stripe, y la
              invitación queda activa al momento con su enlace para compartir.
            </p>
            <label className="mt-3 flex items-start gap-2">
              <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--brand)]" />
              <span>
                Acepto los <Link href="/legal/terminos" target="_blank" className="underline">términos y condiciones</Link> y
                pido que la invitación se active de inmediato; entiendo que, una vez publicada, pierdo el derecho
                de desistimiento.
              </span>
            </label>
            {demoPayments && (
              <span className="mt-2 block text-soft">
                Modo prueba: el pago todavía no está conectado, así que «Publicar» la activa sin cobrar.
              </span>
            )}
          </div>
        )}

        {tab === "album" ? (
          <div className="rounded-2xl border border-rule bg-card p-5">
            <h2 className="font-serif text-3xl">Fotos de vuestros invitados</h2>
            <p className="mt-1 max-w-2xl text-sm text-soft">
              Imprimid el cartel con el código QR y ponedlo en las mesas: los invitados lo escanean y suben sus
              fotos. Solo las veis vosotros, aquí. Límite: {GUEST_PHOTO_LIMIT} fotos.
            </p>
            {!initial.paid ? (
              <p className="mt-5 text-sm">Disponible cuando publiquéis la invitación.</p>
            ) : data.off.includes("album") ? (
              <p className="mt-5 text-sm">El álbum está oculto. Actívalo en la pestaña Editar.</p>
            ) : (
              <a href={`/panel/${initial.token}/qr`} target="_blank" className="btn mt-5 px-4 py-2 text-sm">
                Abrir cartel con QR para imprimir
              </a>
            )}
            {album.length === 0 ? (
              <p className="mt-6 text-soft">Todavía no hay fotos.</p>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {album.map((file) => (
                  <div key={file} className="relative">
                    <a href={`${api}/invitados/${file}`} download>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${api}/invitados/${file}`} alt="" className="aspect-square w-full rounded-lg object-cover" />
                    </a>
                    <button
                      type="button"
                      aria-label="Borrar foto"
                      onClick={() => removeGuestPhoto(file)}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-xs text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            {album.length > 0 && <p className="mt-3 text-xs text-soft">Toca una foto para descargarla.</p>}
          </div>
        ) : tab === "confirmaciones" ? (
          <div className="rounded-2xl border border-rule bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-6">
                {[
                  [going.length, "confirman"],
                  [totalGuests, "personas en total"],
                  [rsvps.length - going.length, "no pueden ir"],
                ].map(([n, label]) => (
                  <div key={label}>
                    <div className="font-serif text-4xl">{n}</div>
                    <div className="text-xs text-soft">{label}</div>
                  </div>
                ))}
              </div>
              {rsvps.length > 0 && (
                <a href={`${api}/csv`} className="btn-ghost px-4 py-2 text-sm">
                  Descargar para Excel
                </a>
              )}
            </div>
            {rsvps.length === 0 ? (
              <p className="mt-6 text-soft">
                Todavía no hay respuestas. Aparecerán aquí cuando los invitados confirmen. Recarga la página para
                ver las nuevas.
              </p>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-wider text-soft">
                    <tr>
                      <th className="py-2 pr-4">Nombre</th>
                      <th className="py-2 pr-4">Asiste</th>
                      <th className="py-2 pr-4">Personas</th>
                      <th className="py-2 pr-4">Alergias</th>
                      <th className="py-2">Mensaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvps.map((r) => (
                      <tr key={r.id} className="border-t border-rule align-top">
                        <td className="py-2 pr-4 font-medium">{r.name}</td>
                        <td className="py-2 pr-4">{r.attending ? "Sí" : "No"}</td>
                        <td className="py-2 pr-4">{r.attending ? r.guests : "—"}</td>
                        <td className="py-2 pr-4">{r.allergies || "—"}</td>
                        <td className="py-2">{r.message || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
            <div className={`min-w-0 space-y-4 ${mobilePreview ? "hidden lg:block" : ""}`}>
              <section className="rounded-2xl border border-rule bg-card p-5">
                <h2 className="font-serif text-2xl">Diseño</h2>
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={`rounded-xl border p-2 text-left text-sm ${
                        template === t.id ? "border-brand ring-2 ring-brand/30" : "border-rule"
                      }`}
                    >
                      <div
                        className="mb-2 flex h-14 items-center justify-center rounded-lg text-xl"
                        style={{ background: t.bg, color: t.text, fontFamily: t.titleFont, border: `1px solid ${t.line}` }}
                      >
                        <span className={t.titleClass}>A & B</span>
                      </div>
                      {t.name}
                    </button>
                  ))}
                </div>
              </section>

              <Group title="Lo esencial" data={data} toggle={toggle}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Nombre">
                    <input className="field" maxLength={40} value={data.name1} onChange={(e) => set("name1", e.target.value)} />
                  </Field>
                  <Field label="Nombre">
                    <input className="field" maxLength={40} value={data.name2} onChange={(e) => set("name2", e.target.value)} />
                  </Field>
                  <Field label="Fecha de la boda">
                    <input type="date" className="field" value={data.date} onChange={(e) => set("date", e.target.value)} />
                  </Field>
                  <Field label="Ciudad">
                    <input className="field" maxLength={80} value={data.city} onChange={(e) => set("city", e.target.value)} />
                  </Field>
                </div>
                <Field label="Mensaje de bienvenida">
                  <textarea className="field" rows={3} maxLength={600} value={data.message} onChange={(e) => set("message", e.target.value)} />
                </Field>
                <Field label="Foto de portada" hint="JPG, PNG o WebP, hasta 12 MB.">
                  <div className="flex items-center gap-3">
                    {data.cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={data.cover} alt="" className="h-16 w-16 rounded-lg object-cover" />
                    )}
                    <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(e) => { upload(e.target.files, "cover"); e.target.value = ""; }} className="max-w-full min-w-0 text-sm" />
                    {data.cover && (
                      <button type="button" onClick={() => removePhoto(data.cover)} className="text-sm text-soft underline">
                        Quitar
                      </button>
                    )}
                  </div>
                </Field>
              </Group>

              <Group title="Cuenta atrás" section="countdown" data={data} toggle={toggle} />

              <Group title="Nuestra historia" section="story" data={data} toggle={toggle}>
                <Field label="Cómo os conocisteis, en pocas líneas">
                  <textarea className="field" rows={3} maxLength={900} value={data.story} onChange={(e) => set("story", e.target.value)} />
                </Field>
                <h3 className="pt-2 text-sm font-semibold uppercase tracking-wider text-soft">Línea del tiempo por años</h3>
                {data.milestones.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className="field w-24"
                      maxLength={12}
                      placeholder="2019"
                      value={item.year}
                      onChange={(e) => set("milestones", data.milestones.map((x, j) => (j === i ? { ...x, year: e.target.value } : x)))}
                    />
                    <input
                      className="field"
                      maxLength={200}
                      placeholder="Nos fuimos a vivir juntos"
                      value={item.text}
                      onChange={(e) => set("milestones", data.milestones.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
                    />
                    <button type="button" aria-label="Quitar" className="px-2 text-soft" onClick={() => set("milestones", data.milestones.filter((_, j) => j !== i))}>
                      ✕
                    </button>
                  </div>
                ))}
                {data.milestones.length < 8 && (
                  <button type="button" className="btn-ghost px-4 py-2 text-sm" onClick={() => set("milestones", [...data.milestones, { year: "", text: "" }])}>
                    + Añadir año
                  </button>
                )}
              </Group>

              <Group title="Lugares y horarios" section="events" data={data} toggle={toggle}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-soft">Ceremonia</h3>
                {eventFields("ceremony")}
                <h3 className="pt-2 text-sm font-semibold uppercase tracking-wider text-soft">Celebración</h3>
                {eventFields("party")}
                <Field label="Cómo llegar y aparcamiento (opcional)">
                  <textarea className="field" rows={2} maxLength={400} value={data.gettingThere} onChange={(e) => set("gettingThere", e.target.value)} />
                </Field>
                <Field label="Vestimenta (opcional)">
                  <input className="field" maxLength={200} placeholder="Formal, cóctel, smart casual…" value={data.dressCode} onChange={(e) => set("dressCode", e.target.value)} />
                </Field>
              </Group>

              <Group title="Cronograma del día" section="timeline" data={data} toggle={toggle}>
                {data.timeline.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="time"
                      className="field w-28"
                      value={item.time}
                      onChange={(e) => set("timeline", data.timeline.map((x, j) => (j === i ? { ...x, time: e.target.value } : x)))}
                    />
                    <input
                      className="field"
                      maxLength={60}
                      placeholder="Ceremonia, cóctel, cena…"
                      value={item.label}
                      onChange={(e) => set("timeline", data.timeline.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                    />
                    <button type="button" aria-label="Quitar" className="px-2 text-soft" onClick={() => set("timeline", data.timeline.filter((_, j) => j !== i))}>
                      ✕
                    </button>
                  </div>
                ))}
                {data.timeline.length < 10 && (
                  <button type="button" className="btn-ghost px-4 py-2 text-sm" onClick={() => set("timeline", [...data.timeline, { time: "", label: "" }])}>
                    + Añadir momento
                  </button>
                )}
              </Group>

              <Group title="Alojamiento y transporte" section="travel" data={data} toggle={toggle}>
                <Field label="Hoteles recomendados">
                  <textarea className="field" rows={2} maxLength={500} value={data.lodging} onChange={(e) => set("lodging", e.target.value)} />
                </Field>
                <Field label="Autobuses">
                  <textarea className="field" rows={2} maxLength={500} value={data.transport} onChange={(e) => set("transport", e.target.value)} />
                </Field>
              </Group>

              <Group title="Galería de fotos" section="gallery" data={data} toggle={toggle}>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {data.photos.map((src) => (
                    <div key={src} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="aspect-square w-full rounded-lg object-cover" />
                      <button
                        type="button"
                        aria-label="Quitar foto"
                        onClick={() => removePhoto(src)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-xs text-white"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                {data.photos.length < MAX_PHOTOS ? (
                  <input type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(e) => { upload(e.target.files, "gallery"); e.target.value = ""; }} className="max-w-full min-w-0 text-sm" />
                ) : (
                  <p className="text-sm text-soft">Máximo {MAX_PHOTOS} fotos.</p>
                )}
                {uploading && <p className="text-sm text-soft">Subiendo…</p>}
              </Group>

              <Group title="Regalo" section="gifts" data={data} toggle={toggle}>
                <Field label="Texto">
                  <textarea className="field" rows={2} maxLength={300} value={data.giftsText} onChange={(e) => set("giftsText", e.target.value)} />
                </Field>
                <Field label="Número de cuenta (opcional)">
                  <input className="field font-mono" maxLength={40} placeholder="ES00 0000 0000 0000 0000 0000" value={data.iban} onChange={(e) => set("iban", e.target.value)} />
                </Field>
                <Field label="Enlace a lista de regalos (opcional)">
                  <input type="url" className="field" placeholder="https://…" value={data.giftsUrl} onChange={(e) => set("giftsUrl", e.target.value)} />
                </Field>
              </Group>

              <Group title="Preguntas frecuentes" section="faq" data={data} toggle={toggle}>
                {data.faq.map((item, i) => (
                  <div key={i} className="space-y-2 rounded-xl border border-rule p-3">
                    <div className="flex gap-2">
                      <input
                        className="field"
                        maxLength={120}
                        placeholder="¿Pueden venir niños?"
                        value={item.q}
                        onChange={(e) => set("faq", data.faq.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))}
                      />
                      <button type="button" aria-label="Quitar" className="px-2 text-soft" onClick={() => set("faq", data.faq.filter((_, j) => j !== i))}>
                        ✕
                      </button>
                    </div>
                    <textarea
                      className="field"
                      rows={2}
                      maxLength={400}
                      placeholder="Respuesta"
                      value={item.a}
                      onChange={(e) => set("faq", data.faq.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))}
                    />
                  </div>
                ))}
                {data.faq.length < 8 && (
                  <button type="button" className="btn-ghost px-4 py-2 text-sm" onClick={() => set("faq", [...data.faq, { q: "", a: "" }])}>
                    + Añadir pregunta
                  </button>
                )}
              </Group>

              <Group title="Confirmación de asistencia" section="rsvp" data={data} toggle={toggle}>
                <Field label="Fecha límite para confirmar (opcional)">
                  <input type="date" className="field" value={data.rsvpDeadline} onChange={(e) => set("rsvpDeadline", e.target.value)} />
                </Field>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={data.askAllergies} onChange={(e) => set("askAllergies", e.target.checked)} className="h-4 w-4 accent-[var(--brand)]" />
                  Preguntar por alergias e intolerancias
                </label>
              </Group>

              <Group title="Álbum de invitados" section="album" data={data} toggle={toggle}>
                <p className="text-sm text-soft">
                  Añade a la invitación un botón para que los invitados suban sus fotos de la boda. El cartel con
                  QR para las mesas está en la pestaña «Fotos de invitados».
                </p>
              </Group>

              <p className="px-1 text-xs text-soft">
                Secciones: {SECTIONS.length - data.off.length} visibles de {SECTIONS.length}. Las que no tengan
                contenido tampoco se muestran.
              </p>
            </div>

            <aside className={mobilePreview ? "" : "hidden lg:block"}>
              <div className="sticky top-24">
                <div className="mb-2 text-center text-xs uppercase tracking-wider text-soft">Así la verán en el móvil</div>
                <div className="mx-auto h-[calc(100svh-11rem)] max-w-[400px] overflow-y-auto rounded-[2rem] border-8 border-ink bg-white lg:h-[calc(100svh-9rem)]">
                  <Invitation template={template} data={data} mode="preview" embedded />
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
      {tab === "editar" && (
        <button
          type="button"
          onClick={() => {
            setMobilePreview((v) => !v);
            window.scrollTo({ top: 0 });
          }}
          className="btn fixed bottom-4 left-1/2 z-30 -translate-x-1/2 shadow-xl lg:hidden"
        >
          {mobilePreview ? "← Seguir editando" : "Ver vista previa"}
        </button>
      )}
    </div>
  );
}
