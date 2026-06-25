import Link from "next/link";
import { notFound } from "next/navigation";
import FleetBookingShell from "@/components/layout/FleetBookingShell";
import CarGallery from "@/components/CarGallery/CarGallery";
import CarSpecGrid from "@/components/CarSpecGrid/CarSpecGrid";
import PriceCalculator from "@/components/PriceCalculator/PriceCalculator";
import { fetchCarById, CATEGORY_LABELS } from "@/lib/data/cars";
import styles from "./page.module.css";

interface CarDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { id } = await params;
  const car = await fetchCarById(id);

  if (!car) {
    notFound();
  }

  return (
    <FleetBookingShell>
      <div className={styles.page}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Ana səhifə</Link>
          <span>/</span>
          <Link href="/fleet">Park</Link>
          <span>/</span>
          <span>{car.name}</span>
        </nav>

        <div className={styles.layout}>
          <div>
            <CarGallery images={car.images} name={car.name} />

            <div className={styles.info}>
              <div className={styles.badgeRow}>
                <span className={styles.badge}>{CATEGORY_LABELS[car.category]}</span>
                {car.available && <span className={styles.badge}>Mövcuddur</span>}
              </div>
              <h1 className={styles.name}>{car.name}</h1>
              <div className={styles.meta}>
                <span className={styles.rating}>★ {car.rating}</span>
                <span>({car.reviewCount} rəy)</span>
                <span>{car.year}</span>
                <span>{car.location}</span>
              </div>
              <p className={styles.description}>{car.description}</p>
              <CarSpecGrid specs={car.specs} features={car.features} />
            </div>
          </div>

          <div className={styles.sidebar}>
            <PriceCalculator carId={car.id} pricePerDay={car.pricePerDay} />
          </div>
        </div>
      </div>
    </FleetBookingShell>
  );
}
