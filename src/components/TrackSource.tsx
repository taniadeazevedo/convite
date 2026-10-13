"use client";

import { useEffect } from "react";

// Webs conocidas desde las que suele llegar la gente
const KNOWN: [RegExp, string][] = [
  [/instagram\./, "instagram"],
  [/tiktok\./, "tiktok"],
  [/facebook\.|fb\./, "facebook"],
  [/google\./, "google"],
  [/bing\./, "bing"],
  [/pinterest\.|pin\.it/, "pinterest"],
  [/whatsapp\.|wa\.me/, "whatsapp"],
  [/youtube\.|youtu\.be/, "youtube"],
  [/bodas\.net/, "bodasnet"],
];

// Averigua por dónde ha llegado la visita y se lo dice al servidor, una vez por sesión del navegador.
// Orden: ?utm_source=… o ?ref=… en el enlace (lo que pongáis en anuncios y colaboradores),
// si no, la web de la que viene, y si no hay nada, «directo».
export default function TrackSource() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("origen-enviado")) return;
      sessionStorage.setItem("origen-enviado", "1");
    } catch {
      // sin almacenamiento (modo privado estricto): se cuenta igualmente
    }
    const params = new URLSearchParams(window.location.search);
    let source = params.get("utm_source") || params.get("ref") || "";
    if (!source && document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host !== window.location.hostname) source = KNOWN.find(([re]) => re.test(host))?.[1] ?? host.replace(/^www\./, "").replace(/\./g, "-");
    }
    void fetch("/api/origen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: source || "directo" }),
      keepalive: true,
    }).catch(() => {});
  }, []);
  return null;
}
