"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import FleetBookingShell from "@/components/layout/FleetBookingShell";
import FleetFilterSidebar, {
  FleetFilterSidebarPanel,
  DEFAULT_FILTERS,
} from "@/components/FleetFilterSidebar/FleetFilterSidebar";
import CarCard from "@/components/ui/CarCard";
import CompareBar from "@/components/ui/CompareBar";
import EmptyState from "@/components/ui/EmptyState";
import { FleetGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { cars } from "@/lib/data/cars";
import type { Car, CarCategory, FleetFilters, SortOption } from "@/lib/types/car";
import { formatPrice } from "@/lib/utils/format";
import styles from "./page.module.css";

function filterCars(allCars: Car[], filters: FleetFilters, searchParams: URLSearchParams): Car[] {
  let result = [...allCars];

  const location = searchParams.get("location");
  const category = searchParams.get("category") as CarCategory | null;

  if (location) {
    result = result.filter((c) => c.location === location);
  }

  if (category) {
    result = result.filter((c) => c.category === category);
  }

  if (filters.categories.length) {
    result = result.filter((c) => filters.categories.includes(c.category));
  }

  result = result.filter(
    (c) => c.pricePerDay >= filters.priceMin && c.pricePerDay <= filters.priceMax
  );

  if (filters.transmission.length) {
    result = result.filter((c) => filters.transmission.includes(c.specs.transmission));
  }

  if (filters.fuel.length) {
    result = result.filter((c) => filters.fuel.includes(c.specs.fuel));
  }

  if (filters.seatsMin > 0) {
    result = result.filter((c) => c.specs.seats >= filters.seatsMin);
  }

  return result;
}

function sortCars(carsList: Car[], sort: SortOption): Car[] {
  const sorted = [...carsList];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
    case "price-desc":
      return sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "az"));
    default:
      return sorted;
  }
}

function FleetPageContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FleetFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("rating");
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const compareParam = searchParams.get("compare");
  const activeCompareIds = useMemo(() => {
    if (compareParam) return compareParam.split(",").filter(Boolean);
    return compareIds;
  }, [compareParam, compareIds]);

  const filtered = useMemo(
    () => sortCars(filterCars(cars, filters, searchParams), sort),
    [filters, sort, searchParams]
  );

  const compareCars = useMemo(
    () => activeCompareIds.map((id) => cars.find((c) => c.id === id)).filter(Boolean) as Car[],
    [activeCompareIds]
  );

  const handleCompare = useCallback((carId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(carId)) return prev.filter((id) => id !== carId);
      if (prev.length >= 3) return prev;
      return [...prev, carId];
    });
  }, []);

  const showCompareTable = compareCars.length >= 2;

  return (
    <FleetBookingShell
      sidebar={<FleetFilterSidebarPanel filters={filters} onChange={setFilters} />}
    >
      <div className={`${styles.page} ${compareIds.length > 0 && !compareParam ? styles.contentWithPadding : ""}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Avtomobil parkı</h1>
          <p className={styles.subtitle}>
            {searchParams.get("location") ? `${searchParams.get("location")} · ` : ""}
            {filtered.length} avtomobil mövcuddur
          </p>
        </div>

        <div className={styles.mobileFilters}>
          <FleetFilterSidebar filters={filters} onChange={setFilters} />
        </div>

        <div className={styles.toolbar}>
          <span className={styles.resultCount}>{filtered.length} nəticə</span>
          <div className={styles.sortWrap}>
            <label className={styles.sortLabel} htmlFor="fleet-sort">Sırala:</label>
            <select
              id="fleet-sort"
              className={styles.sortSelect}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
            >
              <option value="rating">Reytinq</option>
              <option value="price-asc">Qiymət: aşağıdan yuxarı</option>
              <option value="price-desc">Qiymət: yuxarıdan aşağı</option>
              <option value="name">Ad (A-Z)</option>
            </select>
          </div>
        </div>

        {compareCars.length > 0 && !compareParam && (
          <CompareBar
            cars={compareCars}
            onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
            onClear={() => setCompareIds([])}
          />
        )}

        {showCompareTable && (
          <div className={styles.compareSection}>
            <h2 className={styles.compareTitle}>Müqayisə cədvəli</h2>
            <div className={styles.compareTable}>
              <table>
                <thead>
                  <tr>
                    <th>Xüsusiyyət</th>
                    {compareCars.map((c) => (
                      <th key={c.id}>{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Qiymət/gün</td>
                    {compareCars.map((c) => (
                      <td key={c.id} className={styles.highlight}>{formatPrice(c.pricePerDay)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Kateqoriya</td>
                    {compareCars.map((c) => (
                      <td key={c.id}>{c.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Oturacaq</td>
                    {compareCars.map((c) => (
                      <td key={c.id}>{c.specs.seats}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Sürət qutusu</td>
                    {compareCars.map((c) => (
                      <td key={c.id}>{c.specs.transmission === "automatic" ? "Avtomat" : "Mexaniki"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Reytinq</td>
                    {compareCars.map((c) => (
                      <td key={c.id}>{c.rating} ★</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={styles.grid}>
            {filtered.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                variant="grid"
                showCompare
                isCompared={activeCompareIds.includes(car.id)}
                onCompare={handleCompare}
              />
            ))}
          </div>
        )}
      </div>
    </FleetBookingShell>
  );
}

export default function FleetPage() {
  return (
    <Suspense fallback={<FleetGridSkeleton count={6} />}>
      <FleetPageContent />
    </Suspense>
  );
}
