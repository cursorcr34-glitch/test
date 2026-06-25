import { Suspense } from "react";
import FleetBookingShell from "@/components/layout/FleetBookingShell";
import BookingWizard from "@/components/BookingWizard/BookingWizard";
import styles from "./page.module.css";

function BookingFallback() {
  return (
    <div className={styles.loadingWrap}>
      Rezervasiya formu yüklənir...
    </div>
  );
}

export default function BookingPage() {
  return (
    <FleetBookingShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Rezervasiya</h1>
          <p className={styles.subtitle}>
            3 addımda avtomobilinizi rezerv edin — tarix, əlavələr, ödəniş
          </p>
        </header>
        <Suspense fallback={<BookingFallback />}>
          <BookingWizard />
        </Suspense>
      </div>
    </FleetBookingShell>
  );
}
