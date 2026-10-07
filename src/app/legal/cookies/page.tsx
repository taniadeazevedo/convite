import LegalPage, { H } from "@/components/LegalPage";
import { BRAND } from "@/lib/templates";

export const metadata = { title: `Cookies · ${BRAND}` };

export default function Page() {
  return (
    <LegalPage title="Política de cookies">
      <H>Qué cookies usa {BRAND}</H>
      <p>
        Solo una cookie técnica, llamada «sesion», que mantiene iniciada tu sesión cuando entras en tu cuenta. Es
        imprescindible para que el servicio funcione y por eso no requiere consentimiento.
      </p>
      <H>Cookies de terceros</H>
      <p>
        {BRAND} no usa cookies de analítica ni de publicidad. Al pagar, la página de Stripe puede usar sus propias
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
