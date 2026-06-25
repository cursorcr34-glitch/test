'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { getRoleLabel, t } from '@/lib/i18n';
import type { Role } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import styles from '../(auth)/auth.module.css';

export default function RegisterPage() {
  const { locale } = useLocale();
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('BUYER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({ name, email, password, phone: phone || undefined, role });
      router.push('/');
    } catch {
      setError(t(locale, 'errorTitle'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-main">
      <div className={styles.authPage}>
        <div className={styles.card}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>E</span>
            {t(locale, 'brand')}
          </div>
          <h1 className={styles.title}>{t(locale, 'registerTitle')}</h1>
          <p className={styles.subtitle}>{t(locale, 'tagline')}</p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input label={t(locale, 'name')} value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label={t(locale, 'email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <Input label={t(locale, 'phone')} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input label={t(locale, 'password')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
            <Select label={t(locale, 'role')} value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="BUYER">{getRoleLabel('BUYER', locale)}</option>
              <option value="SELLER">{getRoleLabel('SELLER', locale)}</option>
              <option value="AGENT">{getRoleLabel('AGENT', locale)}</option>
            </Select>
            {error && <div className={styles.error}>{error}</div>}
            <Button type="submit" variant="primary" fullWidth loading={loading}>
              {t(locale, 'registerSubmit')}
            </Button>
          </form>
          <p className={styles.footer}>
            {t(locale, 'hasAccount')}{' '}
            <Link href="/login">{t(locale, 'navLogin')}</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
