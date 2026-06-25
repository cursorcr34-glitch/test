"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { bookingAddons } from "@/lib/data/cars";
import { calculateDays, formatPrice, getDefaultDates } from "@/lib/utils/format";
import styles from "./PriceCalculator.module.css";

interface PriceCalculatorProps {
  carId: string;
  pricePerDay: number;
  defaultPickup?: string;
  defaultReturn?: string;
  selectedAddons?: string[];
  showBookButton?: boolean;
}

export default function PriceCalculator({
  carId,
  pricePerDay,
  defaultPickup,
  defaultReturn,
  selectedAddons = [],
  showBookButton = true,
}: PriceCalculatorProps) {
  const defaults = getDefaultDates();
  const [pickupDate, setPickupDate] = useState(defaultPickup ?? defaults.pickup);
  const [returnDate, setReturnDate] = useState(defaultReturn ?? defaults.returnDate);

  const days = useMemo(
    () => calculateDays(pickupDate, returnDate),
    [pickupDate, returnDate]
  );

  const baseTotal = pricePerDay * days;

  const addonTotal = useMemo(() => {
    return selectedAddons.reduce((sum, id) => {
      const addon = bookingAddons.find((a) => a.id === id);
      return sum + (addon ? addon.pricePerDay * days : 0);
    }, 0);
  }, [selectedAddons, days]);

  const grandTotal = baseTotal + addonTotal;

  const bookingUrl = `/booking?car=${carId}&pickup=${pickupDate}&return=${returnDate}${
    selectedAddons.length ? `&addons=${selectedAddons.join(",")}` : ""
  }`;

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Qiymət kalkulyatoru</h3>

      <div className={styles.perDay}>
        <div className={styles.perDayAmount}>{formatPrice(pricePerDay)}</div>
        <div className={styles.perDayLabel}>günlük qiymət</div>
      </div>

      <div className={styles.dates}>
        <div className={styles.dateField}>
          <label className={styles.dateLabel} htmlFor="calc-pickup">
            Götürmə
          </label>
          <input
            id="calc-pickup"
            type="date"
            className={styles.dateInput}
            value={pickupDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setPickupDate(e.target.value)}
          />
        </div>
        <div className={styles.dateField}>
          <label className={styles.dateLabel} htmlFor="calc-return">
            Qaytarma
          </label>
          <input
            id="calc-return"
            type="date"
            className={styles.dateInput}
            value={returnDate}
            min={pickupDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.breakdown}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>
            {formatPrice(pricePerDay)} × {days} gün
          </span>
          <span className={styles.rowValue}>{formatPrice(baseTotal)}</span>
        </div>
        {selectedAddons.map((id) => {
          const addon = bookingAddons.find((a) => a.id === id);
          if (!addon) return null;
          return (
            <div key={id} className={`${styles.row} ${styles.addonRow}`}>
              <span className={styles.rowLabel}>
                {addon.name} × {days} gün
              </span>
              <span className={styles.rowValue}>
                {formatPrice(addon.pricePerDay * days)}
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.total}>
        <div>
          <div className={styles.totalLabel}>Cəmi</div>
          <div className={styles.totalNote}>ƏDV daxildir</div>
        </div>
        <div className={styles.totalValue}>{formatPrice(grandTotal)}</div>
      </div>

      {showBookButton && (
        <Link href={bookingUrl} className={styles.cta}>
          İndi rezerv et
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
