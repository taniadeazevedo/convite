export const BRAND = "Convite";
export const PRICE_CENTS = 2900;
export const PRICE_LABEL = "29 €";
export const MAX_PHOTOS = 6;
export const GUEST_PHOTO_LIMIT = 30; // fotos que pueden subir los invitados por boda

export type TemplateId =
  | "lino"
  | "salvia"
  | "terracota"
  | "editorial"
  | "medianoche"
  | "riviera"
  | "rosa"
  | "collage"
  | "postal"
  | "pop";

export type Template = {
  id: TemplateId;
  name: string;
  tagline: string;
  // Colores
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  line: string;
  // Tipografías (variables CSS definidas en layout.tsx)
  titleFont: string;
  bodyFont: string;
  labelFont: string; // etiquetas pequeñas en mayúsculas
  titleClass: string;
  // Composición: cada plantilla tiene su propia portada y su forma de dibujar tarjetas y botones
  hero: "arco" | "polaroid" | "boho" | "revista" | "gala" | "curva" | "oval" | "collage" | "ticket" | "pop";
  align: "center" | "left";
  count: "cajas" | "circulos" | "lineas"; // estilo de la cuenta atrás
  radius: string; // tarjetas y campos
  pill: string; // botones
  grain: boolean; // textura de papel
};

const inter = "var(--font-inter)";

export const TEMPLATES: Template[] = [
  {
    id: "lino", name: "Lino", tagline: "Foto en arco y serif en cursiva",
    bg: "#f4efe8", surface: "#fbf8f3", text: "#3a332c", muted: "#8c8175", accent: "#a08a6e", line: "#e2d9cc",
    titleFont: "var(--font-cormorant)", bodyFont: inter, labelFont: inter, titleClass: "italic font-normal",
    hero: "arco", align: "center", count: "cajas", radius: "1rem", pill: "999px", grain: true,
  },
  {
    id: "salvia", name: "Salvia", tagline: "Polaroids y letra manuscrita",
    bg: "#eef0e8", surface: "#f8f9f4", text: "#2f3a30", muted: "#7a8577", accent: "#7d8f73", line: "#d8ddd0",
    titleFont: "var(--font-hand)", bodyFont: inter, labelFont: inter, titleClass: "font-normal",
    hero: "polaroid", align: "center", count: "cajas", radius: "0.25rem", pill: "0.25rem", grain: true,
  },
  {
    id: "terracota", name: "Terracota", tagline: "Boho con círculos en tonos tierra",
    bg: "#f6ece4", surface: "#fcf6f1", text: "#4a2f25", muted: "#96786a", accent: "#b8694a", line: "#ead8cb",
    titleFont: "var(--font-playfair)", bodyFont: inter, labelFont: inter, titleClass: "italic font-normal",
    hero: "boho", align: "center", count: "circulos", radius: "1.75rem", pill: "999px", grain: true,
  },
  {
    id: "editorial", name: "Editorial", tagline: "Revista en blanco y negro",
    bg: "#ffffff", surface: "#f5f4f1", text: "#141414", muted: "#777777", accent: "#141414", line: "#e3e3df",
    titleFont: "var(--font-cormorant)", bodyFont: inter, labelFont: inter,
    titleClass: "font-light uppercase tracking-[0.04em]",
    hero: "revista", align: "left", count: "lineas", radius: "0", pill: "0", grain: false,
  },
  {
    id: "medianoche", name: "Medianoche", tagline: "Gala oscura con foto a pantalla completa",
    bg: "#1a1917", surface: "#24231f", text: "#efe8dc", muted: "#a69f92", accent: "#c9b38a", line: "#35332d",
    titleFont: "var(--font-cormorant)", bodyFont: inter, labelFont: inter,
    titleClass: "font-normal uppercase tracking-[0.2em]",
    hero: "gala", align: "center", count: "lineas", radius: "0", pill: "0", grain: false,
  },
  {
    id: "riviera", name: "Riviera", tagline: "Verano mediterráneo en azul y limón",
    bg: "#f7f3ea", surface: "#ffffff", text: "#1d3b5c", muted: "#6c8198", accent: "#d99a1c", line: "#e3dccb",
    titleFont: "var(--font-playfair)", bodyFont: inter, labelFont: inter, titleClass: "font-normal",
    hero: "curva", align: "center", count: "cajas", radius: "1.25rem", pill: "999px", grain: true,
  },
  {
    id: "rosa", name: "Rosa", tagline: "Retrato ovalado en rosa empolvado",
    bg: "#f7ecea", surface: "#fdf7f5", text: "#5a3d3d", muted: "#a08484", accent: "#c98b86", line: "#ecd9d5",
    titleFont: "var(--font-bodoni)", bodyFont: inter, labelFont: inter, titleClass: "italic font-normal",
    hero: "oval", align: "center", count: "circulos", radius: "999px", pill: "999px", grain: true,
  },
  {
    id: "collage", name: "Collage", tagline: "Recortes, fotos superpuestas y rojo",
    bg: "#f3ede2", surface: "#fffdf8", text: "#2b2b2b", muted: "#7c766b", accent: "#c8442f", line: "#ddd4c4",
    titleFont: "var(--font-dmserif)", bodyFont: inter, labelFont: "var(--font-mono)", titleClass: "font-normal",
    hero: "collage", align: "left", count: "cajas", radius: "0.125rem", pill: "0.125rem", grain: true,
  },
  {
    id: "postal", name: "Postal", tagline: "Tarjeta de embarque para vuestro viaje",
    bg: "#e9e4d8", surface: "#fbf9f3", text: "#26241f", muted: "#7e786b", accent: "#5d6b3d", line: "#d3ccbb",
    titleFont: "var(--font-cormorant)", bodyFont: inter, labelFont: "var(--font-mono)", titleClass: "font-medium",
    hero: "ticket", align: "center", count: "lineas", radius: "0.5rem", pill: "0.5rem", grain: true,
  },
  {
    id: "pop", name: "Pop", tagline: "Color, tipografía enorme y pegatinas",
    bg: "#ddd2ff", surface: "#efe9ff", text: "#1b1140", muted: "#5d5289", accent: "#ff5a36", line: "#c4b6f2",
    titleFont: "var(--font-syne)", bodyFont: inter, labelFont: inter,
    titleClass: "font-extrabold uppercase tracking-tight",
    hero: "pop", align: "left", count: "circulos", radius: "1.5rem", pill: "999px", grain: false,
  },
];

