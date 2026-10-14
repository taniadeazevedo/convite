import type { Article } from "./types";

// Guías del blog. Pocas y muy completas: Google premia las que de verdad resuelven la duda.
// Para añadir una, copia la estructura de otra, cambia el «slug» (la dirección) y escribe los bloques.
export const ARTICLES: Article[] = [
  {
    slug: "papeles-para-casarse-en-espana",
    title: "Papeles para casarse en España: boda civil y por la iglesia",
    seoTitle: "Papeles para casarse en España: civil y por la iglesia",
    description:
      "Qué documentos necesitáis para casaros por lo civil o por la iglesia en España, dónde se piden, con cuánta antelación empezar y qué cambia si sois extranjeros o divorciados.",
    date: "2026-10-14",
    readingMinutes: 8,
    intro:
      "El papeleo es lo que más se retrasa y lo que más nervios da. La buena noticia es que siempre sigue el mismo esquema: reunir unos documentos, abrir un expediente y esperar a que lo aprueben. Aquí tenéis el mapa completo para que sepáis qué pedir, dónde y cuándo.",
    blocks: [
      { type: "h2", text: "Lo primero: cuánta antelación necesitáis" },
      {
        type: "ul",
        items: [
          "Boda civil: empezad el expediente entre 4 y 6 meses antes. En ciudades grandes las citas del Registro Civil tardan.",
          "Boda por la iglesia: unos 6 meses antes, porque además del expediente hay que hacer el cursillo prematrimonial.",
          "Si alguno de los dos es extranjero o nació fuera de España: sumad dos o tres meses, por las legalizaciones y traducciones.",
        ],
      },
      {
        type: "p",
        text: "Ojo con no empezar demasiado pronto: varios documentos tienen fecha de caducidad (normalmente entre tres meses y un año, según la oficina) y, una vez abierto el expediente, la boda suele tener que celebrarse en un plazo máximo, que en muchos registros es de un año.",
      },

      { type: "h2", text: "Boda civil: el expediente matrimonial" },
      {
        type: "p",
        text: "Para casaros por lo civil hay que tramitar antes un expediente matrimonial, que sirve para comprobar que no hay ningún impedimento legal (por ejemplo, un matrimonio anterior sin disolver). Se puede hacer en el Registro Civil o ante notario.",
      },
      { type: "h3", text: "Dónde se tramita" },
      {
        type: "ul",
        items: [
          "En el Registro Civil del municipio donde está empadronado alguno de los dos. Hay que pedir cita previa; esa cita es solo para abrir el expediente, no es la boda.",
          "Ante notario: os dirigís al colegio notarial de vuestra comunidad, que os asigna un notario. El notario se encarga también de inscribir después el matrimonio. Tiene coste, pero suele ser más rápido.",
        ],
      },
      { type: "h3", text: "Documentos habituales" },
      {
        type: "ul",
        items: [
          "DNI, NIE o pasaporte de los dos (original y copia).",
          "Certificado literal de nacimiento de cada uno, que se pide en el Registro Civil donde nacisteis (también por internet en la sede electrónica del Ministerio de Justicia).",
          "Certificado de empadronamiento, que en muchos registros debe cubrir los últimos dos años.",
          "Declaración de estado civil (soltero, divorciado o viudo), que suele firmarse en el propio registro.",
          "Uno o dos testigos mayores de edad que os conozcan, con su documento de identidad.",
        ],
      },
      {
        type: "p",
        text: "Cada Registro Civil publica su lista exacta y puede pedir algo más o fijar otros plazos de validez. Antes de pedir cita, consultad la del vuestro: os ahorrará volver.",
      },
      { type: "h3", text: "Quién os puede casar" },
      {
        type: "p",
        text: "Una vez aprobado el expediente, podéis casaros ante el encargado del Registro Civil, un juez de paz, el alcalde o un concejal en quien delegue, o un notario. Si queréis casaros en una finca, preguntad antes al ayuntamiento: no todos ofician fuera de sus instalaciones.",
      },

      { type: "cta", text: "Mientras llega el papeleo, preparad la invitación" },

      { type: "h2", text: "Boda por la iglesia" },
      {
        type: "p",
        text: "Para una boda católica se abre un expediente matrimonial en la parroquia de alguno de los dos, una vez reservada la fecha en la iglesia donde os vais a casar. La propia parroquia se encarga después de que el matrimonio se inscriba en el Registro Civil, así que no tenéis que hacer una boda civil aparte.",
      },
      { type: "h3", text: "Documentos habituales" },
      {
        type: "ul",
        items: [
          "DNI de los dos.",
          "Partida de bautismo reciente de cada uno, que se pide en la parroquia donde os bautizaron. Muchas diócesis la piden legalizada por el obispado.",
          "Certificado literal de nacimiento.",
          "Fe de vida y estado (certificado de estado civil), del Registro Civil.",
          "Certificado del cursillo prematrimonial.",
          "Algunas parroquias piden además el certificado de confirmación.",
        ],
      },
      { type: "h3", text: "El cursillo prematrimonial" },
      {
        type: "p",
        text: "Es obligatorio y lo organizan las parroquias o la diócesis, normalmente en varias sesiones o en un fin de semana. Las plazas se llenan, sobre todo antes de la temporada de bodas: apuntaos con tiempo.",
      },

      { type: "h2", text: "Casos especiales" },
      {
        type: "ul",
        items: [
          "Divorciados: hay que aportar la sentencia de divorcio inscrita. Para casarse por la iglesia después de una boda religiosa anterior hace falta la nulidad eclesiástica.",
          "Viudos: certificado de defunción del cónyuge anterior.",
          "Extranjeros o nacidos fuera de España: los documentos de vuestro país suelen necesitar apostilla o legalización y traducción jurada. Algunos documentos de la Unión Europea están exentos; preguntad en el registro.",
        ],
      },

      { type: "h2", text: "Calendario resumido" },
      {
        type: "ol",
        items: [
          "6 meses antes: reservar fecha (iglesia o ayuntamiento) y pedir cita para el expediente.",
          "5 meses antes: reunir documentos y, si es religiosa, apuntarse al cursillo.",
          "4 meses antes: abrir el expediente.",
          "1 o 2 meses antes: expediente aprobado; confirmar quién os casa y el lugar.",
          "Después de la boda: comprobar que el matrimonio está inscrito y pedir el certificado de matrimonio.",
        ],
      },
      {
        type: "p",
        text: "Esta guía resume los requisitos habituales, pero cada Registro Civil, notaría y parroquia puede pedir documentos distintos o fijar otros plazos. Confirmadlo siempre en la oficina que os corresponda.",
      },
    ],
    faq: [
      ["¿Se puede uno casar por lo civil sin estar empadronado en esa ciudad?", "El expediente se abre donde está empadronado alguno de los dos, pero luego se puede celebrar la boda en otro municipio pidiéndolo a ese ayuntamiento o juzgado."],
      ["¿Casarse ante notario cuesta dinero?", "Sí, a diferencia del Registro Civil, que es gratuito. El precio depende del notario y de si la boda se celebra en su despacho o fuera."],
      ["¿Hay que hacer boda civil si nos casamos por la iglesia?", "No. El matrimonio católico tiene efectos civiles en España; la parroquia se encarga de que se inscriba en el Registro Civil."],
    ],
  },
  {
    slug: "checklist-boda-mes-a-mes",
    title: "Checklist de boda: qué hacer y cuándo, mes a mes",
    seoTitle: "Checklist de boda mes a mes: qué hacer y cuándo",
    description:
      "Lista de tareas para organizar vuestra boda desde 12 meses antes hasta el día después: presupuesto, finca, papeleo, invitaciones, proveedores y última semana.",
    date: "2026-10-14",
    readingMinutes: 7,
    intro:
      "Organizar una boda son decenas de decisiones, pero no todas a la vez. Esta es la lista en el orden en que conviene hacerlas, para que nada se os escape y no tengáis que correr al final. Si os casáis en menos de un año, empezad por arriba y comprimid los plazos.",
    blocks: [
      { type: "h2", text: "12 meses antes" },
      {
        type: "ul",
        items: [
          "Fijad el presupuesto total y quién aporta qué. Todo lo demás depende de esta cifra.",
          "Haced una primera lista de invitados: el número de personas decide el tamaño del sitio y la mitad del presupuesto.",
          "Elegid la fecha y reservad el lugar de la celebración. Las fincas buenas en primavera y verano se reservan con más de un año.",
          "Si os casáis lejos o en temporada alta, enviad el «save the date».",
        ],
      },
      { type: "h2", text: "Entre 10 y 8 meses antes" },
      {
        type: "ul",
        items: [
          "Reservad los proveedores que más se agotan: fotógrafo, catering (si la finca no lo incluye) y música.",
          "Si la boda es religiosa, reservad la iglesia.",
          "Empezad a buscar el vestido y el traje: entre pruebas y arreglos, algunos tardan seis meses.",
        ],
      },
      { type: "h2", text: "Entre 7 y 5 meses antes" },
      {
        type: "ul",
        items: [
          "Papeleo: pedid cita para el expediente matrimonial y reunid los documentos.",
          "Si es por la iglesia, apuntaos al cursillo prematrimonial.",
          "Contratad flores, decoración y, si hace falta, autobuses para los invitados.",
          "Reservad el viaje de novios.",
          "Preparad la invitación: diseño, textos y toda la información práctica.",
        ],
      },
      { type: "cta", text: "Preparad la invitación ahora y enviadla cuando toque" },
      { type: "h2", text: "Entre 3 y 2 meses antes" },
      {
        type: "ul",
        items: [
          "Enviad las invitaciones, con una fecha límite para confirmar.",
          "Prueba de menú con el catering.",
          "Elegid los anillos y encargad los detalles para invitados, si vais a tenerlos.",
          "Si queréis, abrid la lista de bodas o decidid cómo indicaréis el número de cuenta.",
        ],
      },
      { type: "h2", text: "1 mes antes" },
      {
        type: "ul",
        items: [
          "Cerrad el número de invitados y escribid a quien no haya confirmado.",
          "Pasad al catering la lista definitiva con las alergias e intolerancias.",
          "Haced el plano de mesas (seating plan).",
          "Últimas pruebas de vestido y traje.",
          "Repasad el cronograma del día con la finca, el fotógrafo y la música.",
        ],
      },
      { type: "h2", text: "La última semana" },
      {
        type: "ul",
        items: [
          "Confirmad horarios con todos los proveedores y dejad sus teléfonos a una persona de confianza.",
          "Enviad a los invitados un último mensaje con horarios, ubicación y autobuses.",
          "Preparad los pagos pendientes en sobres o transferencias programadas.",
          "Imprimid los carteles con código QR para que los invitados suban sus fotos.",
          "Delegad: el día de la boda, vuestro único trabajo es disfrutarla.",
        ],
      },
      { type: "h2", text: "Después de la boda" },
      {
        type: "ul",
        items: [
          "Comprobad que el matrimonio está inscrito y pedid el certificado.",
          "Recopilad las fotos de los invitados y mandad un mensaje de agradecimiento.",
          "Si cambiáis de estado civil a efectos de empresa, banco o Hacienda, actualizadlo.",
        ],
      },
    ],
    faq: [
      ["¿Se puede organizar una boda en seis meses?", "Sí, sobre todo si sois flexibles con la fecha o el día de la semana. Lo más difícil es conseguir finca y fotógrafo en temporada alta; empezad por ahí."],
      ["¿Qué es lo que más se suele olvidar?", "El papeleo y las alergias de los invitados. Por eso conviene empezar el expediente pronto y preguntar por las alergias en la propia confirmación de asistencia."],
    ],
  },
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
