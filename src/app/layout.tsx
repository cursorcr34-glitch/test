import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { Providers } from '@/components/Providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Emlak.az — Azərbaycanda daşınmaz əmlak',
    template: '%s | Emlak.az',
  },
  description: 'Azərbaycanın premium daşınmaz əmlak platforması. Bakı və Gəncədə satış və kirayə elanları.',
  keywords: ['emlak', 'daşınmaz əmlak', 'Bakı', 'Gəncə', 'mənzil', 'ev', 'kirayə', 'satış'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className={inter.variable}>
      <body>
        <Providers>
          <Navbar />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
