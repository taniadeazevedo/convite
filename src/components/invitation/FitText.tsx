"use client";

import { useLayoutEffect, useRef } from "react";

// Título que nunca se sale: parte del tamaño máximo y lo reduce hasta que cabe.
// Por defecto va en una sola línea por nombre; con `wrap` puede partir entre palabras
// y solo se reduce si una palabra suelta no cabe.
export default function FitText({
  max,
  as: Tag = "h1",
  wrap = false,
  className = "",
  style,
  children,
}: {
  max: number; // tamaño máximo en px
  as?: "h1" | "h2";
  wrap?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const outer = useRef<HTMLHeadingElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const fit = () => {
      i.style.fontSize = `${max}px`;
      const available = o.clientWidth;
      // con `wrap`, el ancho necesario es el de la palabra más larga
      const needed = wrap ? o.scrollWidth : i.offsetWidth;
      if (needed > available && available > 0) {
        i.style.fontSize = `${Math.floor((max * available) / needed)}px`;
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(o);
    // las tipografías web cambian el ancho al terminar de cargar
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [max, wrap, children]);

  return (
    <Tag ref={outer} className={`w-full ${className}`} style={style}>
      <span ref={inner} className={wrap ? "block" : "inline-block whitespace-nowrap"} style={{ fontSize: max }}>
        {children}
      </span>
    </Tag>
  );
}
