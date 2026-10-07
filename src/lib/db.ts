import { DatabaseSync } from "node:sqlite";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { emptyData, type InvitationData, type TemplateId } from "./templates";

// En el servidor, DATA_DIR apunta al disco permanente
export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

let db: DatabaseSync | null = null;

function getDb(): DatabaseSync {
  if (db) return db;
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  db = new DatabaseSync(path.join(DATA_DIR, "app.db"));
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
  };
}

export function createInvitation(template: TemplateId, userId: number): Invitation {
  const slug = randomBytes(5).toString("hex");
  const token = randomBytes(24).toString("hex");
  const now = new Date().toISOString();
  getDb()
    .prepare("INSERT INTO invitations (slug, token, template, data, created_at, user_id) VALUES (?, ?, ?, ?, ?, ?)")
    .run(slug, token, template, JSON.stringify(emptyData()), now, userId);
  return { slug, token, template, data: emptyData(), paid: false, visits: 0, userId, createdAt: now };
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

export function markPaid(token: string) {
  getDb()
    .prepare("UPDATE invitations SET paid = 1, paid_at = COALESCE(paid_at, ?) WHERE token = ?")
    .run(new Date().toISOString(), token);
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

export type User = { id: number; email: string };

export function createUser(email: string, passwordHash: string): User | null {
  const now = new Date().toISOString();
  try {
    const r = getDb()
      .prepare("INSERT INTO users (email, password, terms_accepted_at, created_at) VALUES (?, ?, ?, ?)")
      .run(email, passwordHash, now, now);
    return { id: Number(r.lastInsertRowid), email };
  } catch {
    return null; // el correo ya existe
  }
}

export function getUserWithPassword(email: string): (User & { password: string }) | null {
  const r = getDb().prepare("SELECT id, email, password FROM users WHERE email = ?").get(email) as Row | undefined;
  return r ? { id: r.id as number, email: r.email as string, password: r.password as string } : null;
}

export function createSessionRow(id: string, userId: number, expiresAt: string) {
  getDb().prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").run(id, userId, expiresAt);
}

export function getSessionUser(id: string): User | null {
  const r = getDb()
    .prepare(
      "SELECT u.id, u.email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ? AND s.expires_at > ?",
    )
    .get(id, new Date().toISOString()) as Row | undefined;
  return r ? { id: r.id as number, email: r.email as string } : null;
}

export function deleteSession(id: string) {
  getDb().prepare("DELETE FROM sessions WHERE id = ?").run(id);
}

export function getUserById(id: number): User | null {
  const r = getDb().prepare("SELECT id, email FROM users WHERE id = ?").get(id) as Row | undefined;
  return r ? { id: r.id as number, email: r.email as string } : null;
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
  d.prepare("DELETE FROM users WHERE id = ?").run(userId);
}

// Invitaciones publicadas antes de una fecha (para el aviso y el borrado a los 12 meses)
export function listPaidBefore(iso: string, onlyNotNotified: boolean): Invitation[] {
  const rows = getDb()
    .prepare(`SELECT * FROM invitations WHERE paid = 1 AND paid_at < ?${onlyNotNotified ? " AND expiry_notified = 0" : ""}`)
    .all(iso) as Row[];
  return rows.map(toInvitation);
}

export function markExpiryNotified(slug: string) {
  getDb().prepare("UPDATE invitations SET expiry_notified = 1 WHERE slug = ?").run(slug);
}
