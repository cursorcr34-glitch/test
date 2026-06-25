import FleetBookingShell from "@/components/layout/FleetBookingShell";
import styles from "./page.module.css";

export default function AccountLoading() {
  return (
    <FleetBookingShell showJourney={false}>
      <div className={styles.page}>
        <div className={styles.header}>
          <div style={{ height: 32, width: 200, background: "var(--color-surface)", borderRadius: 8 }} />
        </div>
      </div>
    </FleetBookingShell>
  );
}
