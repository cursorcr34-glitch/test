import styles from './Badge.module.css';

interface BadgeProps {
  variant?: 'sale' | 'rent' | 'success' | 'danger' | 'neutral' | 'accent';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
