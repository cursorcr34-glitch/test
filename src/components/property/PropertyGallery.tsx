'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './PropertyGallery.module.css';

interface PropertyGalleryProps {
  photos: string[];
  alt: string;
}

export function PropertyGallery({ photos, alt }: PropertyGalleryProps) {
  const [active, setActive] = useState(0);
  const images = photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80'];

  const prev = () => setActive((a) => (a === 0 ? images.length - 1 : a - 1));
  const next = () => setActive((a) => (a === images.length - 1 ? 0 : a + 1));

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <Image
          src={images[active]}
          alt={`${alt} - ${active + 1}`}
          fill
          className={styles.mainImage}
          sizes="(max-width: 768px) 100vw, 70vw"
          priority
        />
        {images.length > 1 && (
          <>
            <button className={`${styles.nav} ${styles.prev}`} onClick={prev} aria-label="Previous photo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button className={`${styles.nav} ${styles.next}`} onClick={next} aria-label="Next photo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <span className={styles.counter}>{active + 1} / {images.length}</span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((photo, i) => (
            <button
              key={i}
              className={`${styles.thumb} ${i === active ? styles.thumbActive : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Photo ${i + 1}`}
            >
              <Image src={photo} alt="" fill className={styles.thumbImage} sizes="100px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
