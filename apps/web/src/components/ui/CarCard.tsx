"use client";

import Link from "next/link";
import Image from "next/image";
import type { Car } from "@/lib/types/car";
import { formatPrice } from "@/lib/utils/format";
import { CATEGORY_LABELS } from "@/lib/data/cars";
import styles from "./CarCard.module.css";

interface CarCardProps {
  car: Car;
  variant?: "carousel" | "grid";
  onCompare?: (carId: string) => void;
  isCompared?: boolean;
  showCompare?: boolean;
}

export default function CarCard({
  car,
  variant = "carousel",
  onCompare,
  isCompared = false,
  showCompare = false,
}: CarCardProps) {
  return (
    <Link
      href={`/cars/${car.id}`}
      className={`${styles.card} ${variant === "grid" ? styles.gridCard : ""} ${isCompared ? styles.selected : ""}`}
    >
      <div className={styles.imageWrap}>
        <Image
          src={car.image}
          alt={car.name}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className={styles.badge}>{CATEGORY_LABELS[car.category]}</span>
        <span className={styles.rating}>
          <span className={styles.star}>★</span>
          {car.rating}
        </span>
        {showCompare && onCompare && (
          <button
            type="button"
            className={`${styles.compareBtn} ${isCompared ? styles.compareActive : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCompare(car.id);
            }}
            aria-label={isCompared ? "Müqayisədən çıxar" : "Müqayisəyə əlavə et"}
            aria-pressed={isCompared}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M4 4l5 5" />
            </svg>
          </button>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{car.name}</h3>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            {car.specs.seats} nəfər
          </span>
          <span className={styles.metaItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
            </svg>
            {car.specs.transmission === "automatic" ? "Avtomat" : "Mexaniki"}
          </span>
          <span className={styles.metaItem}>{car.location}</span>
        </div>
        <div className={styles.footer}>
          <div>
            <span className={styles.price}>{formatPrice(car.pricePerDay)}</span>
            <span className={styles.priceUnit}>/gün</span>
          </div>
          <span className={styles.cta}>Detallar →</span>
        </div>
      </div>
    </Link>
  );
}
