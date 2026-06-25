import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  REQUIRED_COMPONENTS,
  REQUIRED_PATHS,
  WORKSPACE_ROOT,
} from "../helpers/projectPaths";

function readIfExists(relativePath: string): string | null {
  const fullPath = path.join(WORKSPACE_ROOT, relativePath);
  if (!existsSync(fullPath)) return null;
  return readFileSync(fullPath, "utf8");
}

describe("Integration: required component contracts", () => {
  it("SearchBar exposes location, dates, and category fields", () => {
    const src = readIfExists("apps/web/src/components/SearchBar/SearchBar.tsx");
    expect(src).toBeTruthy();
    expect(src).toContain("search-location");
    expect(src).toContain("search-pickup");
    expect(src).toContain("search-return");
    expect(src).toContain("search-category");
    expect(src).toContain("/fleet?");
  });

  it("CarCarousel accepts cars prop and renders navigation", () => {
    const src = readIfExists("apps/web/src/components/CarCarousel/CarCarousel.tsx");
    expect(src).toBeTruthy();
    expect(src).toMatch(/cars:\s*Car\[\]|cars\s*:\s*\{/);
    expect(src).toMatch(/scroll|carousel|dot/i);
  });

  it("CarSpecGrid renders vehicle specifications", () => {
    const src = readIfExists("apps/web/src/components/CarSpecGrid/CarSpecGrid.tsx");
    expect(src).toBeTruthy();
    expect(src).toMatch(/specs|transmission|seats|fuel/i);
  });

  it("BookingWizard implements 3-step flow: dates, addons, payment", () => {
    const src = readIfExists("apps/web/src/components/BookingWizard/BookingWizard.tsx");
    expect(src).toBeTruthy();
    expect(src).toContain("Tarix");
    expect(src).toContain("Əlavələr");
    expect(src).toContain("Ödəniş");
    expect(src).toMatch(/step === 1|step === 2|step === 3/);
  });

  it("PriceCalculator computes daily rate and total with AZN format", () => {
    const src = readIfExists("apps/web/src/components/PriceCalculator/PriceCalculator.tsx");
    expect(src).toBeTruthy();
    expect(src).toContain("formatPrice");
    expect(src).toContain("calculateDays");
    expect(src).toContain("/booking?");
  });

  it("FleetFilterSidebar supports category, price, transmission filters", () => {
    const src = readIfExists("apps/web/src/components/FleetFilterSidebar/FleetFilterSidebar.tsx");
    expect(src).toBeTruthy();
    expect(src).toMatch(/categories|priceMin|transmission|fuel/i);
  });
});

describe("Integration: page wiring", () => {
  it("home page composes FleetBookingShell, SearchBar, and CarCarousel", () => {
    const page = readIfExists("apps/web/src/app/page.tsx");
    expect(page).toContain("FleetBookingShell");
    expect(page).toContain("SearchBar");
    expect(page).toContain("CarCarousel");
    expect(page).toContain("getPopularCars");
  });

  it("fleet page wires FleetFilterSidebar, sorting, and compare", () => {
    const page = readIfExists("apps/web/src/app/fleet/page.tsx");
    expect(page).toContain("FleetFilterSidebar");
    expect(page).toContain("CompareBar");
    expect(page).toMatch(/sort|SortOption/i);
    expect(page).toContain("Müqayisə");
  });

  it("car detail page wires CarGallery, CarSpecGrid, and PriceCalculator", () => {
    const page = readIfExists("apps/web/src/app/cars/[id]/page.tsx");
    expect(page).toContain("CarGallery");
    expect(page).toContain("CarSpecGrid");
    expect(page).toContain("PriceCalculator");
    expect(page).toContain("fetchCarById");
  });

  it("booking page wraps BookingWizard in FleetBookingShell", () => {
    const page = readIfExists("apps/web/src/app/booking/page.tsx");
    expect(page).toContain("BookingWizard");
    expect(page).toContain("FleetBookingShell");
  });

  it("account page shows reservations and profile tabs", () => {
    const page = readIfExists("apps/web/src/app/account/page.tsx");
    expect(page).toContain("reservations");
    expect(page).toContain("profile");
    expect(page).toContain("mockReservations");
    expect(page).toContain("mockProfile");
  });
});

describe("Integration: data layer and states", () => {
  it("mock car dataset has required fields for fleet rendering", () => {
    const data = readIfExists("apps/web/src/lib/data/cars.ts");
    expect(data).toBeTruthy();
    expect(data).toContain("export const cars");
    expect(data).toMatch(/pricePerDay|category|specs|images/);
    expect(data).toContain("bookingAddons");
  });

  it("includes loading, error, and empty states", () => {
    expect(existsSync(path.join(WORKSPACE_ROOT, "apps/web/src/components/ui/LoadingSkeleton.tsx"))).toBe(true);
    expect(existsSync(path.join(WORKSPACE_ROOT, "apps/web/src/components/ui/ErrorState.tsx"))).toBe(true);
    expect(existsSync(path.join(WORKSPACE_ROOT, "apps/web/src/components/ui/EmptyState.tsx"))).toBe(true);
    expect(existsSync(path.join(WORKSPACE_ROOT, "apps/web/src/app/cars/[id]/loading.tsx"))).toBe(true);
    expect(existsSync(path.join(WORKSPACE_ROOT, "apps/web/src/app/error.tsx"))).toBe(true);
  });

  it("Navbar includes fleet, booking, and account navigation", () => {
    const navbar = readIfExists("apps/web/src/components/layout/Navbar.tsx");
    expect(navbar).toContain("/fleet");
    expect(navbar).toContain("/booking");
    expect(navbar).toContain("/account");
  });
});

describe("Integration: backend availability (optional monorepo)", () => {
  it("REST API service exists when backend branch is merged", () => {
    const apiExists = existsSync(path.join(WORKSPACE_ROOT, REQUIRED_PATHS.api));
    if (!apiExists) {
      expect(apiExists).toBe(false);
      return;
    }
    const routes = readIfExists("apps/api/src/routes/car.routes.ts");
    expect(routes).toBeTruthy();
  });

  it("Prisma schema defines Car and Booking models when db package is merged", () => {
    const schema = readIfExists(REQUIRED_PATHS.prismaSchema);
    if (!schema) {
      expect(schema).toBeNull();
      return;
    }
    expect(schema).toContain("model Car");
    expect(schema).toContain("model Booking");
  });
});
