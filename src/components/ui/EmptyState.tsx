import { Button } from './Button';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  title: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({ title, hint, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>
        {icon ?? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        )}
      </div>
      <h3 className={styles.title}>{title}</h3>
      {hint && <p className={styles.hint}>{hint}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