export function getTemplate(id: string): Template {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

export function isTemplateId(id: unknown): id is TemplateId {
  return TEMPLATES.some((t) => t.id === id);
}

export type EventBlock = {
  time: string;
  place: string;
  address: string;
  mapsUrl: string;
};

export type TimelineItem = { time: string; label: string };
export type FaqItem = { q: string; a: string };
export type Milestone = { year: string; text: string };

// Secciones que la pareja puede ocultar desde el panel
export const SECTIONS = [
  { id: "countdown", label: "Cuenta atrás" },
  { id: "story", label: "Nuestra historia" },
  { id: "events", label: "Lugares y horarios" },
  { id: "timeline", label: "Cronograma del día" },
  { id: "travel", label: "Alojamiento y transporte" },
  { id: "gallery", label: "Galería de fotos" },
  { id: "gifts", label: "Regalo" },
  { id: "faq", label: "Preguntas frecuentes" },
  { id: "rsvp", label: "Confirmación de asistencia" },
  { id: "album", label: "Álbum de invitados" },
] as const;
export type SectionId = (typeof SECTIONS)[number]["id"];

export type InvitationData = {
  name1: string;
  name2: string;
  date: string; // YYYY-MM-DD
  city: string;
  message: string;
  ceremony: EventBlock;
  party: EventBlock;
  dressCode: string;
  gettingThere: string; // tráfico, aparcamiento…
  story: string;
  milestones: Milestone[]; // la historia contada por años
  timeline: TimelineItem[];
  lodging: string;
  transport: string;
  giftsText: string;
  giftsUrl: string;
  iban: string;
  faq: FaqItem[];
  off: SectionId[]; // secciones ocultas
  rsvpDeadline: string; // YYYY-MM-DD
  askAllergies: boolean;
  cover: string; // URL de la foto de portada
  photos: string[];
};

export function emptyData(): InvitationData {
  return {
    name1: "",
    name2: "",
    date: "",
    city: "",
    message: "",
    ceremony: { time: "", place: "", address: "", mapsUrl: "" },
    party: { time: "", place: "", address: "", mapsUrl: "" },
    dressCode: "",
    gettingThere: "",
    story: "",
    milestones: [],
    timeline: [],
    lodging: "",
    transport: "",
    giftsText: "",
    giftsUrl: "",
    iban: "",
    faq: [],
    off: [],
    rsvpDeadline: "",
    askAllergies: true,
    cover: "",
    photos: [],
  };
}

// Fotos de ejemplo (de Unsplash, licencia gratuita), guardadas en public/muestras
export const SAMPLE_PHOTOS = Array.from({ length: 14 }, (_, i) => `/muestras/${String(i + 1).padStart(2, "0")}.jpg`);

export function sampleData(templateId?: string): InvitationData {
  // Cada plantilla enseña fotos distintas para que las miniaturas no se repitan
  const start = Math.max(0, TEMPLATES.findIndex((t) => t.id === templateId));
  const pick = (i: number) => SAMPLE_PHOTOS[(start + i) % SAMPLE_PHOTOS.length];
  const d = new Date();
  d.setMonth(d.getMonth() + 5);
  const date = d.toISOString().slice(0, 10);
  d.setMonth(d.getMonth() - 1);
  return {
    name1: "Lucía",
    name2: "Marcos",
    date,
    city: "Sevilla",
    message:
      "Después de tantos años juntos, por fin nos casamos. Nos haría muy felices que nos acompañarais en un día tan especial.",
    ceremony: {
      time: "18:00",
      place: "Iglesia de San Luis",
      address: "Calle San Luis, 37, Sevilla",
      mapsUrl: "",
    },
    party: {
      time: "20:00",
      place: "Hacienda Los Olivos",
      address: "Carretera de Utrera, km 4, Sevilla",
      mapsUrl: "",
    },
    dressCode: "Formal. Habrá césped: mejor tacón ancho.",
    gettingThere: "Hay aparcamiento gratuito en la hacienda. Desde el centro son unos 20 minutos en coche.",
    story:
      "Nos conocimos en la universidad, en una clase a la que ninguno de los dos quería ir.",
    milestones: [
      { year: "2016", text: "Primer café (que acabó siendo cena)." },
      { year: "2019", text: "Nos mudamos juntos a un piso sin ascensor." },
      { year: "2022", text: "Llegó Nala, nuestra perra." },
      { year: "2025", text: "Un «sí» en una playa de Cádiz." },
    ],
    timeline: [
      { time: "18:00", label: "Ceremonia" },
      { time: "19:30", label: "Cóctel" },
      { time: "21:30", label: "Cena" },
      { time: "00:00", label: "Fiesta" },
    ],
    lodging: "Hotel Alcázar (a 10 min de la hacienda). Precio especial diciendo que venís a nuestra boda.",
    transport: "Habrá autobús desde la Plaza de Armas a las 17:15, con vuelta a las 02:00 y a las 05:00.",
    giftsText: "Vuestra compañía es el mejor regalo. Si además queréis ayudarnos con el viaje:",
    giftsUrl: "",
    iban: "ES00 0000 0000 0000 0000 0000",
    faq: [
      { q: "¿Pueden venir niños?", a: "Sí, habrá monitores y menú infantil." },
      { q: "¿Puedo hacer fotos en la ceremonia?", a: "Preferimos que guardéis el móvil durante la ceremonia; después, todas las que queráis." },
    ],
    off: [],
    rsvpDeadline: d.toISOString().slice(0, 10),
    askAllergies: true,
    cover: pick(0),
    photos: [1, 2, 3, 4, 5, 6].map(pick),
  };
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max).trim() : "");
const dateStr = (v: unknown) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "");
const timeStr = (v: unknown) => (typeof v === "string" && /^\d{2}:\d{2}$/.test(v) ? v : "");
// Solo enlaces http(s): evita javascript: y similares en el botón del mapa
const urlStr = (v: unknown) => {
  const s = str(v, 500);
  return /^https?:\/\//i.test(s) ? s : "";
};

