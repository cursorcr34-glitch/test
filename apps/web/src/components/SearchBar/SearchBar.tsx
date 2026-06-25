"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LOCATIONS, CATEGORY_LABELS } from "@/lib/data/cars";
import { getDefaultDates } from "@/lib/utils/format";
import type { CarCategory } from "@/lib/types/car";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  compact?: boolean;
  defaultLocation?: string;
  defaultPickup?: string;
  defaultReturn?: string;
  defaultCategory?: CarCategory | "all";
}

export default function SearchBar({
  compact = false,
  defaultLocation = LOCATIONS[0],
  defaultPickup,
  defaultReturn,
  defaultCategory = "all",
}: SearchBarProps) {
  const router = useRouter();
  const defaults = getDefaultDates();
  const [location, setLocation] = useState(defaultLocation);
  const [pickupDate, setPickupDate] = useState(defaultPickup ?? defaults.pickup);
  const [returnDate, setReturnDate] = useState(defaultReturn ?? defaults.returnDate);
  const [category, setCategory] = useState<CarCategory | "all">(defaultCategory);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (new Date(returnDate) <= new Date(pickupDate)) {
      setError("Qaytarma tarixi götürmə tarixindən sonra olmalıdır.");
      return;
    }

    setLoading(true);
    const params = new URLSearchParams({
      location,
      pickup: pickupDate,
      return: returnDate,
      ...(category !== "all" && { category }),
    });
    router.push(`/fleet?${params.toString()}`);
  };

  return (
    <form
      className={`${styles.form} ${compact ? styles.compact : ""}`}
      onSubmit={handleSubmit}
      aria-label="Avtomobil axtarışı"
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor="search-location">
          Götürmə yeri
        </label>
        <select
          id="search-location"
          className={styles.select}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.dateRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="search-pickup">
            Götürmə tarixi
          </label>
          <input
            id="search-pickup"
            type="date"
            className={styles.input}
            value={pickupDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setPickupDate(e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="search-return">
            Qaytarma tarixi
          </label>
          <input
            id="search-return"
            type="date"
            className={styles.input}
            value={returnDate}
            min={pickupDate}
            onChange={(e) => setReturnDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="search-category">
          Kateqoriya
        </label>
        <select
          id="search-category"
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value as CarCategory | "all")}
        >
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className={styles.submit} disabled={loading}>
        {loading ? "Axtarılır..." : "Avtomobil tap"}
        {!loading && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        )}
      </button>

      {error && <p className={styles.error} role="alert">{error}</p>}
    </form>
  );
}
