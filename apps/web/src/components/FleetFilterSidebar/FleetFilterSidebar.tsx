"use client";

import { useMemo, useState } from "react";
import { CATEGORY_LABELS } from "@/lib/data/cars";
import type { CarCategory, FleetFilters, FuelType, Transmission } from "@/lib/types/car";
import { formatPrice } from "@/lib/utils/format";
import styles from "./FleetFilterSidebar.module.css";

const ALL_CATEGORIES: CarCategory[] = ["economy", "compact", "suv", "premium", "electric"];
const TRANSMISSIONS: { value: Transmission; label: string }[] = [
  { value: "automatic", label: "Avtomat" },
  { value: "manual", label: "Mexaniki" },
];
const FUELS: { value: FuelType; label: string }[] = [
  { value: "petrol", label: "Benzin" },
  { value: "diesel", label: "Dizel" },
  { value: "electric", label: "Elektrik" },
  { value: "hybrid", label: "Hibrid" },
];

export const DEFAULT_FILTERS: FleetFilters = {
  categories: [],
  priceMin: 0,
  priceMax: 300,
  transmission: [],
  fuel: [],
  seatsMin: 0,
};

interface FleetFilterSidebarProps {
  filters: FleetFilters;
  onChange: (filters: FleetFilters) => void;
  maxPrice?: number;
}

function FilterContent({
  filters,
  onChange,
  maxPrice,
  activeCount,
  seatsRadioName,
}: FleetFilterSidebarProps & { activeCount: number; seatsRadioName: string }) {
  const toggleCategory = (cat: CarCategory) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: next });
  };

  const toggleTransmission = (t: Transmission) => {
    const next = filters.transmission.includes(t)
      ? filters.transmission.filter((x) => x !== t)
      : [...filters.transmission, t];
    onChange({ ...filters, transmission: next });
  };

  const toggleFuel = (f: FuelType) => {
    const next = filters.fuel.includes(f)
      ? filters.fuel.filter((x) => x !== f)
      : [...filters.fuel, f];
    onChange({ ...filters, fuel: next });
  };

  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.title}>Filtrlər</h2>
        {activeCount > 0 && (
          <button
            type="button"
            className={styles.reset}
            onClick={() => onChange({ ...DEFAULT_FILTERS, priceMax: maxPrice ?? 300 })}
          >
            Sıfırla
          </button>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Kateqoriya</h3>
        <div className={styles.checkboxGroup}>
          {ALL_CATEGORIES.map((cat) => (
            <label key={cat} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {CATEGORY_LABELS[cat]}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Qiymət aralığı (₼/gün)</h3>
        <div className={styles.rangeInputs}>
          <input
            type="number"
            className={styles.rangeInput}
            value={filters.priceMin}
            min={0}
            max={filters.priceMax}
            onChange={(e) =>
              onChange({ ...filters, priceMin: Number(e.target.value) || 0 })
            }
            aria-label="Minimum qiymət"
          />
          <span className={styles.rangeSep}>—</span>
          <input
            type="number"
            className={styles.rangeInput}
            value={filters.priceMax}
            min={filters.priceMin}
            onChange={(e) =>
              onChange({ ...filters, priceMax: Number(e.target.value) || (maxPrice ?? 300) })
            }
            aria-label="Maksimum qiymət"
          />
        </div>
        <p className={styles.rangeDisplay}>
          {formatPrice(filters.priceMin)} — {formatPrice(filters.priceMax)}
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Sürət qutusu</h3>
        <div className={styles.checkboxGroup}>
          {TRANSMISSIONS.map((t) => (
            <label key={t.value} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={filters.transmission.includes(t.value)}
                onChange={() => toggleTransmission(t.value)}
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Yanacaq növü</h3>
        <div className={styles.checkboxGroup}>
          {FUELS.map((f) => (
            <label key={f.value} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={filters.fuel.includes(f.value)}
                onChange={() => toggleFuel(f.value)}
              />
              {f.label}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Minimum oturacaq</h3>
        <div className={styles.checkboxGroup}>
          {[0, 4, 5, 7].map((seats) => (
            <label key={seats} className={styles.checkboxLabel}>
              <input
                type="radio"
                name={seatsRadioName}
                className={styles.checkbox}
                checked={filters.seatsMin === seats}
                onChange={() => onChange({ ...filters, seatsMin: seats })}
              />
              {seats === 0 ? "Hamısı" : `${seats}+ nəfər`}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}

export default function FleetFilterSidebar({
  filters,
  onChange,
  maxPrice = 300,
}: FleetFilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length) count++;
    if (filters.priceMin > 0 || filters.priceMax < maxPrice) count++;
    if (filters.transmission.length) count++;
    if (filters.fuel.length) count++;
    if (filters.seatsMin > 0) count++;
    return count;
  }, [filters, maxPrice]);

  return (
    <>
      <button
        type="button"
        className={styles.mobileToggle}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-expanded={mobileOpen}
      >
        Filtrlər
        {activeCount > 0 && <span className={styles.badge}>{activeCount}</span>}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ transform: mobileOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div className={`${styles.mobilePanel} ${!mobileOpen ? styles.mobilePanelHidden : ""}`}>
        <aside className={styles.sidebar}>
          <FilterContent
            filters={filters}
            onChange={onChange}
            maxPrice={maxPrice}
            activeCount={activeCount}
            seatsRadioName="seatsMinMobile"
          />
        </aside>
      </div>
    </>
  );
}

export function FleetFilterSidebarPanel(props: FleetFilterSidebarProps) {
  const maxPrice = props.maxPrice ?? 300;
  const activeCount = useMemo(() => {
    let count = 0;
    if (props.filters.categories.length) count++;
    if (props.filters.priceMin > 0 || props.filters.priceMax < maxPrice) count++;
    if (props.filters.transmission.length) count++;
    if (props.filters.fuel.length) count++;
    if (props.filters.seatsMin > 0) count++;
    return count;
  }, [props.filters, maxPrice]);

  return (
    <aside className={styles.sidebar}>
      <FilterContent
        {...props}
        maxPrice={maxPrice}
        activeCount={activeCount}
        seatsRadioName="seatsMinDesktop"
      />
    </aside>
  );
}
