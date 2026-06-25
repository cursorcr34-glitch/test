"use client";

import styles from "./ErrorState.module.css";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Xəta baş verdi",
  message = "Məlumatları yükləmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={styles.container} role="alert">
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Yenidən cəhd et
        </button>
      )}
    </div>
  );
}
