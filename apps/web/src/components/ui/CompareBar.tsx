"use client";

import Link from "next/link";
import type { Car } from "@/lib/types/car";
import styles from "./CompareBar.module.css";

interface CompareBarProps {
  cars: Car[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function CompareBar({ cars, onRemove, onClear }: CompareBarProps) {
  if (cars.length === 0) return null;

  const compareUrl = `/fleet?compare=${cars.map((c) => c.id).join(",")}`;

  return (
    <div className={styles.bar} role="region" aria-label="Müqayisə paneli">
      <div className={styles.inner}>
        <div className={styles.cars}>
          {cars.map((car) => (
            <span key={car.id} className={styles.chip}>
              {car.name}
              <button
                type="button"
                className={styles.chipRemove}
                onClick={() => onRemove(car.id)}
                aria-label={`${car.name} müqayisədən çıxar`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.clearBtn} onClick={onClear}>
            Təmizlə
          </button>
          <Link
            href={compareUrl}
            className={styles.compareBtn}
            aria-disabled={cars.length < 2}
            tabIndex={cars.length < 2 ? -1 : 0}
            style={cars.length < 2 ? { opacity: 0.5, pointerEvents: "none" } : undefined}
          >
            Müqayisə et ({cars.length})
          </Link>
        </div>
      </div>
    </div>
  );
}
