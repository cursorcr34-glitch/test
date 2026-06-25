'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { api } from '@/lib/api';
import { t } from '@/lib/i18n';
import type { DistrictInfo } from '@/types';
import { DistrictGrid } from './DistrictGrid';
import { ErrorState } from '@/components/ui/ErrorState';

export function DistrictsSection() {
  const { locale } = useLocale();
  const [districts, setDistricts] = useState<DistrictInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    api.districts.list()
      .then(setDistricts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <section className="section" style={{ background: 'var(--color-surface-elevated)' }}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t(locale, 'districtsTitle')}</h2>
          <p className="section-subtitle">{t(locale, 'districtsSubtitle')}</p>
        </div>
        {loading && (
          <div className="grid-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ minHeight: 180, borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        )}
        {error && <ErrorState title={t(locale, 'errorTitle')} retryLabel={t(locale, 'errorRetry')} onRetry={load} />}
        {!loading && !error && <DistrictGrid districts={districts} />}
      </div>
    </section>
  );
}
