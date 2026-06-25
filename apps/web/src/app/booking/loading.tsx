import FleetBookingShell from "@/components/layout/FleetBookingShell";
import styles from "./page.module.css";

export default function BookingLoading() {
  return (
    <FleetBookingShell>
      <div className={styles.loadingWrap}>Rezervasiya formu yüklənir...</div>
    </FleetBookingShell>
  );
}
