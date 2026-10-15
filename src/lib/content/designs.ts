// Texto propio de la página de ejemplo de cada diseño (/demo/…): para qué boda encaja y qué lo hace distinto.
// Así cada demo dice algo diferente para Google, y no solo la invitación de ejemplo.
export const DESIGN_INFO: Record<string, { ideal: string; detail: string; stylePage: string }> = {
  lino: {
    ideal: "Bodas clásicas y delicadas: iglesias, fincas con jardín, celebraciones de día.",
    detail: "La foto va enmarcada en un arco y los nombres en una serif en cursiva, sobre tonos lino. Es el diseño más versátil: queda bien en casi cualquier boda.",
    stylePage: "invitaciones-boda-elegantes",
  },
  salvia: {
    ideal: "Bodas en el campo, en una masía o al aire libre, con aire artesanal.",
    detail: "Verde salvia, fotos en marco de polaroid y títulos con letra manuscrita, como un álbum hecho a mano.",
    stylePage: "invitaciones-boda-boho",
  },
  terracota: {
    ideal: "Bodas boho: fincas rústicas, flores secas, tonos tierra y mesas largas.",
    detail: "Círculos suaves en terracota y arena y titulares en cursiva. Es el más cálido de los diez.",
    stylePage: "invitaciones-boda-boho",
  },
  editorial: {
    ideal: "Parejas a las que les gusta el diseño limpio: bodas urbanas, de ciudad o muy minimalistas.",
    detail: "Blanco y negro con maquetación de revista: titulares grandes, mucho aire y las fotos en blanco y negro.",
    stylePage: "invitaciones-boda-elegantes",
  },
  medianoche: {
    ideal: "Bodas de noche o de etiqueta: palacios, hoteles, celebraciones con cena de gala.",
    detail: "Fondo oscuro, foto a pantalla completa y detalles dorados. El más elegante para una boda de noche.",
    stylePage: "invitaciones-boda-elegantes",
  },
  riviera: {
    ideal: "Bodas de verano en la costa, en una isla o en cualquier sitio con mar.",
    detail: "Azul mediterráneo y amarillo limón, con aire de postal de vacaciones.",
    stylePage: "invitaciones-boda-mediterranea",
  },
  rosa: {
    ideal: "Bodas románticas: de primavera, con flores, en jardines o en tonos pastel.",
    detail: "Retrato en óvalo y rosa empolvado, con una serif fina. El más romántico de todos.",
    stylePage: "invitaciones-boda-romanticas",
  },
  collage: {
    ideal: "Parejas creativas que quieren algo distinto: bodas informales, de amigos, con mucha personalidad.",
    detail: "Fotos superpuestas como recortes, notas y un rojo intenso. Cuenta vuestra historia como un collage.",
    stylePage: "invitaciones-boda-originales",
  },
  postal: {
    ideal: "Bodas de destino o parejas viajeras: el viaje empieza con la invitación.",
    detail: "Una tarjeta de embarque con vuestros nombres, la fecha como hora de salida y el lugar como destino.",
    stylePage: "invitaciones-boda-mediterranea",
  },
  pop: {
    ideal: "Bodas alegres y llenas de color, para parejas que no quieren nada clásico.",
    detail: "Tipografía enorme, colores vivos y pegatinas. Imposible que pase desapercibida en el móvil.",
    stylePage: "invitaciones-boda-originales",
  },
};
