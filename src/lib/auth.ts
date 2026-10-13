import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  createSessionRow,
  deleteSession,
  getByToken,
  getSessionUser,
  setOwner,
  type Invitation,
  type User,
} from "./db";

const COOKIE = "sesion";
const DAYS = 60;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  return `${salt.toString("hex")}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, Buffer.from(salt, "hex"), 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// En la base de datos se guarda el hash del identificador de sesión, no el valor de la cookie
const sessionKey = (value: string) => createHash("sha256").update(value).digest("hex");

export async function startSession(userId: number) {
  const value = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + DAYS * 86400_000);
  createSessionRow(sessionKey(value), userId, expires.toISOString());
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });
}

export async function endSession() {
  const store = await cookies();
  const value = store.get(COOKIE)?.value;
  if (value) deleteSession(sessionKey(value));
  store.delete(COOKIE);
}

export async function currentUser(): Promise<User | null> {
  const value = (await cookies()).get(COOKIE)?.value;
  return value ? getSessionUser(sessionKey(value)) : null;
}

// La invitación solo se devuelve a su dueño. Un borrador sin dueño (alguien probando sin cuenta)
// se puede editar con su enlace privado, y se asigna a quien lo abre estando identificado.
export async function ownedInvitation(token: string): Promise<Invitation | null> {
  const user = await currentUser();
  const inv = getByToken(token);
  if (!inv) return null;
  if (!user) return inv.userId === null && !inv.paid ? inv : null;
  if (inv.userId === null) {
    setOwner(token, user.id);
    return { ...inv, userId: user.id };
  }
  return inv.userId === user.id ? inv : null;
}

// Límite sencillo de intentos de acceso por correo (en memoria)
const attempts = new Map<string, { n: number; reset: number }>();
export function tooManyAttempts(key: string): boolean {
  const now = Date.now();
  const a = attempts.get(key);
  if (!a || a.reset < now) {
    attempts.set(key, { n: 1, reset: now + 15 * 60_000 });
    return false;
  }
  a.n += 1;
  return a.n > 10;
}
