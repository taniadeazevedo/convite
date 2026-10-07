import LegalPage, { H } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";
import { BRAND } from "@/lib/templates";

export const metadata = { title: `Aviso legal · ${BRAND}` };

export default function Page() {
  return (
    <LegalPage title="Aviso legal">
      <H>Titular de la web</H>
      <ul>
        <li>Titular: {LEGAL.owner}</li>
        <li>NIF: {LEGAL.nif}</li>
        <li>Domicilio: {LEGAL.address}</li>
        <li>Contacto: {LEGAL.email}</li>
      </ul>
      <H>Objeto</H>
      <p>
        {BRAND} es un servicio online para crear y compartir invitaciones de boda digitales. El uso de la web
        implica la aceptación de este aviso legal y de los términos y condiciones.
      </p>
      <H>Propiedad intelectual</H>
      <p>
        Los diseños, textos y código de {BRAND} pertenecen a su titular. Los textos y fotografías que cada usuario
        sube a su invitación siguen siendo suyos; el usuario declara tener derecho a utilizarlos.
      </p>
      <H>Responsabilidad</H>
      <p>
        El titular no responde del contenido que los usuarios publiquen en sus invitaciones ni de interrupciones
        del servicio por causas ajenas a su control, sin perjuicio de los derechos que la ley reconoce a los
        consumidores.
      </p>
      <H>Ley aplicable</H>
      <p>Este sitio se rige por la legislación española.</p>
    </LegalPage>
  );
}
