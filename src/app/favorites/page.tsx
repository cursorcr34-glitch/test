'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { api } from '@/lib/api';
import { localizeProperty } from '@/lib/format';
import { t } from '@/lib/i18n';
import type { Property } from '@/types';
import { PropertyCard } from '@/components/property/PropertyCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PropertyGridSkeleton } from '@/components/ui/Skeleton';

export default function FavoritesPage() {
  const { locale } = useLocale();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const load = () => {
    setLoading(true);
    setError(false);
    api.favorites.list()
      .then((data) => setProperties(data.map((p) => localizeProperty(p, locale))))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) load();
  }, [user, locale]);

  if (authLoading || !user) {
    return (
      <main className="page-main">
        <div className="container section">
          <PropertyGridSkeleton count={3} />
        </div>
      </main>
    );
  }

  return (
    <main className="page-main">
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h1 className="section-title">{t(locale, 'favoritesTitle')}</h1>
          </div>
          {loading && <PropertyGridSkeleton />}
          {error && <ErrorState title={t(locale, 'errorTitle')} retryLabel={t(locale, 'errorRetry')} onRetry={load} />}
          {!loading && !error && properties.length === 0 && (
            <EmptyState
              title={t(locale, 'favoritesEmpty')}
              hint={t(locale, 'favoritesEmptyHint')}
              actionLabel={t(locale, 'heroCta')}
              onAction={() => router.push('/properties')}
            />
          )}
          {!loading && !error && properties.length > 0 && (
            <div className="grid-auto fade-in">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} isFavorite />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
