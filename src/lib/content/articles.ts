import type { Article } from "./types";

// Guías del blog. Pocas y muy completas: Google premia las que de verdad resuelven la duda.
// Para añadir una, copia la estructura de otra, cambia el «slug» (la dirección) y escribe los bloques.
export const ARTICLES: Article[] = [
  {
    slug: "textos-para-invitaciones-de-boda",
    title: "Textos para invitaciones de boda: ejemplos para copiar",
    seoTitle: "Textos para invitaciones de boda: ejemplos para copiar",
    description:
      "Ejemplos de textos para invitaciones de boda: clásicos, modernos, divertidos, sin niños, para pedir confirmación y para mencionar el regalo con delicadeza.",
    date: "2026-10-14",
    readingMinutes: 7,
    intro:
      "El texto de la invitación es lo primero que leen vuestros invitados y marca el tono de la boda. Aquí tenéis ejemplos por estilos para copiar tal cual o mezclar, y al final las frases para lo más delicado: pedir que confirmen, decir que la boda es sin niños o hablar del regalo.",
    blocks: [
      { type: "h2", text: "Qué tiene que decir el texto de la invitación" },
      {
        type: "ul",
        items: [
          "Quiénes os casáis, con vuestros nombres.",
          "La fecha y la hora.",
          "Dónde: ceremonia y celebración, si son en sitios distintos.",
          "Cómo y hasta cuándo confirmar la asistencia.",
        ],
      },
      {
        type: "p",
        text: "Todo lo demás (autobuses, alojamiento, regalo, código de vestimenta) puede ir aparte. En una invitación digital cada cosa tiene su sección, así que el texto principal puede ser corto y cálido.",
      },

      { type: "h2", text: "Textos clásicos y elegantes" },
      { type: "quote", text: "Tenemos el placer de invitaros a nuestra boda, que celebraremos el sábado 12 de junio a las 18:00 en la ermita de San Isidro. Será un honor compartir este día con vosotros." },
      { type: "quote", text: "Con la ilusión de empezar una nueva etapa, Lucía y Marcos os invitan a acompañarles en el día de su boda." },
      { type: "quote", text: "Nuestras familias tienen la alegría de invitaros al enlace de sus hijos, Lucía y Marcos, que tendrá lugar el próximo 12 de junio." },

      { type: "h2", text: "Textos modernos y cercanos" },
      { type: "quote", text: "Después de diez años, tres pisos y un perro, por fin nos casamos. Y no nos imaginamos el día sin ti." },
      { type: "quote", text: "Nos casamos y queremos celebrarlo con la gente que más queremos. Guarda la fecha: 12 de junio." },
      { type: "quote", text: "Sí, quiero… que vengas a nuestra boda. Te esperamos el 12 de junio para celebrarlo a lo grande." },

      { type: "h2", text: "Textos divertidos" },
      { type: "quote", text: "Hemos decidido aguantarnos para siempre y queremos testigos. Os esperamos el 12 de junio." },
      { type: "quote", text: "Atención: el 12 de junio se acaban dos solterías. Se ruega asistencia, buen humor y zapatos cómodos para bailar." },
      { type: "quote", text: "Tenemos fecha, finca y menú. Solo nos faltas tú. ¡Nos casamos!" },

      { type: "cta", text: "Probad cómo quedan estos textos en vuestra invitación" },

      { type: "h2", text: "Para pedir que confirmen la asistencia" },
      {
        type: "p",
        text: "Dad una fecha concreta y explicad por qué la necesitáis: la gente responde antes cuando entiende que hay un motivo, como cerrar el número con el catering.",
      },
      { type: "quote", text: "Para organizarlo todo bien, nos ayudaría mucho que nos confirmaras tu asistencia antes del 15 de mayo." },
      { type: "quote", text: "Confírmanos si vienes antes del 15 de mayo desde este mismo enlace. ¡Solo te llevará un minuto!" },

      { type: "h2", text: "Para decir que la boda es sin niños" },
      {
        type: "p",
        text: "Es una decisión muy habitual y no hace falta justificarla mucho. Lo importante es decirlo con cariño y con tiempo, para que las familias puedan organizarse.",
      },
      { type: "quote", text: "Queremos que disfrutéis de una noche para vosotros, así que la celebración será solo para adultos. ¡Gracias por entenderlo!" },
      { type: "quote", text: "Aunque adoramos a los peques, hemos pensado la boda solo para adultos. Esperamos que os sirva de excusa para una noche libre." },

      { type: "h2", text: "Para hablar del regalo sin incomodar" },
      {
        type: "p",
        text: "Si preferís dinero, lo más elegante es decirlo como una opción y ligarlo a algo concreto, como el viaje o la casa. Y siempre dejar claro que lo importante es que vengan.",
      },
      { type: "quote", text: "Lo más importante para nosotros es que nos acompañéis. Si además queréis tener un detalle, os dejamos nuestro número de cuenta para ayudarnos con el viaje de novios." },
      { type: "quote", text: "Vuestra presencia es el mejor regalo. Para quien quiera colaborar con nuestra luna de miel, aquí tiene el número de cuenta." },

      { type: "h2", text: "Si os casáis lejos" },
      { type: "quote", text: "Nos casamos en Menorca y sabemos que es un viaje. Por eso os avisamos con tiempo: guardad el 12 de junio y aquí tenéis todo para organizaros." },

      { type: "h2", text: "Tres consejos para que el texto funcione" },
      {
        type: "ol",
        items: [
          "Que suene a vosotros. Si sois una pareja con humor, que se note; si sois más formales, también.",
          "Corto en la portada. Dos o tres frases bastan; el resto de información va en su sección.",
          "Leedlo en voz alta. Si suena raro dicho, suena raro escrito.",
        ],
      },
    ],
    faq: [
      ["¿Hay que poner los nombres de los padres?", "No es obligatorio. Es una costumbre de las bodas más tradicionales; hoy lo habitual es que inviten los propios novios."],
      ["¿Se pone el número de cuenta en la invitación?", "Cada vez es más común, sobre todo en invitaciones digitales, donde puede ir en una sección aparte y discreta en vez de en el texto principal."],
      ["¿Tú o vosotros?", "Depende de a quién se la enviéis. En una invitación digital que va a muchas personas, «vosotros» funciona para parejas y familias, y «tú» queda más cercano para amigos."],
    ],
  },
  {
    slug: "cuando-enviar-invitaciones-de-boda",
    title: "¿Cuándo enviar las invitaciones de boda? Calendario completo",
    seoTitle: "Cuándo enviar las invitaciones de boda: calendario",
    description:
      "Cuándo mandar el save the date, las invitaciones y el recordatorio, y qué fecha límite poner para confirmar. Calendario para bodas en España, con o sin viaje.",
    date: "2026-10-14",
    readingMinutes: 5,
    intro:
      "Enviarlas demasiado pronto hace que se olviden; demasiado tarde, que la gente ya tenga planes. Este es el calendario que funciona para la mayoría de bodas, y cómo ajustarlo si os casáis lejos o en temporada alta.",
    blocks: [
      { type: "h2", text: "El calendario, de un vistazo" },
      {
        type: "ul",
        items: [
          "Entre 6 y 12 meses antes: el «save the date», si la boda es lejos o en fechas muy demandadas.",
          "Entre 2 y 3 meses antes: la invitación con toda la información.",
          "Entre 3 y 4 semanas antes: fecha límite para confirmar.",
          "Una semana antes de esa fecha límite: un recordatorio a quien no haya respondido.",
          "Unos días antes de la boda: un último mensaje con horarios y autobuses.",
        ],
      },

      { type: "h2", text: "El «save the date»: cuándo merece la pena" },
      {
        type: "p",
        text: "Es un aviso para que reserven la fecha, sin todos los detalles. No siempre hace falta, pero es casi obligatorio en tres casos: si os casáis en otra ciudad o en el extranjero, si la boda cae en un puente o en pleno verano, o si muchos invitados tienen que pedir días libres.",
      },
      { type: "quote", text: "¡Guarda la fecha! Nos casamos el 12 de junio en Menorca. La invitación, con todos los detalles, llegará más adelante." },

      { type: "h2", text: "La invitación: entre dos y tres meses antes" },
      {
        type: "p",
        text: "Es el punto de equilibrio: hay margen para organizarse y la fecha está lo bastante cerca como para no olvidarse. Si la boda es de destino, adelantadla a cuatro meses para que puedan reservar vuelos y alojamiento a buen precio.",
      },
      { type: "cta", text: "Preparad la invitación ahora y enviadla cuando toque" },

      { type: "h2", text: "La fecha límite para confirmar" },
      {
        type: "p",
        text: "Poned la fecha que os pida la finca o el catering para cerrar el número de cubiertos, y restadle una semana de margen. Normalmente queda entre tres y cuatro semanas antes de la boda.",
      },
      {
        type: "p",
        text: "Dadla como una fecha concreta («antes del 15 de mayo») y no como un plazo («en las próximas semanas»): las fechas concretas se cumplen mucho más.",
      },

      { type: "h2", text: "El recordatorio" },
      {
        type: "p",
        text: "Siempre hay quien se olvida de contestar. Una semana antes de la fecha límite, revisad quién ha confirmado y escribid solo a los que faltan, con un mensaje corto y sin reproches.",
      },
      { type: "quote", text: "¡Hola! Estamos cerrando números para la boda. ¿Nos confirmas si vienes antes del viernes? Aquí tienes el enlace." },

      { type: "h2", text: "Si la invitación es digital" },
      {
        type: "p",
        text: "Las fechas son las mismas, pero hay dos ventajas: podéis enviarla en cuanto tengáis lo esencial y completar el resto después (los cambios se ven al momento), y sabéis en todo momento quién ha confirmado sin llevar la cuenta a mano.",
      },
    ],
    faq: [
      ["¿Se puede enviar la invitación con más de tres meses?", "Sí, sobre todo si la boda es de destino o en temporada alta. Solo conviene mandar un recordatorio más cerca de la fecha."],
      ["¿Y si alguien no confirma a tiempo?", "Escribidle directamente. A menudo no es desinterés, sino que se le pasó."],
      ["¿Cuándo se invita a los que se apuntan tarde?", "Si hay bajas, se puede invitar a más gente hasta unas cinco o seis semanas antes. Después ya se nota que es una invitación de última hora."],
    ],
  },
];

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
