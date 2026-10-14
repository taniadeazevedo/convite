// Comprobación rápida de que la web está viva y de qué versión está publicada.
// Railway rellena RAILWAY_GIT_COMMIT_SHA con el cambio de GitHub que está desplegado.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ ok: true, version: process.env.RAILWAY_GIT_COMMIT_SHA?.slice(0, 7) ?? "local" });
}
