'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from '../(auth)/auth.module.css';

export default function LoginPage() {
  const { locale } = useLocale();
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
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
          <h1 className={styles.title}>{t(locale, 'loginTitle')}</h1>
          <p className={styles.subtitle}>{t(locale, 'tagline')}</p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input label={t(locale, 'email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <Input label={t(locale, 'password')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            {error && <div className={styles.error}>{error}</div>}
            <Button type="submit" variant="primary" fullWidth loading={loading}>
              {t(locale, 'loginSubmit')}
            </Button>
          </form>
          <p className={styles.footer}>
            {t(locale, 'noAccount')}{' '}
            <Link href="/register">{t(locale, 'navRegister')}</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
