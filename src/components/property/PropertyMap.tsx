import styles from './PropertyMap.module.css';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  address: string;
}

export function PropertyMap({ latitude, longitude, address }: PropertyMapProps) {
  const bbox = `${longitude - 0.01},${latitude - 0.008},${longitude + 0.01},${latitude + 0.008}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div className={styles.map}>
      <iframe
        title={`Map: ${address}`}
        src={src}
        className={styles.iframe}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className={styles.coords}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        {address}
      </div>
    </div>
  );
}
