import type { CarSpecs } from "@/lib/types/car";
import styles from "./CarSpecGrid.module.css";

interface CarSpecGridProps {
  specs: CarSpecs;
  features?: string[];
}

const SPEC_ITEMS = [
  { key: "seats", label: "Oturacaq", icon: "seats" },
  { key: "doors", label: "Qapı", icon: "doors" },
  { key: "transmission", label: "Sürət qutu", icon: "transmission" },
  { key: "fuel", label: "Yanacaq", icon: "fuel" },
  { key: "luggage", label: "Baqaj", icon: "luggage" },
  { key: "horsepower", label: "At gücü", icon: "power" },
  { key: "acceleration", label: "0-100 km/s", icon: "speed" },
  { key: "consumption", label: "Sərfiyyat", icon: "consumption" },
] as const;

function SpecIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    seats: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
    doors: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 3v18" />
      </svg>
    ),
    transmission: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </svg>
    ),
    fuel: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 22V6a2 2 0 012-2h6a2 2 0 012 2v16" />
        <path d="M3 22h10" />
        <path d="M15 10h2l3 3v9h-5V10z" />
      </svg>
    ),
    luggage: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
    power: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    speed: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    consumption: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M2 12h20" />
      </svg>
    ),
  };
  return <span className={styles.icon}>{icons[type] ?? icons.seats}</span>;
}

function formatValue(key: string, specs: CarSpecs): string {
  switch (key) {
    case "seats":
      return `${specs.seats} nəfər`;
    case "doors":
      return `${specs.doors} qapı`;
    case "transmission":
      return specs.transmission === "automatic" ? "Avtomat" : "Mexaniki";
    case "fuel": {
      const labels: Record<string, string> = {
        petrol: "Benzin",
        diesel: "Dizel",
        electric: "Elektrik",
        hybrid: "Hibrid",
      };
      return labels[specs.fuel] ?? specs.fuel;
    }
    case "luggage":
      return `${specs.luggage} valiz`;
    case "horsepower":
      return `${specs.horsepower} a.g.`;
    case "acceleration":
      return specs.acceleration;
    case "consumption":
      return specs.consumption;
    default:
      return "—";
  }
}

export default function CarSpecGrid({ specs, features }: CarSpecGridProps) {
  return (
    <div>
      <div className={styles.grid}>
        {SPEC_ITEMS.map((item) => (
          <div key={item.key} className={styles.item}>
            <SpecIcon type={item.icon} />
            <span className={styles.label}>{item.label}</span>
            <span className={styles.value}>{formatValue(item.key, specs)}</span>
          </div>
        ))}
      </div>

      {features && features.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Əlavə xüsusiyyətlər</h3>
          <div className={styles.features}>
            {features.map((feature) => (
              <span key={feature} className={styles.feature}>
                <svg className={styles.featureCheck} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
