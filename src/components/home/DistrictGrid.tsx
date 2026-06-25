'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { t } from '@/lib/i18n';
import type { DistrictInfo } from '@/types';
import styles from './DistrictGrid.module.css';

const BG_CLASSES = [styles.bgAlt1, styles.bgAlt2, styles.bgAlt3, styles.bgAlt4, styles.bgAlt5, styles.bg];

interface DistrictGridProps {
  districts: DistrictInfo[];
}

export function DistrictGrid({ districts }: DistrictGridProps) {
  const { locale } = useLocale();

  const getName = (d: DistrictInfo) => {
    if (locale === 'EN') return d.nameEn;
    if (locale === 'RU') return d.nameRu;
    return d.nameAz;
  };

  return (
    <div className={styles.grid} id="districts">
      {districts.map((d, i) => (
        <Link
          key={d.id}
          href={`/properties?district=${d.id}`}
          className={`${styles.card} ${BG_CLASSES[i % BG_CLASSES.length]}`}
        >
          <div className={styles.pattern} />
          <div className={styles.content}>
            <div className={styles.name}>{getName(d)}</div>
            <div className={styles.city}>{d.city}</div>
            <span className={styles.count}>
              {d.listingCount ?? 0} {t(locale, 'listingsCount').split(' ').pop()}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
