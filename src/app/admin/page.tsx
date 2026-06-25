'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { t } from '@/lib/i18n';
import type { DashboardData } from '@/types';
import { ErrorState } from '@/components/ui/ErrorState';
import styles from './admin.module.css';

export default function AdminDashboardPage() {
  const { locale } = useLocale();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    api.analytics.dashboard()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <>
        <h1 className={styles.pageTitle}>{t(locale, 'adminDashboard')}</h1>
        <div className={styles.statsGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <h1 className={styles.pageTitle}>{t(locale, 'adminDashboard')}</h1>
        <ErrorState title={t(locale, 'errorTitle')} retryLabel={t(locale, 'errorRetry')} onRetry={load} />
      </>
    );
  }

  const { stats, heatmap } = data;

  return (
    <>
      <h1 className={styles.pageTitle}>{t(locale, 'adminDashboard')}</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>{t(locale, 'adminActiveListings')}</div>
          <div className={`${styles.statValue} ${styles.statValueAccent}`}>{stats.activeListings}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>{t(locale, 'adminNewLeads')}</div>
          <div className={styles.statValue}>{stats.newInquiries}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>{t(locale, 'adminConversion')}</div>
          <div className={styles.statValue}>{stats.conversionRate}%</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>{t(locale, 'adminTotalSales')}</div>
          <div className={styles.statValue}>{formatPrice(stats.totalSalesValue)}</div>
        </div>
      </div>

      <h2 className={styles.pageTitle} style={{ fontSize: 'var(--font-size-xl)' }}>
        {t(locale, 'adminHeatmap')}
      </h2>
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
        {t(locale, 'adminHeatmapHint')}
      </p>

      <div className={styles.heatmap}>
        {heatmap.map((entry) => (
          <div key={entry.district} className={styles.heatmapItem}>
            <span className={styles.heatmapName}>{entry.districtName}</span>
            <div className={styles.heatmapBar}>
              <div
                className={styles.heatmapFill}
                style={{ width: `${Math.round(entry.intensity * 100)}%` }}
              />
            </div>
            <span className={styles.heatmapStats}>
              {entry.listingCount} / {entry.inquiryCount}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
