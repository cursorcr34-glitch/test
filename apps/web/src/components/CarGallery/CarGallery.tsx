"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./CarGallery.module.css";

interface CarGalleryProps {
  images: string[];
  name: string;
}

export default function CarGallery({ images, name }: CarGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage}>
        <Image
          src={images[activeImage] ?? images[0]}
          alt={name}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />
      </div>
      <div className={styles.thumbnails}>
        {images.map((img, i) => (
          <button
            key={img}
            type="button"
            className={`${styles.thumb} ${activeImage === i ? styles.thumbActive : ""}`}
            onClick={() => setActiveImage(i)}
            aria-label={`Şəkil ${i + 1}`}
          >
            <Image src={img} alt="" fill style={{ objectFit: "cover" }} sizes="100px" />
          </button>
        ))}
      </div>
    </div>
  );
}
