import styles from "./LoadingSkeleton.module.css";

export function CarCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.cardImage} />
      <div className={styles.cardBody}>
        <div className={styles.line} />
        <div className={styles.lineShort} />
        <div className={styles.lineMedium} />
      </div>
    </div>
  );
}

export function FleetGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HomeHeroSkeleton() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroTitle} />
      <div className={styles.heroSub} />
      <div className={styles.heroSearch} />
    </div>
  );
}

export function CarDetailSkeleton() {
  return (
    <div className={styles.detail}>
      <div className={styles.detailImage} />
      <div className={styles.detailSidebar} />
    </div>
  );
}
