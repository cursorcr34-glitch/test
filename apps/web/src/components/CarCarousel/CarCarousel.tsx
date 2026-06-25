"use client";

import { useRef, useState, useCallback } from "react";
import type { Car } from "@/lib/types/car";
import CarCard from "@/components/ui/CarCard";
import styles from "./CarCarousel.module.css";

interface CarCarouselProps {
  cars: Car[];
  title?: string;
}

export default function CarCarousel({ cars, title = "Populyar avtomobillər" }: CarCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  const scroll = useCallback((direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    const slideWidth = track.querySelector("[data-slide]")?.clientWidth ?? 320;
    const gap = 16;
    track.scrollBy({
      left: direction === "left" ? -(slideWidth + gap) : slideWidth + gap,
      behavior: "smooth",
    });
  }, []);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slideWidth = track.querySelector("[data-slide]")?.clientWidth ?? 320;
    const gap = 16;
    const index = Math.round(track.scrollLeft / (slideWidth + gap));
    setActiveDot(Math.min(index, cars.length - 1));
  }, [cars.length]);

  if (cars.length === 0) {
    return null;
  }

  const dotCount = Math.min(cars.length, 5);

  return (
    <section className={styles.section} aria-label={title}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => scroll("left")}
            aria-label="Əvvəlki"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={() => scroll("right")}
            aria-label="Növbəti"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.track} ref={trackRef} onScroll={handleScroll}>
        {cars.map((car) => (
          <div key={car.id} className={styles.slide} data-slide>
            <CarCard car={car} />
          </div>
        ))}
      </div>

      <div className={styles.dots} role="tablist" aria-label="Karusel naviqasiyası">
        {Array.from({ length: dotCount }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.dot} ${activeDot === i ? styles.dotActive : ""}`}
            aria-label={`Slayd ${i + 1}`}
            aria-selected={activeDot === i}
            onClick={() => {
              const track = trackRef.current;
              if (!track) return;
              const slide = track.querySelectorAll("[data-slide]")[i] as HTMLElement;
              slide?.scrollIntoView({ behavior: "smooth", inline: "start" });
            }}
          />
        ))}
      </div>
    </section>
  );
}
