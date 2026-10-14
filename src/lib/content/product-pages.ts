import { BRAND, PLANS } from "../templates";
import type { ProductPage } from "./types";

// Páginas pensadas para quien ya está buscando algo que comprar.
// Cada una responde a una búsqueda concreta en Google; el texto tiene que ser útil por sí mismo.
export const PRODUCT_PAGES: ProductPage[] = [
  {
    slug: "invitaciones-de-boda-digitales",
    title: "Invitaciones de boda digitales",
    seoTitle: "Invitaciones de boda digitales con confirmación | Invitalia",
    description: `Invitación de boda digital con confirmación de asistencia, mapa, cuenta atrás y álbum de fotos. Diez diseños, lista en minutos. Desde ${PLANS.basico.label}.`,
    eyebrow: "Invitación web para vuestra boda",
    intro:
      "Una invitación de boda digital es una pequeña web con todo lo que vuestros invitados necesitan saber: la fecha, los lugares con su mapa, el horario y un formulario para confirmar si vienen. Se envía con un enlace por WhatsApp o por correo, se abre en cualquier móvil y vosotros veis las respuestas en un panel.",
    blocks: [
      { type: "h2", text: "Qué incluye vuestra invitación" },
      {
        type: "ul",
        items: [
          "Portada con vuestros nombres, la fecha y una foto, en el diseño que elijáis.",
          "Cuenta atrás hasta el día de la boda.",
          "Lugares y horarios de la ceremonia y la celebración, con botón para abrir Google Maps.",
          "Confirmación de asistencia: cada invitado indica si viene, cuántos son y si tiene alguna alergia.",
          "Vuestra historia, una galería de fotos, el cronograma del día, alojamiento y autobuses.",
          "Lista de regalos o número de cuenta, explicado con delicadeza.",
          "Álbum con código QR para que los invitados suban sus fotos el día de la boda.",
        ],
      },
      { type: "p", text: "Cada sección se puede ocultar. Si no hay autobuses o no queréis hablar de regalos, no aparece." },
      { type: "h2", text: "Cómo funciona" },
      {
        type: "ol",
        items: [
          "Elegís uno de los diez diseños. Podéis probarlos todos con vuestros nombres antes de decidir.",
          "Rellenáis vuestros datos y subís vuestras fotos. Lo veis tal cual lo verán vuestros invitados mientras escribís.",
          "La publicáis y recibís un enlace con vuestros nombres, por ejemplo invitalia.es/lucia-y-marcos, listo para compartir.",
        ],
      },
      { type: "p", text: "Crear y editar es gratis, sin registraros. Solo se paga al publicarla, una única vez." },
      { type: "cta", text: "Probad cómo queda con vuestros nombres" },
      { type: "h2", text: "Digital o en papel" },
      {
        type: "p",
        text: "Muchas parejas combinan las dos: unas pocas invitaciones impresas para los abuelos y la digital para todos los demás. La digital tiene tres ventajas difíciles de igualar en papel: las confirmaciones llegan solas a vuestro panel en vez de perseguir a cada invitado, cualquier cambio de última hora (un horario, un autobús) se ve al momento, y no hay gastos de imprenta ni de envío.",
      },
      { type: "h2", text: "Precio" },
      {
        type: "p",
        text: `${PLANS.basico.name}: ${PLANS.basico.label}, con todo lo anterior y ${PLANS.basico.months} meses publicada. ${PLANS.premium.name}: ${PLANS.premium.label}, y además elegís la dirección web, sin «Hecha con ${BRAND}», con más fotos y ${PLANS.premium.months} meses publicada. Pago único, sin suscripción.`,
      },
    ],
    faq: [
      ["¿Mis invitados tienen que instalar algo?", "No. Abren el enlace en el móvil o el ordenador y ya está, como cualquier web."],
      ["¿Puedo cambiar cosas después de enviarla?", "Sí: textos, horarios, lugares y fotos, todas las veces que queráis. Los invitados ven siempre la última versión. Lo único que queda fijado al publicar es el diseño."],
      ["¿Cómo veo quién ha confirmado?", "En vuestro panel tenéis la lista con quién viene, cuántos son y sus alergias, y la podéis descargar en Excel para el catering. Además os llega un correo con cada respuesta."],
      ["¿Cuánto tiempo está publicada?", `${PLANS.basico.months} meses en el plan ${PLANS.basico.name} y ${PLANS.premium.months} en ${PLANS.premium.name}, contando desde que la publicáis.`],
    ],
  },
  {
    slug: "invitacion-boda-whatsapp",
    title: "Invitación de boda para enviar por WhatsApp",
    seoTitle: "Invitación de boda por WhatsApp con confirmación | Invitalia",
    description:
      "Enviad vuestra invitación de boda por WhatsApp: un enlace con vuestra foto y nombres, y vuestros invitados confirman desde el móvil. Diez diseños.",
    eyebrow: "Para enviar por WhatsApp",
    intro:
      "Hoy casi todas las invitaciones de boda acaban pasando por WhatsApp, aunque sea como foto de la invitación en papel. Con una invitación digital, en vez de una foto enviáis un enlace: al pegarlo en el chat aparece con vuestra foto y vuestros nombres, y al abrirlo vuestros invitados tienen toda la información y pueden confirmar en un minuto.",
    blocks: [
      { type: "h2", text: "Por qué un enlace es mejor que una foto" },
      {
        type: "ul",
        items: [
          "Se lee bien en el móvil: el texto se adapta a la pantalla, no hay que ampliar la imagen.",
          "Los lugares tienen botón para abrir el mapa y llegar sin preguntar.",
          "Confirman desde el mismo enlace, sin tener que escribiros uno a uno.",
          "Si cambia algo, el enlace se actualiza solo; la foto, no.",
        ],
      },
      { type: "h2", text: "Cómo enviarla por WhatsApp" },
      {
        type: "ol",
        items: [
          "Cuando la publicáis, en vuestro panel tenéis un botón «Enviar por WhatsApp» que abre WhatsApp con un mensaje ya escrito y el enlace.",
          "Elegís el contacto o el grupo y la enviáis.",
          "WhatsApp muestra una vista previa con vuestra foto de portada y vuestros nombres.",
        ],
      },
      {
        type: "p",
        text: "Un consejo: si la enviáis a un grupo grande, añadid un mensaje personal antes del enlace. Las invitaciones que se reciben con unas palabras propias se abren y se contestan mucho antes que un enlace suelto.",
      },
      { type: "quote", text: "¡Nos casamos! 💍 Nos haría muchísima ilusión que estuvieras. Aquí tienes toda la información y puedes confirmarnos desde el enlace:" },
      { type: "cta", text: "Cread la vuestra y probadla en vuestro WhatsApp" },
      { type: "h2", text: "Y para los que no usan WhatsApp" },
      {
        type: "p",
        text: "El enlace funciona igual por correo, SMS, Instagram o Telegram. Y para las personas mayores que prefieren el papel, podéis imprimir el cartel con código QR o enseñarles la invitación en vuestro móvil: es una web normal.",
      },
    ],
    faq: [
      ["¿Se ve la foto al enviar el enlace?", "Sí. WhatsApp muestra la foto de portada que hayáis subido, vuestros nombres y la fecha."],
      ["¿Puedo enviarla a un grupo?", "Sí, el mismo enlace sirve para todos. Cada invitado confirma por su cuenta y su respuesta llega a vuestro panel."],
      ["¿Qué pasa si alguien confirma dos veces?", "Si lo hace desde el mismo móvil, su respuesta se actualiza en vez de duplicarse."],
    ],
  },
  {
    slug: "confirmacion-asistencia-boda",
    title: "Confirmación de asistencia para bodas, online",
    seoTitle: "Confirmación de asistencia de boda online (RSVP) | Invitalia",
    description:
      "Formulario de confirmación de asistencia para vuestra boda: quién viene, cuántos son y sus alergias, en un panel y en Excel para el catering.",
    eyebrow: "Adiós a perseguir respuestas",
    intro:
      "Lo más pesado de organizar una boda no es elegir el menú: es saber cuántos vais a ser. Con la confirmación de asistencia online, cada invitado responde desde la invitación y vosotros tenéis el recuento al día sin escribir a nadie.",
    blocks: [
      { type: "h2", text: "Qué responde cada invitado" },
      {
        type: "ul",
        items: [
          "Si viene o no.",
          "Cuántos son en total, incluidos acompañantes y niños.",
          "Alergias e intolerancias (podéis desactivar la pregunta si no la necesitáis).",
          "Un mensaje para vosotros, si quiere dejarlo.",
        ],
      },
      { type: "h2", text: "Qué veis vosotros" },
      {
        type: "ul",
        items: [
          "Un panel con el número de personas que vienen y la lista completa.",
          "Un correo cada vez que alguien responde o cambia su respuesta.",
          "La lista en Excel para pasársela al catering o a la finca, con las alergias de cada persona.",
        ],
      },
      { type: "cta", text: "Probad el formulario en una invitación de ejemplo" },
      { type: "h2", text: "Fecha límite para confirmar" },
      {
        type: "p",
        text: "Podéis indicar una fecha límite y aparece junto al formulario. Lo habitual es pedirla entre tres y cuatro semanas antes de la boda, que es cuando la mayoría de fincas y caterings piden el número cerrado.",
      },
      { type: "h2", text: "Datos de vuestros invitados, a salvo" },
      {
        type: "p",
        text: "Solo vosotros veis las respuestas, y la información sobre alergias se trata como un dato sensible: se usa únicamente para organizar vuestra boda y se borra cuando la invitación deja de estar publicada.",
      },
    ],
    faq: [
      ["¿Pueden cambiar su respuesta?", "Sí. Si vuelven a responder desde el mismo móvil, se actualiza la anterior."],
      ["¿Hay límite de invitados?", "No para una boda normal: la invitación admite hasta 500 respuestas."],
      ["¿Y si alguien no tiene móvil?", "Puede confirmar desde el móvil de un familiar o desde cualquier ordenador, porque la invitación es una web normal. Y si os lo dice en persona, apuntadlo en vuestra lista descargada."],
    ],
  },
];

export const getProductPage = (slug: string) => PRODUCT_PAGES.find((p) => p.slug === slug);
