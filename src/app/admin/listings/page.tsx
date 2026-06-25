'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { api } from '@/lib/api';
import { localizeProperty } from '@/lib/format';
import { getListingTypeLabel, getPropertyStatusLabel, t } from '@/lib/i18n';
import type { Property } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/ErrorState';
import styles from '../admin.module.css';

export default function AdminListingsPage() {
  const { locale } = useLocale();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    api.properties.search({ locale, limit: 50 })
      .then((res) => setProperties(res.data.map((p) => localizeProperty(p, locale))))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [locale]);

  return (
    <>
      <div className={styles.toolbar}>
        <h1 className={styles.pageTitle} style={{ marginBottom: 0 }}>{t(locale, 'adminListings')}</h1>
      </div>

      {loading && <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius-lg)' }} />}
      {error && <ErrorState title={t(locale, 'errorTitle')} retryLabel={t(locale, 'errorRetry')} onRetry={load} />}

      {!loading && !error && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t(locale, 'propertyDetails')}</th>
                <th>{t(locale, 'filterDistrict')}</th>
                <th>{t(locale, 'filterPrice')}</th>
                <th>{t(locale, 'adminStatus')}</th>
                <th>{t(locale, 'adminActions')}</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.title}</div>
                    <Badge variant={p.listingType === 'SALE' ? 'sale' : 'rent'}>
                      {getListingTypeLabel(p.listingType, locale)}
                    </Badge>
                  </td>
                  <td>{p.districtName}</td>
                  <td>{p.priceFormatted}</td>
                  <td>
                    <Badge variant={p.status === 'ACTIVE' ? 'success' : 'neutral'}>
                      {getPropertyStatusLabel(p.status, locale)}
                    </Badge>
                  </td>
                  <td>
                    <Link href={`/properties/${p.id}`} style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                      {t(locale, 'viewDetails')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
