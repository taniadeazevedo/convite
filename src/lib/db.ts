import { DatabaseSync } from "node:sqlite";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { emptyData, type InvitationData, type TemplateId } from "./templates";

export const DATA_DIR = path.join(process.cwd(), "data");
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
    createdAt: r.created_at as string,
  };
}

export function createInvitation(template: TemplateId): Invitation {
  const slug = randomBytes(5).toString("hex");
  const token = randomBytes(24).toString("hex");
  const now = new Date().toISOString();
  getDb()
    .prepare("INSERT INTO invitations (slug, token, template, data, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(slug, token, template, JSON.stringify(emptyData()), now);
  return { slug, token, template, data: emptyData(), paid: false, visits: 0, createdAt: now };
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
  getDb().prepare("UPDATE invitations SET paid = 1 WHERE token = ?").run(token);
}

export function addRsvp(slug: string, r: Omit<Rsvp, "id" | "createdAt">) {
  getDb()
    .prepare(
      "INSERT INTO rsvps (slug, name, attending, guests, allergies, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .run(slug, r.name, r.attending ? 1 : 0, r.guests, r.allergies, r.message, new Date().toISOString());
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
