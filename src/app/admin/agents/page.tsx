'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { api } from '@/lib/api';
import { t } from '@/lib/i18n';
import type { Agent } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/ErrorState';
import styles from '../admin.module.css';

export default function AdminAgentsPage() {
  const { locale } = useLocale();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    api.agents.list()
      .then(setAgents)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const getBio = (agent: Agent) => {
    if (locale === 'EN') return agent.bioEn;
    if (locale === 'RU') return agent.bioRu;
    return agent.bioAz;
  };

  return (
    <>
      <h1 className={styles.pageTitle}>{t(locale, 'adminAgents')}</h1>

      {loading && <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)' }} />}
      {error && <ErrorState title={t(locale, 'errorTitle')} retryLabel={t(locale, 'errorRetry')} onRetry={load} />}

      {!loading && !error && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t(locale, 'name')}</th>
                <th>{t(locale, 'email')}</th>
                <th>{t(locale, 'phone')}</th>
                <th>{t(locale, 'adminStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      {agent.avatarUrl ? (
                        <Image src={agent.avatarUrl} alt="" width={40} height={40} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                      )}
                      <div>
                        <div style={{ fontWeight: 600 }}>{agent.user?.name ?? 'Agent'}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          {agent.licenseNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{agent.user?.email}</td>
                  <td>{agent.user?.phone ?? '—'}</td>
                  <td>
                    <Badge variant={agent.isActive ? 'success' : 'neutral'}>
                      {agent.isActive ? t(locale, 'statusActive') : t(locale, 'statusArchived')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && agents.length > 0 && (
        <div style={{ marginTop: 'var(--space-8)' }}>
          {agents.map((agent) => getBio(agent) && (
            <div key={`bio-${agent.id}`} style={{
              padding: 'var(--space-5)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--space-4)',
            }}>
              <strong>{agent.user?.name}</strong>
              <p style={{ marginTop: 'var(--space-2)', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                {getBio(agent)}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
