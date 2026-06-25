'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/LocaleContext';
import { isAdminOrAgent } from '@/lib/auth';
import { LOCALES, t } from '@/lib/i18n';
import type { Locale } from '@/types';
import { Button } from '@/components/ui/Button';
import styles from './Navbar.module.css';

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t(locale, 'navHome') },
    { href: '/properties', label: t(locale, 'navProperties') },
    { href: '/properties#districts', label: t(locale, 'navDistricts') },
    ...(user ? [{ href: '/favorites', label: t(locale, 'navFavorites') }] : []),
    ...(isAdminOrAgent(user) ? [{ href: '/admin', label: t(locale, 'navAdmin') }] : []),
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('#')[0]);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>E</span>
            {t(locale, 'brand')}
          </Link>

          <nav className={styles.nav} aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive(link.href) ? styles.navLinkActive : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <div className={styles.localeSwitcher} role="group" aria-label="Language">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  className={`${styles.localeBtn} ${locale === l ? styles.localeBtnActive : ''}`}
                  onClick={() => setLocale(l as Locale)}
                  aria-pressed={locale === l}
                >
                  {l}
                </button>
              ))}
            </div>

            {user ? (
              <div className={styles.userMenu}>
                <span className={styles.userName}>{user.name}</span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  {t(locale, 'navLogout')}
                </Button>
              </div>
            ) : (
              <div className={styles.authBtns}>
                <Link href="/login">
                  <Button variant="ghost" size="sm">{t(locale, 'navLogin')}</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">{t(locale, 'navRegister')}</Button>
                </Link>
              </div>
            )}

            <button
              className={styles.hamburger}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className={styles.mobileAuth}>
            {user ? (
              <Button variant="secondary" fullWidth onClick={() => { logout(); setMobileOpen(false); }}>
                {t(locale, 'navLogout')}
              </Button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" fullWidth>{t(locale, 'navLogin')}</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" fullWidth>{t(locale, 'navRegister')}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
