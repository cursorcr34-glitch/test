'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import { api } from '@/lib/api';
import { localizeProperty } from '@/lib/format';
import { t } from '@/lib/i18n';
import type { Property, PropertySearchParams } from '@/types';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PropertyGridSkeleton } from '@/components/ui/Skeleton';

function PropertiesContent() {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    const params: PropertySearchParams = { locale, status: 'ACTIVE' };
    searchParams.forEach((value, key) => {
      if (key === 'minPrice' || key === 'maxPrice' || key === 'minRooms' || key === 'maxRooms' || key === 'page' || key === 'limit') {
        (params as Record<string, unknown>)[key] = Number(value);
      } else {
        (params as Record<string, unknown>)[key] = value;
      }
    });

    api.properties.search(params)
      .then((res) => {
        setProperties(res.data.map((p) => localizeProperty(p, locale)));
        setTotal(res.pagination.total);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [locale, searchParams]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <PropertyFilters />
      {!loading && !error && (
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
          {total} {t(locale, 'listingsCount')}
        </p>
      )}
      {loading && <PropertyGridSkeleton />}
      {error && <ErrorState title={t(locale, 'errorTitle')} retryLabel={t(locale, 'errorRetry')} onRetry={load} />}
      {!loading && !error && properties.length === 0 && (
        <EmptyState title={t(locale, 'noResults')} hint={t(locale, 'noResultsHint')} />
      )}
      {!loading && !error && properties.length > 0 && (
        <div className="grid-auto fade-in">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </>
  );
}

export default function PropertiesPage() {
  const { locale } = useLocale();

  return (
    <main className="page-main">
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h1 className="section-title">{t(locale, 'listingsTitle')}</h1>
          </div>
          <Suspense fallback={<PropertyGridSkeleton />}>
            <PropertiesContent />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
