import { DatabaseSync } from "node:sqlite";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { aliasFromNames, isValidAlias } from "./alias";
import { emptyData, isPlanId, type InvitationData, type PlanId, type TemplateId } from "./templates";

// En el servidor, DATA_DIR apunta al disco permanente
export const DATA_DIR = process.env.DATA_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), "data");
export const UPLOADS_DIR = path.join(/*turbopackIgnore: true*/ DATA_DIR, "uploads");

let db: DatabaseSync | null = null;

function getDb(): DatabaseSync {
  if (db) return db;
  fs.mkdirSync(/*turbopackIgnore: true*/ UPLOADS_DIR, { recursive: true });
  db = new DatabaseSync(path.join(/*turbopackIgnore: true*/ DATA_DIR, "app.db"));
  db.exec(`
    CREATE TABLE IF NOT EXISTS invitations (
      slug TEXT PRIMARY KEY,
      token TEXT NOT NULL UNIQUE,
      template TEXT NOT NULL,
      data TEXT NOT NULL,
      paid INTEGER NOT NULL DEFAULT 0,
      visits INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS guest_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      file TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS guest_photos_slug ON guest_photos(slug);
    CREATE TABLE IF NOT EXISTS rsvps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      name TEXT NOT NULL,
      attending INTEGER NOT NULL,
      guests INTEGER NOT NULL,
      allergies TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS rsvps_slug ON rsvps(slug);
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      terms_accepted_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS password_resets (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL
    );
  `);
  // Columnas añadidas después de la primera versión
  const addColumn = (table: string, column: string, type: string) => {
    const cols = db!.prepare(`PRAGMA table_info(${table})`).all() as Row[];
    if (!cols.some((c) => c.name === column)) db!.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
  };
  addColumn("invitations", "user_id", "INTEGER");
  addColumn("invitations", "paid_at", "TEXT");
  addColumn("invitations", "expiry_notified", "INTEGER NOT NULL DEFAULT 0");
  addColumn("rsvps", "reply_key", "TEXT");
  addColumn("invitations", "reminded", "INTEGER NOT NULL DEFAULT 0");
  addColumn("invitations", "review_asked", "INTEGER NOT NULL DEFAULT 0"); // ya se le pidió la opinión tras la boda
  addColumn("invitations", "source", "TEXT"); // de dónde llegó quien la creó (instagram, google…)
  addColumn("users", "verified_at", "TEXT"); // cuándo confirmó que el correo es suyo
  db.exec(`
    CREATE TABLE IF NOT EXISTS email_verifications (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL
    );
  `);
  addColumn("invitations", "alias", "TEXT"); // dirección con los nombres: /lucia-y-marcos
  addColumn("invitations", "plan", "TEXT"); // "basico" o "premium"; vacío hasta que se publica
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS invitations_alias ON invitations(alias)");
  // Contadores diarios del embudo de ventas (sin datos personales): un número por día y por paso
  db.exec(`
    CREATE TABLE IF NOT EXISTS stats (
      day TEXT NOT NULL,
      event TEXT NOT NULL,
      n INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (day, event)
    );
  `);
  return db;
}

export type Invitation = {
  slug: string;
  token: string;
  template: TemplateId;
  data: InvitationData;
  paid: boolean;
  visits: number;
  userId: number | null;
  createdAt: string;
  // Dirección pública con los nombres (se asigna al publicar) y plan contratado
  alias: string | null;
  plan: PlanId;
  source: string | null;
};

export type Rsvp = {
  id: number;
  name: string;
  attending: boolean;
  guests: number;
  allergies: string;
  message: string;
  createdAt: string;
};

type Row = Record<string, unknown>;

function toInvitation(r: Row): Invitation {
  return {
    slug: r.slug as string,
    token: r.token as string,
    template: r.template as TemplateId,
    data: { ...emptyData(), ...JSON.parse(r.data as string) },
    paid: r.paid === 1,
    visits: r.visits as number,
    userId: (r.user_id as number | null) ?? null,
    createdAt: r.created_at as string,
    alias: (r.alias as string | null) ?? null,
    plan: isPlanId(r.plan) ? r.plan : "basico",
    source: (r.source as string | null) ?? null,
  };
}

