import Link from "next/link";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title = "Nəticə tapılmadı",
  message = "Axtarış meyarlarınıza uyğun avtomobil yoxdur.",
  actionLabel = "Filtrləri sıfırla",
  actionHref = "/fleet",
}: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </svg>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      <Link href={actionHref} className={styles.action}>
        {actionLabel}
      </Link>
    </div>
  );
}
