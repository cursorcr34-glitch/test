'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { DISTRICTS, t } from '@/lib/i18n';
import type { ListingType } from '@/types';
import { Button } from '@/components/ui/Button';
import styles from './Hero.module.css';

interface HeroProps {
  listingCount?: number;
  agentCount?: number;
}

export function Hero({ listingCount = 8, agentCount = 12 }: HeroProps) {
  const { locale } = useLocale();
  const router = useRouter();
  const [listingType, setListingType] = useState<ListingType | ''>('');
  const [district, setDistrict] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (listingType) params.set('listingType', listingType);
    if (district) params.set('district', district);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <div className={styles.bgImage} />
        <div className={styles.overlay} />
      </div>
      <div className={`container ${styles.content}`}>
        <div className={styles.inner}>
          <h1 className={styles.title}>{t(locale, 'heroTitle')}</h1>
          <p className={styles.subtitle}>{t(locale, 'heroSubtitle')}</p>
          <div className={styles.ctas}>
            <Link href="/properties">
              <Button variant="accent" size="lg">{t(locale, 'heroCta')}</Button>
            </Link>
            <Link href="/properties#districts">
              <Button variant="secondary" size="lg">{t(locale, 'heroSecondary')}</Button>
            </Link>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statValue}>{listingCount}+</div>
              <div className={styles.statLabel}>{t(locale, 'heroStatListings')}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>6</div>
              <div className={styles.statLabel}>{t(locale, 'heroStatDistricts')}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>{agentCount}+</div>
              <div className={styles.statLabel}>{t(locale, 'heroStatAgents')}</div>
            </div>
          </div>
        </div>

        <div className={styles.searchBar}>
          <select
            className={styles.searchSelect}
            value={listingType}
            onChange={(e) => setListingType(e.target.value as ListingType | '')}
            aria-label={t(locale, 'filterType')}
          >
            <option value="">{t(locale, 'filterAll')}</option>
            <option value="SALE">{t(locale, 'filterSale')}</option>
            <option value="RENT">{t(locale, 'filterRent')}</option>
          </select>
          <select
            className={styles.searchSelect}
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            aria-label={t(locale, 'filterDistrict')}
          >
            <option value="">{t(locale, 'filterDistrict')}</option>
            {DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {locale === 'EN' ? d.nameEn : locale === 'RU' ? d.nameRu : d.nameAz}
              </option>
            ))}
          </select>
          <button className={styles.searchBtn} onClick={handleSearch}>
            {t(locale, 'heroCta')}
          </button>
        </div>
      </div>
    </section>
  );
}
