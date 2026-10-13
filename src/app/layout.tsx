import type { Metadata } from "next";
import {
  Bodoni_Moda,
  Caveat,
  Cormorant_Garamond,
  DM_Serif_Display,
  Inter,
  Playfair_Display,
  Space_Mono,
  Syne,
} from "next/font/google";
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
const bodoni = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"], style: ["normal", "italic"], preload: false });
const dmserif = DM_Serif_Display({ variable: "--font-dmserif", subsets: ["latin"], weight: "400", preload: false });
const mono = Space_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "700"], preload: false });
const syne = Syne({ variable: "--font-syne", subsets: ["latin"], weight: ["700", "800"], preload: false });

export const metadata: Metadata = {
  // Dirección pública de la web: la necesitan las imágenes que se muestran al compartir un enlace
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: `${BRAND} · Invitaciones de boda digitales para enviar por WhatsApp`,
  description:
    "Invitaciones de boda digitales con confirmación de asistencia: elegid diseño, poned vuestros datos y enviadla por WhatsApp. Pago único, sin suscripción.",
  openGraph: { siteName: BRAND, locale: "es_ES", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${cormorant.variable} ${playfair.variable} ${hand.variable} ${bodoni.variable} ${dmserif.variable} ${mono.variable} ${syne.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
