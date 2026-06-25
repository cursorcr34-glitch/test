'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { DISTRICTS, t } from '@/lib/i18n';
import styles from './Footer.module.css';

export function Footer() {
  const { locale } = useLocale();
  const year = new Date().getFullYear();

  const districtName = (d: typeof DISTRICTS[0]) => {
    if (locale === 'EN') return d.nameEn;
    if (locale === 'RU') return d.nameRu;
    return d.nameAz;
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <div className={styles.brand}>{t(locale, 'brand')}</div>
            <p className={styles.tagline}>{t(locale, 'tagline')}</p>
          </div>
          <div>
            <h4 className={styles.colTitle}>{t(locale, 'navProperties')}</h4>
            <ul className={styles.links}>
              <li><Link href="/properties?listingType=SALE" className={styles.link}>{t(locale, 'filterSale')}</Link></li>
              <li><Link href="/properties?listingType=RENT" className={styles.link}>{t(locale, 'filterRent')}</Link></li>
              <li><Link href="/favorites" className={styles.link}>{t(locale, 'navFavorites')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.colTitle}>{t(locale, 'navDistricts')}</h4>
            <div className={styles.districts}>
              {DISTRICTS.map((d) => (
                <Link
                  key={d.id}
                  href={`/properties?district=${d.id}`}
                  className={styles.districtTag}
                >
                  {districtName(d)}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>&copy; {year} {t(locale, 'brand')}. Baku & Gəncə.</span>
          <span>AZ / EN / RU</span>
        </div>
      </div>
    </footer>
  );
}
