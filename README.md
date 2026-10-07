# Convite

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

## Dónde tocar

- Nombre de marca, precio y plantillas: `src/lib/templates.ts`
- Diseño de la invitación: `src/components/Invitation.tsx`
- Los datos (SQLite y fotos) se guardan en `data/`, que no se sube a git.
