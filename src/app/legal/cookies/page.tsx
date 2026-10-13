import LegalPage, { H } from "@/components/LegalPage";
import { BRAND } from "@/lib/templates";

export const metadata = { title: `Cookies · ${BRAND}` };

export default function Page() {
  return (
    <LegalPage title="Política de cookies">
      <H>Qué cookies usa {BRAND}</H>
      <p>
        Solo cookies técnicas: «sesion», que mantiene iniciada tu sesión cuando entras en tu cuenta, y
        «borrador», que durante 7 días recuerda en tu navegador la invitación que empezaste sin registrarte. Son
        imprescindibles para que el servicio funcione y por eso no requieren consentimiento.
      </p>
      <H>Medición propia</H>
      <p>
        Además, una cookie propia llamada «origen» recuerda durante 30 días únicamente por dónde llegaste a la web
        (por ejemplo, «instagram» o «google»), para saber qué canales funcionan. No contiene ningún identificador
        tuyo, no se comparte con nadie y no sirve para seguirte por otras webs.
      </p>
      <H>Cookies de terceros</H>
      <p>
        {BRAND} no usa cookies de analítica ni de publicidad: las visitas se cuentan en el servidor, de forma
        agregada y sin identificar a nadie. Al pagar, la página de Stripe puede usar sus propias
        cookies para procesar el pago y prevenir el fraude.
      </p>
      <H>Cambios</H>
      <p>
        Si en el futuro se añaden cookies de medición o publicidad, se pedirá tu consentimiento antes de
        instalarlas y se actualizará esta página.
      </p>
    </LegalPage>
  );
}
