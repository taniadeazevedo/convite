# Invitalia

Invitaciones de boda digitales en autoservicio: la pareja elige una de las 5 plantillas, rellena sus datos, sube fotos y publica con un pago único.

## Arrancar

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Sin `STRIPE_SECRET_KEY` (ver `.env.example`) el botón «Publicar» activa la invitación sin cobrar, para poder probar el flujo completo.

## Rutas

- `/` landing · `/demo/[plantilla]` ejemplo de cada diseño · `/crear` elegir diseño
- `/panel/[token]` panel privado de la pareja (editar, confirmaciones, fotos de invitados)
- `/panel/[token]/qr` cartel imprimible con QR
- `/i/[slug]` invitación pública · `/i/[slug]/fotos` subida de fotos de invitados

## Cuentas

Cada pareja se registra con correo y contraseña (`/registro`, `/entrar`) y ve sus invitaciones en `/cuenta`. El panel solo lo puede abrir su dueño.

## Antes de publicar la web

- Completar el domicilio en `src/lib/legal.ts` y hacer revisar los textos legales (`/legal/*`).
- Añadir opiniones reales en `src/lib/reviews.ts` (la sección no se muestra mientras esté vacía).
- Configurar las variables de `.env.example` (Stripe, Resend, `SITE_URL`, `DATA_DIR`).

## Publicar en internet (Railway)

La web guarda los datos en un archivo SQLite y las fotos en disco, así que necesita un alojamiento con disco permanente.

1. En railway.com: New Project → Deploy from GitHub repo → este repositorio.
2. En el servicio: Settings → Volumes → añadir un volumen montado en `/data`.
3. Variables: `DATA_DIR=/data`, `SITE_URL=https://tu-dominio`, y las de Stripe y Resend de `.env.example`.
4. Settings → Networking → Generate Domain (o conectar tu dominio).
5. En Stripe: Developers → Webhooks → añadir `https://tu-dominio/api/stripe/webhook` con el evento `checkout.session.completed`, y copiar su secreto a `STRIPE_WEBHOOK_SECRET`.

## Dónde tocar

- Nombre de marca, precio y plantillas: `src/lib/templates.ts`
- Diseño de la invitación: `src/components/Invitation.tsx`
- Los datos (SQLite y fotos) se guardan en `data/`, que no se sube a git.
