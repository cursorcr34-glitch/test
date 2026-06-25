import styles from './Skeleton.module.css';

export function PropertyCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={`${styles.image} skeleton`} />
      <div className={styles.body}>
        <div className={`${styles.title} skeleton`} />
        <div className={`${styles.line} skeleton`} />
        <div className={`${styles.line} skeleton`} style={{ width: '45%' }} />
        <div className={`${styles.price} skeleton`} />
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div>
      <div className="skeleton" style={{ aspectRatio: '16/7', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-8)' }} />
      <div className="skeleton" style={{ height: 32, width: '60%', marginBottom: 'var(--space-4)' }} />
      <div className="skeleton" style={{ height: 20, width: '40%', marginBottom: 'var(--space-6)' }} />
      <div className="skeleton" style={{ height: 120, width: '100%' }} />
    </div>
  );
}