// userId es null cuando alguien empieza a probar sin cuenta: el borrador se le asigna al registrarse
// names: los nombres que la pareja escribió en la portada para probar los diseños
// source: de dónde llegó (instagram, google…), para saber qué canal trae ventas
export function createInvitation(
  template: TemplateId,
  userId: number | null,
  names: { name1?: string; name2?: string } = {},
  source: string | null = null,
): Invitation {
  const slug = randomBytes(5).toString("hex");
  const token = randomBytes(24).toString("hex");
  const now = new Date().toISOString();
  const data = { ...emptyData(), name1: (names.name1 ?? "").slice(0, 40), name2: (names.name2 ?? "").slice(0, 40) };
  getDb()
    .prepare("INSERT INTO invitations (slug, token, template, data, created_at, user_id, source) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(slug, token, template, JSON.stringify(data), now, userId, source);
  return { slug, token, template, data, paid: false, visits: 0, userId, createdAt: now, alias: null, plan: "basico", source };
}

export function getByToken(token: string): Invitation | null {
  const r = getDb().prepare("SELECT * FROM invitations WHERE token = ?").get(token) as Row | undefined;
  return r ? toInvitation(r) : null;
}

export function getBySlug(slug: string): Invitation | null {
  const r = getDb().prepare("SELECT * FROM invitations WHERE slug = ?").get(slug) as Row | undefined;
  return r ? toInvitation(r) : null;
}

export function saveInvitation(token: string, template: TemplateId, data: InvitationData) {
  getDb()
    .prepare("UPDATE invitations SET template = ?, data = ? WHERE token = ?")
    .run(template, JSON.stringify(data), token);
}

export function getByAlias(alias: string): Invitation | null {
  const r = getDb().prepare("SELECT * FROM invitations WHERE alias = ?").get(alias) as Row | undefined;
  return r ? toInvitation(r) : null;
}

// Primera dirección libre a partir de los nombres: lucia-y-marcos, lucia-y-marcos-2, lucia-y-marcos-3…
function freeAlias(name1: string, name2: string): string | null {
  const base = aliasFromNames(name1, name2);
  if (!base) return null;
  const taken = getDb().prepare("SELECT 1 FROM invitations WHERE alias = ?");
  for (let i = 1; i < 500; i++) {
    const candidate = i === 1 ? base : `${base.slice(0, 36)}-${i}`;
    if (isValidAlias(candidate) && !taken.get(candidate)) return candidate;
  }
  return null;
}

// Cambia la dirección (plan Premium). Devuelve false si ya la usa otra invitación.
export function setAlias(token: string, alias: string): boolean {
  try {
    getDb().prepare("UPDATE invitations SET alias = ? WHERE token = ?").run(alias, token);
    return true;
  } catch {
    return false; // el índice único impide repetir direcciones
  }
}

// Aplica un pago: publica la invitación con su plan, o la sube a Premium si ya estaba publicada.
// El aviso de Stripe y la vuelta del pago llegan los dos, así que tiene que poder repetirse sin efecto.
// Devuelve qué ha cambiado, para avisar por correo solo la primera vez: "published", "upgraded" o null.
export function markPaid(token: string, plan: PlanId = "basico"): "published" | "upgraded" | null {
  const inv = getByToken(token);
  if (!inv) return null;
  const d = getDb();
  if (!inv.paid) {
    const res = d
      .prepare("UPDATE invitations SET paid = 1, plan = ?, paid_at = COALESCE(paid_at, ?) WHERE token = ? AND paid = 0")
      .run(plan, new Date().toISOString(), token);
    if (res.changes === 0) return null;
    // Al publicar, la invitación recibe su dirección con los nombres
    if (!inv.alias) {
      const alias = freeAlias(inv.data.name1, inv.data.name2);
      if (alias) setAlias(token, alias);
    }
    addStat("venta");
    if (plan === "premium") addStat("premium");
    if (inv.source) addStat(`venta@${inv.source}`);
    return "published";
  }
  if (plan === "premium" && inv.plan !== "premium") {
    d.prepare("UPDATE invitations SET plan = 'premium' WHERE token = ?").run(token);
    addStat("mejora");
    return "upgraded";
  }
  return null;
}

// Guarda una respuesta. Si llega con la misma clave que una anterior (mismo invitado, mismo navegador),
// la sustituye en vez de duplicarla. Devuelve true si es una respuesta nueva.
export function saveRsvp(slug: string, key: string | null, r: Omit<Rsvp, "id" | "createdAt">): boolean {
  const now = new Date().toISOString();
  if (key) {
    const done = getDb()
      .prepare(
        "UPDATE rsvps SET name = ?, attending = ?, guests = ?, allergies = ?, message = ?, created_at = ? WHERE slug = ? AND reply_key = ?",
      )
      .run(r.name, r.attending ? 1 : 0, r.guests, r.allergies, r.message, now, slug, key);
    if (done.changes > 0) return false;
  }
  getDb()
    .prepare(
      "INSERT INTO rsvps (slug, name, attending, guests, allergies, message, created_at, reply_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .run(slug, r.name, r.attending ? 1 : 0, r.guests, r.allergies, r.message, now, key);
  return true;
}

export function listRsvps(slug: string): Rsvp[] {
  const rows = getDb().prepare("SELECT * FROM rsvps WHERE slug = ? ORDER BY id DESC").all(slug) as Row[];
  return rows.map((r) => ({
    id: r.id as number,
    name: r.name as string,
    attending: r.attending === 1,
    guests: r.guests as number,
    allergies: r.allergies as string,
    message: r.message as string,
    createdAt: r.created_at as string,
  }));
}

export function countRsvps(slug: string): number {
  const r = getDb().prepare("SELECT COUNT(*) AS n FROM rsvps WHERE slug = ?").get(slug) as Row;
  return r.n as number;
}

export function addVisit(slug: string) {
  getDb().prepare("UPDATE invitations SET visits = visits + 1 WHERE slug = ?").run(slug);
}

export function addGuestPhoto(slug: string, file: string) {
  getDb()
    .prepare("INSERT INTO guest_photos (slug, file, created_at) VALUES (?, ?, ?)")
    .run(slug, file, new Date().toISOString());
}

export function listGuestPhotos(slug: string): string[] {
  const rows = getDb().prepare("SELECT file FROM guest_photos WHERE slug = ? ORDER BY id DESC").all(slug) as Row[];
  return rows.map((r) => r.file as string);
}

export function removeGuestPhoto(slug: string, file: string) {
  getDb().prepare("DELETE FROM guest_photos WHERE slug = ? AND file = ?").run(slug, file);
}

export function listByUser(userId: number): Invitation[] {
  const rows = getDb().prepare("SELECT * FROM invitations WHERE user_id = ? ORDER BY created_at DESC").all(userId) as Row[];
  return rows.map(toInvitation);
}

export function setOwner(token: string, userId: number) {
  getDb().prepare("UPDATE invitations SET user_id = ? WHERE token = ? AND user_id IS NULL").run(userId, token);
}

// --- Cuentas y sesiones

export type User = { id: number; email: string; verified: boolean };

const toUser = (r: Row): User => ({ id: r.id as number, email: r.email as string, verified: Boolean(r.verified_at) });

export function createUser(email: string, passwordHash: string): User | null {
  const now = new Date().toISOString();
  try {
    const r = getDb()
      .prepare("INSERT INTO users (email, password, terms_accepted_at, created_at) VALUES (?, ?, ?, ?)")
      .run(email, passwordHash, now, now);
    return { id: Number(r.lastInsertRowid), email, verified: false };
  } catch {
    return null; // el correo ya existe
  }
}

export function getUserWithPassword(email: string): (User & { password: string }) | null {
  const r = getDb().prepare("SELECT id, email, password, verified_at FROM users WHERE email = ?").get(email) as Row | undefined;
  return r ? { ...toUser(r), password: r.password as string } : null;
}

export function createSessionRow(id: string, userId: number, expiresAt: string) {
  getDb().prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").run(id, userId, expiresAt);
}

export function getSessionUser(id: string): User | null {
  const r = getDb()
    .prepare(
      "SELECT u.id, u.email, u.verified_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ? AND s.expires_at > ?",
    )
    .get(id, new Date().toISOString()) as Row | undefined;
  return r ? toUser(r) : null;
}

export function deleteSession(id: string) {
  getDb().prepare("DELETE FROM sessions WHERE id = ?").run(id);
}

export function getUserById(id: number): User | null {
  const r = getDb().prepare("SELECT id, email, verified_at FROM users WHERE id = ?").get(id) as Row | undefined;
  return r ? toUser(r) : null;
}

// --- Confirmación del correo

export function createVerification(tokenHash: string, userId: number, expiresAt: string) {
  const d = getDb();
  d.prepare("DELETE FROM email_verifications WHERE user_id = ?").run(userId); // solo vale el último enlace
  d.prepare("INSERT INTO email_verifications (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(tokenHash, userId, expiresAt);
}

export function markVerified(userId: number) {
  const d = getDb();
  d.prepare("UPDATE users SET verified_at = COALESCE(verified_at, ?) WHERE id = ?").run(new Date().toISOString(), userId);
  d.prepare("DELETE FROM email_verifications WHERE user_id = ?").run(userId);
}

// Da por confirmado el correo del enlace. Devuelve false si el enlace no existe o ha caducado.
export function verifyEmailToken(tokenHash: string): boolean {
  const r = getDb()
    .prepare("SELECT user_id FROM email_verifications WHERE token_hash = ? AND expires_at > ?")
    .get(tokenHash, new Date().toISOString()) as Row | undefined;
  if (!r) return false;
  markVerified(r.user_id as number);
  return true;
}

export function setPassword(userId: number, passwordHash: string) {
  const d = getDb();
  d.prepare("UPDATE users SET password = ? WHERE id = ?").run(passwordHash, userId);
  // cambiar la contraseña cierra todas las sesiones abiertas
  d.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
  d.prepare("DELETE FROM password_resets WHERE user_id = ?").run(userId);
}

export function createReset(tokenHash: string, userId: number, expiresAt: string) {
  getDb().prepare("INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(tokenHash, userId, expiresAt);
}

export function getResetUser(tokenHash: string): number | null {
  const r = getDb()
    .prepare("SELECT user_id FROM password_resets WHERE token_hash = ? AND expires_at > ?")
    .get(tokenHash, new Date().toISOString()) as Row | undefined;
  return r ? (r.user_id as number) : null;
}

export function countInvitations(): number {
  return (getDb().prepare("SELECT COUNT(*) AS n FROM invitations").get() as Row).n as number;
}

// Borra las filas de una invitación (las fotos en disco las borra lib/cleanup.ts)
export function deleteInvitationRows(slug: string) {
  const d = getDb();
  d.prepare("DELETE FROM rsvps WHERE slug = ?").run(slug);
  d.prepare("DELETE FROM guest_photos WHERE slug = ?").run(slug);
  d.prepare("DELETE FROM invitations WHERE slug = ?").run(slug);
}

export function deleteUserRows(userId: number) {
  const d = getDb();
  d.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
  d.prepare("DELETE FROM password_resets WHERE user_id = ?").run(userId);
  d.prepare("DELETE FROM email_verifications WHERE user_id = ?").run(userId);
  d.prepare("DELETE FROM users WHERE id = ?").run(userId);
}

// Invitaciones publicadas antes de una fecha (para el aviso y el borrado a los 12 meses)
export function listPaidBefore(iso: string, onlyNotNotified: boolean, plan: PlanId): Invitation[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM invitations WHERE paid = 1 AND paid_at < ? AND COALESCE(plan, 'basico') = ?${onlyNotNotified ? " AND expiry_notified = 0" : ""}`,
    )
    .all(iso, plan) as Row[];
  return rows.map(toInvitation);
}

// Borradores sin pagar, con dueño, creados entre dos fechas y a los que aún no se ha enviado el recordatorio
export function listDraftsToRemind(fromIso: string, toIso: string): Invitation[] {
  const rows = getDb()
    .prepare("SELECT * FROM invitations WHERE paid = 0 AND reminded = 0 AND user_id IS NOT NULL AND created_at BETWEEN ? AND ?")
    .all(fromIso, toIso) as Row[];
  return rows.map(toInvitation);
}

export function markReminded(slug: string) {
  getDb().prepare("UPDATE invitations SET reminded = 1 WHERE slug = ?").run(slug);
}

// Borradores de prueba que nadie llegó a guardar en una cuenta
export function listAnonymousDraftsBefore(iso: string): Invitation[] {
  const rows = getDb()
    .prepare("SELECT * FROM invitations WHERE paid = 0 AND user_id IS NULL AND created_at < ?")
    .all(iso) as Row[];
  return rows.map(toInvitation);
}

// Invitaciones publicadas a las que todavía no se ha pedido opinión (el filtro por fecha de boda se hace fuera)
export function listPaidNotAskedForReview(): Invitation[] {
  const rows = getDb().prepare("SELECT * FROM invitations WHERE paid = 1 AND review_asked = 0 AND user_id IS NOT NULL").all() as Row[];
  return rows.map(toInvitation);
}

export function markReviewAsked(slug: string) {
  getDb().prepare("UPDATE invitations SET review_asked = 1 WHERE slug = ?").run(slug);
}

// Copia completa y coherente de la base de datos en otro archivo (se puede hacer con la web en marcha)
export function snapshotDatabase(file: string) {
  getDb().exec(`VACUUM INTO '${file.replace(/'/g, "''")}'`);
}

// --- Estadísticas del embudo

export function addStat(event: string) {
  getDb()
    .prepare("INSERT INTO stats (day, event, n) VALUES (?, ?, 1) ON CONFLICT(day, event) DO UPDATE SET n = n + 1")
    .run(new Date().toISOString().slice(0, 10), event);
}

export function listStats(sinceDay: string): { day: string; event: string; n: number }[] {
  return getDb().prepare("SELECT day, event, n FROM stats WHERE day >= ? ORDER BY day DESC").all(sinceDay) as {
    day: string;
    event: string;
    n: number;
  }[];
}

export function markExpiryNotified(slug: string) {
  getDb().prepare("UPDATE invitations SET expiry_notified = 1 WHERE slug = ?").run(slug);
}
