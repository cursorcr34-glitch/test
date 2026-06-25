'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { api } from '@/lib/api';
import { localizeProperty } from '@/lib/format';
import { getListingTypeLabel, getPropertyTypeLabel, t } from '@/lib/i18n';
import type { Property } from '@/types';
import { InquiryPanel } from '@/components/property/InquiryPanel';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyMap } from '@/components/property/PropertyMap';
import { Badge } from '@/components/ui/Badge';
import { DetailSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import styles from './page.module.css';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { locale } = useLocale();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    if (!id) return;
    setLoading(true);
    setError(false);
    api.properties.getById(id, locale)
      .then((p) => setProperty(localizeProperty(p, locale)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id, locale]);

  if (loading) {
    return (
      <main className="page-main">
        <div className="container" style={{ paddingTop: 'var(--space-8)' }}>
          <DetailSkeleton />
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="page-main">
        <div className="container" style={{ paddingTop: 'var(--space-8)' }}>
          <ErrorState title={t(locale, 'errorTitle')} retryLabel={t(locale, 'errorRetry')} onRetry={load} />
        </div>
      </main>
    );
  }

  return (
    <main className="page-main">
      <div className={`container ${styles.detail}`}>
        <Link href="/properties" className={styles.back}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t(locale, 'backToListings')}
        </Link>

        <div className={styles.layout}>
          <div className={styles.main}>
            <PropertyGallery photos={property.photos} alt={property.title ?? ''} />

            <div className={styles.header}>
              <div className={styles.badges}>
                <Badge variant={property.listingType === 'SALE' ? 'sale' : 'rent'}>
                  {getListingTypeLabel(property.listingType, locale)}
                </Badge>
                <Badge variant="neutral">{getPropertyTypeLabel(property.propertyType, locale)}</Badge>
              </div>
              <h1 className={styles.title}>{property.title}</h1>
              <div className={styles.meta}>
                <span className={styles.metaItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {property.districtName}, {property.address}
                </span>
                {property.rooms > 0 && (
                  <span className={styles.metaItem}>{property.rooms} {t(locale, 'roomsLabel')}</span>
                )}
                <span className={styles.metaItem}>{property.area} {t(locale, 'areaLabel')}</span>
                {property.floor && (
                  <span className={styles.metaItem}>
                    {t(locale, 'floorLabel')} {property.floor}/{property.totalFloors}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>{t(locale, 'propertyDetails')}</h2>
              <p className={styles.description}>{property.description}</p>
            </div>

            {property.amenities.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t(locale, 'amenities')}</h2>
                <div className={styles.amenities}>
                  {property.amenities.map((a) => (
                    <span key={a} className={styles.amenity}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {a.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>{t(locale, 'location')}</h2>
              <PropertyMap latitude={property.latitude} longitude={property.longitude} address={property.address} />
            </div>

            {property.floorPlanUrl && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t(locale, 'floorPlan')}</h2>
                <div className={styles.floorPlan}>
                  <Image
                    src={property.floorPlanUrl}
                    alt={t(locale, 'floorPlan')}
                    width={800}
                    height={600}
                    className={styles.floorPlanImage}
                  />
                </div>
              </div>
            )}
          </div>

          <aside className={styles.sidebar}>
            <InquiryPanel property={property} />
          </aside>
        </div>
      </div>
    </main>
  );
}
