"use client";

import Link from "next/link";
import Image from "next/image";
import FleetBookingShell from "@/components/layout/FleetBookingShell";
import SearchBar from "@/components/SearchBar/SearchBar";
import CarCarousel from "@/components/CarCarousel/CarCarousel";
import { getPopularCars } from "@/lib/data/cars";
import styles from "./page.module.css";

const FEATURES = [
  {
    title: "Sürətli rezervasiya",
    desc: "3 addımda avtomobilinizi seçin və təsdiqləyin",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: "Geniş avtomobil parkı",
    desc: "Ekonomdan premiuma — 50+ avtomobil seçimi",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2" />
      </svg>
    ),
  },
  {
    title: "24/7 dəstək",
    desc: "Yol boyu yardım və texniki dəstək xidməti",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const popularCars = getPopularCars(6);

  return (
    <FleetBookingShell>
      <section className={`${styles.hero} velocity-bg`}>
        <div className="velocity-lines" aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <span className={styles.eyebrow}>
                <span className={styles.eyebrowDot} />
                50+ avtomobil hazırdır
              </span>
              <h1 className={styles.title}>
                Yolunuzu <span className={styles.titleAccent}>sürətlə</span> seçin
              </h1>
              <p className={styles.subtitle}>
                Bakı və regionlarda premium avtomobil icarəsi. Bir neçə kliklə ideal avtomobili tapın və sürüşə başlayın.
              </p>
              <div className={styles.searchWrap}>
                <SearchBar />
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.visualFrame}>
                <Image
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80"
                  alt="Premium avtomobil"
                  fill
                  className={styles.visualImage}
                  priority
                  sizes="(max-width: 1024px) 0vw, 45vw"
                />
                <div className={styles.visualOverlay} />
                <div className={styles.speedBadge}>
                  <div className={styles.speedValue}>0-100</div>
                  <div className={styles.speedLabel}>4.4 saniyə</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features} aria-label="Xidmət üstünlükləri">
        <div className={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <article key={f.title} className={styles.feature}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.carouselSection}>
        <CarCarousel cars={popularCars} />
      </section>

      <section className={styles.ctaBanner}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Hazırsınız?</h2>
          <p className={styles.ctaDesc}>
            Avtomobil parkımıza baxın və bu gün rezervasiya edin. Pulsuz ləğv 24 saat əvvəl.
          </p>
          <Link href="/fleet" className={styles.ctaButton}>
            Avtomobillərə bax
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </FleetBookingShell>
  );
}
