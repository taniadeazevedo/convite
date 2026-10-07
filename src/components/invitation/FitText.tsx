"use client";

import { useLayoutEffect, useRef } from "react";

// Título que nunca se sale: parte del tamaño máximo y lo reduce hasta que la línea más larga cabe.
export default function FitText({
  max,
  className = "",
  style,
  children,
}: {
  max: number; // tamaño máximo en px
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
      const needed = i.offsetWidth;
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
  }, [max, children]);

  return (
    <h1 ref={outer} className={`w-full ${className}`} style={style}>
      <span ref={inner} className="inline-block whitespace-nowrap" style={{ fontSize: max }}>
        {children}
      </span>
    </h1>
  );
}
