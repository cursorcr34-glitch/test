'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { localizeProperty } from '@/lib/format';
import { getListingTypeLabel, getPropertyTypeLabel, t } from '@/lib/i18n';
import type { Property } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import styles from './PropertyCard.module.css';

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
}

export function PropertyCard({ property, onFavoriteToggle, isFavorite = false }: PropertyCardProps) {
  const { locale } = useLocale();
  const p = localizeProperty(property, locale);
  const photo = p.photos[0] ?? 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80';

  return (
    <article className={styles.card}>
      <Link href={`/properties/${p.id}`} className={styles.imageWrap}>
        <Image
          src={photo}
          alt={p.title ?? p.titleAz}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className={styles.badges}>
          <Badge variant={p.listingType === 'SALE' ? 'sale' : 'rent'}>
            {getListingTypeLabel(p.listingType, locale)}
          </Badge>
          <Badge variant="neutral">{getPropertyTypeLabel(p.propertyType, locale)}</Badge>
        </div>
        {onFavoriteToggle && (
          <button
            className={`${styles.favoriteBtn} ${isFavorite ? styles.favoriteActive : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onFavoriteToggle(p.id);
            }}
            aria-label={isFavorite ? t(locale, 'favoriteRemove') : t(locale, 'favoriteAdd')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        )}
      </Link>
      <div className={styles.body}>
        <div className={styles.price}>{p.priceFormatted}</div>
        <Link href={`/properties/${p.id}`}>
          <h3 className={styles.title}>{p.title}</h3>
        </Link>
        <div className={styles.location}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {p.districtName}, {p.address}
        </div>
        <div className={styles.meta}>
          {p.rooms > 0 && (
            <span className={styles.metaItem}>
              {p.rooms} {t(locale, 'roomsLabel')}
            </span>
          )}
          <span className={styles.metaItem}>
            {p.area} {t(locale, 'areaLabel')}
          </span>
          {p.floor && (
            <span className={styles.metaItem}>
              {t(locale, 'floorLabel')} {p.floor}/{p.totalFloors}
            </span>
          )}
        </div>
        <div className={styles.footer}>
          <Link href={`/properties/${p.id}`}>
            <Button variant="secondary" size="sm" fullWidth>
              {t(locale, 'viewDetails')}
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
