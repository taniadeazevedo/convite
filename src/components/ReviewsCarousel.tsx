"use client";

import { useEffect, useRef, useState } from "react";
import type { Review } from "@/lib/reviews";

// Opiniones en carrusel: se desliza con el dedo en el móvil, con flechas en el ordenador,
// y avanza sola cada pocos segundos mientras nadie lo toca.
export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Lleva el carrusel a la tarjeta número i
  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const n = (i + reviews.length) % reviews.length; // al pasar de la última vuelve a la primera
    const card = el.children[n] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  // Al deslizar a mano, se actualiza qué tarjeta está delante (para los puntos)
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const left = el.scrollLeft + el.offsetLeft;
    const nearest = cards.reduce((best, c, i) => (Math.abs(c.offsetLeft - left) < Math.abs(cards[best].offsetLeft - left) ? i : best), 0);
    setCurrent(nearest);
  };

  // Avance automático cada 6 segundos, salvo si el ratón está encima o la persona prefiere menos movimiento
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => goTo(current + 1), 6000);
    return () => clearInterval(id);
  });

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)}>
      <div
        ref={track}
        onScroll={onScroll}
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carrusel"
      >
        {reviews.map((r) => (
          <figure
            key={r.name}
            className="w-[85%] shrink-0 snap-start rounded-3xl border border-rule bg-card p-7 sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
          >
            <div className="text-brand">★★★★★</div>
            <blockquote className="mt-3">
              <p className="font-serif text-2xl leading-snug">«{r.title}»</p>
              <p className="mt-2 text-soft">{r.text}</p>
            </blockquote>
            <figcaption className="mt-4 text-sm font-medium">{r.name}</figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button onClick={() => goTo(current - 1)} aria-label="Opinión anterior" className="grid h-10 w-10 place-items-center rounded-full border border-rule bg-card">
          ←
        </button>
        <div className="flex gap-2">
          {reviews.map((r, i) => (
            <button
              key={r.name}
              onClick={() => goTo(i)}
              aria-label={`Ver la opinión de ${r.name}`}
              className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-brand" : "w-2 bg-rule"}`}
            />
          ))}
        </div>
        <button onClick={() => goTo(current + 1)} aria-label="Opinión siguiente" className="grid h-10 w-10 place-items-center rounded-full border border-rule bg-card">
          →
        </button>
      </div>
    </div>
  );
}
