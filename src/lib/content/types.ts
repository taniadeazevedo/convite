// Bloques de texto de las páginas de contenido (guías del blog y páginas de producto).
// Cada página es una lista de bloques, así se escriben como datos sin necesitar un editor.
export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  // Cita destacada: se usa para los textos de ejemplo que se pueden copiar
  | { type: "quote"; text: string }
  // Llamada a probar Invitalia en mitad del texto
  | { type: "cta"; text: string };

export type Faq = [question: string, answer: string];

export type Article = {
  slug: string;
  title: string; // título visible (H1)
  seoTitle: string; // título para Google (máx. ~60 caracteres)
  description: string; // descripción para Google (máx. ~155 caracteres)
  date: string; // AAAA-MM-DD de publicación
  updated?: string; // AAAA-MM-DD de la última revisión
  readingMinutes: number;
  intro: string;
  blocks: Block[];
  faq?: Faq[];
};

export type ProductPage = {
  slug: string;
  title: string; // H1
  seoTitle: string;
  description: string;
  eyebrow: string;
  intro: string;
  blocks: Block[];
  faq: Faq[];
};