const list = (v: unknown, max: number) =>
  (Array.isArray(v) ? v.slice(0, max) : []).map((i) => (i ?? {}) as Record<string, unknown>);

function block(v: unknown): EventBlock {
  const o = (v ?? {}) as Record<string, unknown>;
  return {
    time: timeStr(o.time),
    place: str(o.place, 120),
    address: str(o.address, 200),
    mapsUrl: urlStr(o.mapsUrl),
  };
}

// Limpia lo que llega del formulario. Las fotos no se tocan aquí: solo cambian al subirlas o borrarlas.
export function sanitizeData(input: unknown, current: InvitationData): InvitationData {
  const o = (input ?? {}) as Record<string, unknown>;
  return {
    name1: str(o.name1, 40),
    name2: str(o.name2, 40),
    date: dateStr(o.date),
    city: str(o.city, 80),
    message: str(o.message, 600),
    ceremony: block(o.ceremony),
    party: block(o.party),
    dressCode: str(o.dressCode, 200),
    gettingThere: str(o.gettingThere, 400),
    story: str(o.story, 900),
    milestones: list(o.milestones, 8)
      .map((i) => ({ year: str(i.year, 12), text: str(i.text, 200) }))
      .filter((i) => i.year || i.text),
    timeline: list(o.timeline, 10)
      .map((i) => ({ time: timeStr(i.time), label: str(i.label, 60) }))
      .filter((i) => i.label),
    lodging: str(o.lodging, 500),
    transport: str(o.transport, 500),
    giftsText: str(o.giftsText, 300),
    giftsUrl: urlStr(o.giftsUrl),
    iban: str(o.iban, 40),
    faq: list(o.faq, 8)
      .map((i) => ({ q: str(i.q, 120), a: str(i.a, 400) }))
      .filter((i) => i.q),
    off: SECTIONS.map((x) => x.id).filter((id) => Array.isArray(o.off) && o.off.includes(id)),
    rsvpDeadline: dateStr(o.rsvpDeadline),
    askAllergies: o.askAllergies !== false,
    cover: current.cover,
    photos: current.photos,
  };
}

export function mapsLink(b: EventBlock): string {
  if (b.mapsUrl) return b.mapsUrl;
  const q = [b.place, b.address].filter(Boolean).join(", ");
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : "";
}

export function formatDate(date: string): string {
  if (!date) return "";
  const d = new Date(date + "T12:00:00");
  return d.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Fecha en formato corto tipo "14 · 06 · 2027"
export function formatDateDots(date: string): string {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${d} · ${m} · ${y}`;
}
