'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { DISTRICTS, getPropertyTypeLabel, t } from '@/lib/i18n';
import type { ListingType, PropertyType } from '@/types';
import { Button } from '@/components/ui/Button';
import styles from './PropertyFilters.module.css';

const PROPERTY_TYPES: PropertyType[] = ['APARTMENT', 'HOUSE', 'COMMERCIAL', 'LAND'];

export function PropertyFilters() {
  const { locale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listingType, setListingType] = useState(searchParams.get('listingType') ?? '');
  const [district, setDistrict] = useState(searchParams.get('district') ?? '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') ?? '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const [minRooms, setMinRooms] = useState(searchParams.get('minRooms') ?? '');

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (listingType) params.set('listingType', listingType);
    if (district) params.set('district', district);
    if (propertyType) params.set('propertyType', propertyType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minRooms) params.set('minRooms', minRooms);
    router.push(`/properties?${params.toString()}`);
  }, [listingType, district, propertyType, minPrice, maxPrice, minRooms, router]);

  const resetFilters = () => {
    setListingType('');
    setDistrict('');
    setPropertyType('');
    setMinPrice('');
    setMaxPrice('');
    setMinRooms('');
    router.push('/properties');
  };

  const setTab = (type: ListingType | '') => {
    setListingType(type);
    const params = new URLSearchParams(searchParams.toString());
    if (type) params.set('listingType', type);
    else params.delete('listingType');
    router.push(`/properties?${params.toString()}`);
  };

  const districtName = (d: typeof DISTRICTS[0]) => {
    if (locale === 'EN') return d.nameEn;
    if (locale === 'RU') return d.nameRu;
    return d.nameAz;
  };

  return (
    <div className={styles.filters}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${!listingType ? styles.tabActive : ''}`}
          onClick={() => setTab('')}
        >
          {t(locale, 'filterAll')}
        </button>
        <button
          className={`${styles.tab} ${listingType === 'SALE' ? styles.tabActive : ''}`}
          onClick={() => setTab('SALE')}
        >
          {t(locale, 'filterSale')}
        </button>
        <button
          className={`${styles.tab} ${listingType === 'RENT' ? styles.tabActive : ''}`}
          onClick={() => setTab('RENT')}
        >
          {t(locale, 'filterRent')}
        </button>
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label>{t(locale, 'filterDistrict')}</label>
          <select value={district} onChange={(e) => setDistrict(e.target.value)}>
            <option value="">{t(locale, 'filterAll')}</option>
            {DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>{districtName(d)}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label>{t(locale, 'filterType')}</label>
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
            <option value="">{t(locale, 'filterAll')}</option>
            {PROPERTY_TYPES.map((pt) => (
              <option key={pt} value={pt}>{getPropertyTypeLabel(pt, locale)}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label>{t(locale, 'priceMin')}</label>
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" min="0" />
        </div>
        <div className={styles.field}>
          <label>{t(locale, 'priceMax')}</label>
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="1000000" min="0" />
        </div>
        <div className={styles.field}>
          <label>{t(locale, 'filterRooms')}</label>
          <select value={minRooms} onChange={(e) => setMinRooms(e.target.value)}>
            <option value="">{t(locale, 'filterAll')}</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r}+ {t(locale, 'roomsLabel')}</option>
            ))}
          </select>
        </div>
        <div className={styles.actions}>
          <Button variant="primary" onClick={applyFilters}>{t(locale, 'filterApply')}</Button>
          <Button variant="secondary" onClick={resetFilters}>{t(locale, 'filterReset')}</Button>
        </div>
      </div>
    </div>
  );
}
