// Opiniones de parejas. Añade aquí solo opiniones reales, con permiso de quien las escribe.
// Mientras la lista esté vacía, la sección no aparece en la landing.
export type Review = { name: string; title: string; text: string };

// Estas cinco son de parejas a las que se les hizo su web de boda en el proyecto anterior a Invitalia;
// la landing lo indica así. Cuando lleguen opiniones de clientes de Invitalia, añádelas arriba.
export const REVIEWS: Review[] = [
  {
    name: "Laura y Dani",
    title: "Nos facilitó la vida.",
    text: "Llevar el control de las confirmaciones, las alergias y el autobús desde la web fue un alivio total. Súper fácil de usar para todo el mundo.",
  },
  {
    name: "Marta y Javi",
    title: "Un acierto total.",
    text: "La web quedó preciosa, elegante y muy intuitiva. A los invitados les encantó tener la localización, la cuenta atrás y toda la info a mano.",
  },
  {
    name: "Sofía y Álex",
    title: "¡A la gente le encantó!",
    text: "Captaron la idea a la primera. La web quedó moderna, práctica y los invitados nos felicitaron un montón.",
  },
  {
    name: "Lucía y Marc",
    title: "Súper intuitiva.",
    text: "Incluso a la gente más mayor le resultó facilísimo confirmar asistencia y ver los detalles del evento. Un 10 en diseño y utilidad.",
  },
  {
    name: "Elena y Pablo",
    title: "La mejor decisión.",
    text: "Nos ahorró muchísimo tiempo de organización y el diseño quedó espectacular. Recomendable 100%.",
  },
];
