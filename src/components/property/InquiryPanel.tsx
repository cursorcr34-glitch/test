'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { api } from '@/lib/api';
import { t } from '@/lib/i18n';
import type { Property } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import styles from './InquiryPanel.module.css';

interface InquiryPanelProps {
  property: Property;
  sticky?: boolean;
}

export function InquiryPanel({ property, sticky = true }: InquiryPanelProps) {
  const { locale } = useLocale();
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.inquiries.create({
        propertyId: property.id,
        name,
        email,
        phone,
        message,
      });
      setSuccess(true);
    } catch {
      setError(t(locale, 'inquiryError'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`${styles.panel} ${sticky ? styles.sticky : ''}`}>
        <div className={styles.success}>
          <div className={styles.successIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className={styles.successText}>{t(locale, 'inquirySuccess')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.panel} ${sticky ? styles.sticky : ''}`}>
      {property.priceFormatted && (
        <div className={styles.priceHighlight}>{property.priceFormatted}</div>
      )}

      {property.agent && (
        <div className={styles.agent}>
          {property.agent.avatarUrl ? (
            <Image
              src={property.agent.avatarUrl}
              alt={property.agent.user?.name ?? 'Agent'}
              width={48}
              height={48}
              className={styles.agentAvatar}
            />
          ) : (
            <div className={styles.agentAvatar} />
          )}
          <div className={styles.agentInfo}>
            <div className={styles.agentName}>{property.agent.user?.name ?? 'Agent'}</div>
            <div className={styles.agentRole}>{t(locale, 'roleAgent')}</div>
          </div>
        </div>
      )}

      <h2 className={styles.title}>{t(locale, 'inquiryTitle')}</h2>
      <p className={styles.subtitle}>{t(locale, 'inquirySubtitle')}</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input label={t(locale, 'inquiryName')} value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label={t(locale, 'inquiryEmail')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label={t(locale, 'inquiryPhone')} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <Textarea label={t(locale, 'inquiryMessage')} value={message} onChange={(e) => setMessage(e.target.value)} required minLength={10} />
        {error && <p style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)' }}>{error}</p>}
        <Button type="submit" variant="primary" fullWidth loading={loading}>
          {t(locale, 'inquirySubmit')}
        </Button>
      </form>
    </div>
  );
}
