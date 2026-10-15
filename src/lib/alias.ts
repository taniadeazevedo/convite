// Dirección pública de la invitación con los nombres de la pareja: invitalia.es/lucia-y-marcos

// Palabras que no pueden usarse porque ya son páginas de la web
const RESERVED = new Set([
  "api", "crear", "cuenta", "demo", "entrar", "i", "legal", "panel", "recuperar", "registro", "restablecer",
  "admin", "invitalia", "verificar", "blog", "guias", "pin",
  "invitaciones-de-boda-digitales", "invitacion-boda-whatsapp", "confirmacion-asistencia-boda",
  "invitaciones-boda-boho", "invitaciones-boda-elegantes", "invitaciones-boda-mediterranea", "album-fotos-boda-qr", "invitaciones-boda-romanticas", "invitaciones-boda-originales", "www", "favicon", "robots", "sitemap", "opengraph-image", "precio", "ayuda", "contacto",
]);

// Quita tildes y símbolos: "Lucía & Marcos" -> "lucia-marcos"
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // tildes y diéresis
    .toLowerCase()
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-") // todo lo que no sea letra o número pasa a guion
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
}

// Solo letras, números y guiones, de 3 a 40 caracteres. Los códigos internos de 10 cifras hex quedan fuera
// para que una dirección elegida nunca se confunda con el identificador de otra invitación.
export function isValidAlias(alias: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(alias) && alias.length >= 3 && alias.length <= 40 && !RESERVED.has(alias) && !/^[a-f0-9]{10}$/.test(alias);
}

// Dirección propuesta a partir de los nombres: "lucia-y-marcos"
export function aliasFromNames(name1: string, name2: string): string {
  const a = slugify(name1);
  const b = slugify(name2);
  return a && b ? `${a}-y-${b}`.slice(0, 40).replace(/-+$/g, "") : a || b;
}
