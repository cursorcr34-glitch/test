import Link from "next/link";
import FleetBookingShell from "@/components/layout/FleetBookingShell";
import EmptyState from "@/components/ui/EmptyState";
import styles from "./page.module.css";

export default function CarNotFound() {
  return (
    <FleetBookingShell>
      <div className={styles.notFound}>
        <EmptyState
          title="Avtomobil tapılmadı"
          message="Bu avtomobil mövcud deyil və ya silinib."
          actionLabel="Parka qayıt"
          actionHref="/fleet"
        />
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link href="/fleet" style={{ color: "var(--color-accent)" }}>
            ← Avtomobil parkına qayıt
          </Link>
        </p>
      </div>
    </FleetBookingShell>
  );
}
