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

  {
    slug: "invitaciones-boda-boho",
    title: "Invitaciones de boda boho",
    seoTitle: "Invitaciones de boda boho digitales | Invitalia",
    description:
      "Invitaciones de boda boho en digital: tonos tierra, formas orgánicas y letra manuscrita. Con confirmación de asistencia y mapa. Probadlas con vuestros nombres.",
    eyebrow: "Estilo boho",
    intro:
      "Las bodas boho tienen algo de campo, de tarde larga y de mesa compartida: tonos tierra, flores secas, telas naturales y nada demasiado rígido. La invitación es lo primero que lo anuncia, así que conviene que respire ese mismo aire.",
    featured: ["terracota", "salvia", "lino"],
    blocks: [
      { type: "h2", text: "Los diseños con más alma boho" },
      {
        type: "ul",
        items: [
          "Terracota: círculos suaves en tonos tierra y titulares en cursiva. Es el más boho de todos.",
          "Salvia: verde salvia, fotos tipo polaroid y letra manuscrita, como un álbum hecho a mano.",
          "Lino: más sobrio, con la foto en arco y una serif elegante; funciona en bodas boho más depuradas.",
        ],
      },
      { type: "h2", text: "Ideas para que el texto también sea boho" },
      {
        type: "p",
        text: "El estilo boho pide un tono cercano. Funcionan bien las frases cortas, hablar en primera persona y alguna referencia al lugar o a la estación.",
      },
      { type: "quote", text: "Nos casamos al aire libre, entre olivos y con los pies en la hierba. Ven con ganas de celebrar y con calzado cómodo." },
      { type: "quote", text: "Una tarde de septiembre, una finca en el campo y la gente que más queremos. Solo faltas tú." },
      { type: "cta", text: "Probad los diseños boho con vuestros nombres" },
      { type: "h2", text: "Detalles prácticos que suelen tener las bodas boho" },
      {
        type: "p",
        text: "Muchas se celebran en fincas fuera de la ciudad, así que la sección de autobuses y alojamiento cobra importancia. Y si la ceremonia es al aire libre, el cronograma ayuda a que los invitados sepan a qué hora conviene llegar y qué ponerse.",
      },
    ],
    faq: [
      ["¿Puedo usar mis propias fotos?", "Sí. Subís vuestras fotos y el diseño las enmarca con su estilo: en polaroid, en círculo o en arco, según el que elijáis."],
      ["¿Puedo cambiar de diseño antes de enviarla?", "Sí, todas las veces que queráis sin perder lo escrito. Al publicarla, el diseño queda fijado."],
    ],
  },
  {
    slug: "invitaciones-boda-elegantes",
    title: "Invitaciones de boda elegantes y minimalistas",
    seoTitle: "Invitaciones de boda elegantes y minimalistas | Invitalia",
    description:
      "Invitaciones de boda elegantes en digital: tipografía serif, mucho aire y fotos en blanco y negro. Con confirmación de asistencia. Probadlas gratis.",
    eyebrow: "Elegante y minimalista",
    intro:
      "Una invitación elegante no necesita adornos: le bastan buena tipografía, espacio en blanco y una foto bien elegida. Si vuestra boda es de noche, en un palacio o simplemente os gusta lo sobrio, estos son los diseños que mejor lo transmiten.",
    featured: ["lino", "editorial", "medianoche"],
    blocks: [
      { type: "h2", text: "Tres formas de ser elegante" },
      {
        type: "ul",
        items: [
          "Lino: tonos crema, foto en arco y serif en cursiva. Clásico y delicado.",
          "Editorial: blanco y negro, como la portada de una revista. Minimalista y moderno.",
          "Medianoche: fondo oscuro y foto a pantalla completa. Pensado para bodas de noche o de etiqueta.",
        ],
      },
      { type: "h2", text: "Qué hace que una invitación parezca elegante" },
      {
        type: "ul",
        items: [
          "Pocos colores: uno de fondo, uno para el texto y, como mucho, un acento.",
          "Textos cortos. La elegancia está en lo que no se dice.",
          "Una sola foto buena antes que muchas regulares.",
          "Ocultar las secciones que no uséis: una invitación con huecos vacíos pierde mucho.",
        ],
      },
      { type: "quote", text: "Tenemos el placer de invitaros a celebrar nuestra boda el sábado 12 de junio a las siete de la tarde." },
      { type: "cta", text: "Probad los diseños elegantes con vuestros nombres" },
      { type: "h2", text: "Código de vestimenta" },
      {
        type: "p",
        text: "Si la boda es de etiqueta o de cóctel, decidlo claramente en la sección de preguntas frecuentes de la invitación. Es de las dudas que más mensajes os ahorrará.",
      },
    ],
    faq: [
      ["¿Se puede quitar la cuenta atrás o la galería?", "Sí. Cada sección tiene un interruptor y, si la ocultáis, no aparece."],
      ["¿Sale la marca de Invitalia?", "En el plan Esencial aparece una línea discreta al final. En Premium no aparece."],
    ],
  },
  {
    slug: "invitaciones-boda-mediterranea",
    title: "Invitaciones para bodas mediterráneas y en la playa",
    seoTitle: "Invitaciones de boda mediterránea y en la playa | Invitalia",
    description:
      "Invitaciones de boda de estilo mediterráneo para bodas de verano, en la costa o en una isla. Con mapa, alojamiento y confirmación. Probadlas gratis.",
    eyebrow: "Verano y mar",
    intro:
      "Azul, limones, sol de tarde y el mar de fondo. Si os casáis en la costa, en una isla o simplemente en pleno verano, la invitación puede empezar a contar ese viaje antes de que vuestros invitados hagan la maleta.",
    featured: ["riviera", "postal"],
    blocks: [
      { type: "h2", text: "Los diseños más mediterráneos" },
      {
        type: "ul",
        items: [
          "Riviera: azul y amarillo limón, como una postal de la costa en verano.",
          "Postal: una tarjeta de embarque con vuestros nombres. Perfecta si la boda implica viajar.",
        ],
      },
      { type: "h2", text: "Lo que más agradecen los invitados en una boda de destino" },
      {
        type: "ul",
        items: [
          "Saber la fecha con mucha antelación: lo ideal es avisar entre 6 y 12 meses antes.",
          "Recomendaciones de alojamiento cerca del lugar de la boda.",
          "Cómo llegar: aeropuerto o puerto más cercano y si habrá autobuses.",
          "El horario del día, para saber si da tiempo a ir a la playa antes.",
        ],
      },
      {
        type: "p",
        text: "Todo eso cabe en las secciones de alojamiento, transporte y cronograma de la invitación, y lo podéis ir completando poco a poco: los cambios se ven al momento.",
      },
      { type: "cta", text: "Probad los diseños de verano con vuestros nombres" },
      { type: "quote", text: "Nos casamos frente al mar. Guardad el 12 de junio, preparad la maleta y venid con ganas de celebrar." },
    ],
    faq: [
      ["¿Puedo enviarla antes de tener todos los detalles?", "Sí. Podéis publicarla con la fecha y el lugar y añadir el alojamiento o los autobuses más adelante."],
      ["¿Funciona para invitados de fuera de España?", "El enlace se abre desde cualquier país. Los textos de la invitación los escribís vosotros, así que podéis incluir una versión en otro idioma en el mensaje de bienvenida."],
    ],
  },
  {
    slug: "album-fotos-boda-qr",
    title: "Álbum de fotos de boda con código QR",
    seoTitle: "Álbum de fotos de boda con código QR para invitados | Invitalia",
    description:
      "Recoged las fotos que hacen vuestros invitados con un código QR en las mesas. Sin apps ni registro: escanean, suben y os llegan solo a vosotros.",
    eyebrow: "Las fotos de todos, en un sitio",
    intro:
      "En cada boda se hacen cientos de fotos con el móvil, y la mayoría se quedan en el carrete de los invitados. Con un código QR en las mesas, cualquiera puede subir las suyas en un momento y os llegan directamente a vosotros.",
    blocks: [
      { type: "h2", text: "Cómo funciona" },
      {
        type: "ol",
        items: [
          "Al publicar vuestra invitación, en vuestro panel tenéis un cartel con el código QR, con el mismo diseño que la invitación.",
          "Lo imprimís en tamaño A5 y lo ponéis en las mesas, en la entrada o junto al photocall.",
          "Los invitados apuntan con la cámara del móvil, eligen sus fotos y las suben. No necesitan instalar nada ni registrarse.",
          "Las fotos aparecen en vuestro panel y las podéis descargar una a una cuando queráis.",
        ],
      },
      { type: "h2", text: "Ventajas frente a un grupo de WhatsApp" },
      {
        type: "ul",
        items: [
          "Las fotos se guardan en buena resolución, sin la compresión que sufren al reenviarlas por WhatsApp.",
          "No hace falta tener el número de cada invitado ni crear un grupo enorme.",
          "Solo las veis vosotros, no todos los invitados.",
        ],
      },
      { type: "cta", text: "Cread vuestra invitación con álbum incluido" },
      { type: "h2", text: "Consejos para que la gente suba fotos" },
      {
        type: "ul",
        items: [
          "Poned varios carteles: uno por mesa funciona mucho mejor que uno solo en la entrada.",
          "Que el maestro de ceremonias o el DJ lo recuerden durante la fiesta.",
          "Al día siguiente, enviad el enlace de la invitación con un mensaje de agradecimiento: la sección de fotos sigue activa.",
        ],
      },
    ],
    faq: [
      ["¿Cuántas fotos pueden subir?", `Hasta ${PLANS.basico.guestPhotos} por boda en el plan ${PLANS.basico.name} y hasta ${PLANS.premium.guestPhotos} en ${PLANS.premium.name}.`],
      ["¿Los invitados ven las fotos de los demás?", "No. Solo vosotros las veis, desde vuestro panel."],
      ["¿Hasta cuándo pueden subirlas?", `Mientras la invitación esté publicada: ${PLANS.basico.months} meses en ${PLANS.basico.name} y ${PLANS.premium.months} en ${PLANS.premium.name}.`],
    ],
  },
];

export const getProductPage = (slug: string) => PRODUCT_PAGES.find((p) => p.slug === slug);
