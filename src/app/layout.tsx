import type { Metadata } from "next";
import { Caveat, Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import { BRAND } from "@/lib/templates";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});
const hand = Caveat({ variable: "--font-hand", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${BRAND} · Invitaciones de boda digitales`,
  description:
    "Crea tu invitación de boda web en minutos: elige diseño, rellena vuestros datos y recibe las confirmaciones de asistencia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${cormorant.variable} ${playfair.variable} ${hand.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
