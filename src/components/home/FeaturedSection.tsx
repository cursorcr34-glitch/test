'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { api } from '@/lib/api';
import { localizeProperty } from '@/lib/format';
import { t } from '@/lib/i18n';
import type { Property } from '@/types';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyGridSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export function FeaturedSection() {
  const { locale } = useLocale();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    api.properties.search({ limit: 6, locale, sortBy: 'createdAt', sortOrder: 'desc' })
      .then((res) => setProperties(res.data.map((p) => localizeProperty(p, locale))))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [locale]);

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t(locale, 'featuredTitle')}</h2>
          <p className="section-subtitle">{t(locale, 'featuredSubtitle')}</p>
        </div>
        {loading && <PropertyGridSkeleton count={6} />}
        {error && <ErrorState title={t(locale, 'errorTitle')} retryLabel={t(locale, 'errorRetry')} onRetry={load} />}
        {!loading && !error && (
          <div className="grid-auto fade-in">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
