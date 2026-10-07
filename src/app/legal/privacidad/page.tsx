import LegalPage, { H } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";
import { BRAND } from "@/lib/templates";

export const metadata = { title: `Política de privacidad · ${BRAND}` };

export default function Page() {
  return (
    <LegalPage title="Política de privacidad">
      <H>Responsable</H>
      <p>
        {LEGAL.owner}, NIF {LEGAL.nif}. Contacto: {LEGAL.email}.
      </p>
      <H>Qué datos se tratan y para qué</H>
      <ul>
        <li>
          <strong>Usuarios (parejas):</strong> correo y contraseña cifrada, para gestionar la cuenta; contenido de
          la invitación (nombres, fecha, lugares, textos, fotos); y datos del pago, que gestiona Stripe.
        </li>
        <li>
          <strong>Invitados:</strong> nombre, asistencia, número de acompañantes, alergias o intolerancias si las
          indican, mensaje y fotos que suban. Se recogen por cuenta de la pareja que envía la invitación, que es
          quien decide para qué se usan (organizar la boda).
        </li>
      </ul>
      <H>Base legal</H>
      <p>
        La ejecución del contrato con el usuario; y, para los datos de los invitados (incluidas las alergias, que
        son datos de salud), el consentimiento de quien los facilita al enviar el formulario.
      </p>
      <H>Quién accede a los datos</H>
      <p>
        Solo la pareja ve las respuestas y fotos de sus invitados. Los datos se alojan en proveedores que actúan
        como encargados del tratamiento (alojamiento web y Stripe para los pagos). No se venden ni se ceden a
        terceros con fines publicitarios.
      </p>
      <H>Conservación</H>
      <p>
        Los datos de una invitación se conservan mientras esté activa y se eliminan como máximo 12 meses después
        de su publicación, o antes si el usuario lo solicita. Los datos de facturación se conservan los plazos que
        exige la ley.
      </p>
      <H>Derechos</H>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad
        escribiendo a {LEGAL.email}. Si eres invitado, también puedes dirigirte a la pareja que te envió la
        invitación. Tienes derecho a reclamar ante la Agencia Española de Protección de Datos (aepd.es).
      </p>
    </LegalPage>
  );
}
