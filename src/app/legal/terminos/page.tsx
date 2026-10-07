import LegalPage, { H } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";
import { BRAND, GUEST_PHOTO_LIMIT, PRICE_LABEL } from "@/lib/templates";

export const metadata = { title: `Términos y condiciones · ${BRAND}` };

export default function Page() {
  return (
    <LegalPage title="Términos y condiciones">
      <p>
        Estas condiciones regulan la contratación del servicio {BRAND}, prestado por {LEGAL.owner} (NIF {LEGAL.nif}).
      </p>
      <H>1. El servicio</H>
      <p>
        {BRAND} permite crear una invitación de boda digital a partir de una plantilla, compartirla mediante un
        enlace, recibir confirmaciones de asistencia y recoger fotos de los invitados (hasta {GUEST_PHOTO_LIMIT}{" "}
        por invitación).
      </p>
      <H>2. Cuenta</H>
      <p>
        Para crear una invitación hace falta una cuenta con correo y contraseña. Cada usuario es responsable de
        custodiar su contraseña y de la veracidad de sus datos.
      </p>
      <H>3. Precio y pago</H>
      <p>
        Crear y editar un borrador es gratuito. Publicar una invitación cuesta {PRICE_LABEL} (impuestos incluidos),
        en un pago único por invitación, sin suscripción. El pago se realiza con tarjeta a través de Stripe;{" "}
        {BRAND} no almacena los datos de la tarjeta.
      </p>
      <H>4. Derecho de desistimiento</H>
      <p>
        Al tratarse de un servicio digital que se activa de inmediato, antes de pagar se pide al usuario su
        consentimiento expreso para comenzar la prestación y su reconocimiento de que, una vez publicada la
        invitación, pierde el derecho de desistimiento (art. 103 del Real Decreto Legislativo 1/2007). Hasta ese
        momento no hay ningún cargo.
      </p>
      <H>5. Duración</H>
      <p>
        La invitación publicada permanece accesible durante 12 meses desde la fecha de publicación. Pasado ese
        plazo puede retirarse y sus datos eliminarse, previo aviso por correo.
      </p>
      <H>6. Contenido del usuario</H>
      <p>
        El usuario es responsable de los textos y fotos que sube y de los datos de terceros que incluya. No se
        permite contenido ilícito, ofensivo o que vulnere derechos de otras personas; {BRAND} puede retirar las
        invitaciones que lo incumplan.
      </p>
      <H>7. Datos de los invitados</H>
      <p>
        Respecto de los datos que los invitados introducen al confirmar asistencia (nombre, acompañantes,
        alergias, mensaje) y de las fotos que suben, la pareja es la responsable del tratamiento y {BRAND} actúa
        como encargado, tratándolos solo para prestar el servicio.
      </p>
      <H>8. Disponibilidad</H>
      <p>
        Se trabaja para que el servicio esté disponible de forma continuada, pero pueden producirse
        interrupciones puntuales por mantenimiento o causas ajenas.
      </p>
      <H>9. Reclamaciones</H>
      <p>
        Para cualquier incidencia: {LEGAL.email}. Los consumidores de la UE pueden acudir también a los sistemas
        de resolución de litigios de consumo. Se aplica la legislación española y los juzgados del domicilio del
        consumidor.
      </p>
    </LegalPage>
  );
}
