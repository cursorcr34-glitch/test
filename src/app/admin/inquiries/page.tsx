'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { api } from '@/lib/api';
import { getInquiryStatusLabel, t } from '@/lib/i18n';
import type { Inquiry, InquiryStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/ErrorState';
import styles from '../admin.module.css';

const STATUSES: InquiryStatus[] = ['NEW', 'CONTACTED', 'VIEWING', 'NEGOTIATING', 'CLOSED', 'REJECTED'];

function statusVariant(status: InquiryStatus): 'success' | 'danger' | 'neutral' | 'accent' {
  if (status === 'CLOSED') return 'success';
  if (status === 'REJECTED') return 'danger';
  if (status === 'NEW') return 'accent';
  return 'neutral';
}

export default function AdminInquiriesPage() {
  const { locale } = useLocale();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    api.inquiries.list()
      .then(setInquiries)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: InquiryStatus) => {
    await api.inquiries.updateStatus(id, status);
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i)),
    );
  };

  return (
    <>
      <h1 className={styles.pageTitle}>{t(locale, 'adminInquiries')}</h1>

      {loading && <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius-lg)' }} />}
      {error && <ErrorState title={t(locale, 'errorTitle')} retryLabel={t(locale, 'errorRetry')} onRetry={load} />}

      {!loading && !error && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t(locale, 'name')}</th>
                <th>{t(locale, 'email')}</th>
                <th>{t(locale, 'phone')}</th>
                <th>{t(locale, 'inquiryMessage')}</th>
                <th>{t(locale, 'adminStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td style={{ fontWeight: 600 }}>{inquiry.name}</td>
                  <td>{inquiry.email}</td>
                  <td>{inquiry.phone}</td>
                  <td style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inquiry.message}
                  </td>
                  <td>
                    <select
                      className={styles.statusSelect}
                      value={inquiry.status}
                      onChange={(e) => updateStatus(inquiry.id, e.target.value as InquiryStatus)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{getInquiryStatusLabel(s, locale)}</option>
                      ))}
                    </select>
                    <Badge variant={statusVariant(inquiry.status)}>
                      {getInquiryStatusLabel(inquiry.status, locale)}
                    </Badge>
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
