import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const WORKSPACE_ROOT = path.resolve(__dirname, "../../..");

export const REQUIRED_PATHS = {
  webApp: "apps/web",
  webSrc: "apps/web/src",
  webPackageJson: "apps/web/package.json",
  api: "apps/api",
  apiPackageJson: "apps/api/package.json",
  prismaSchema: "packages/db/prisma/schema.prisma",
} as const;

export const REQUIRED_PAGES = [
  "apps/web/src/app/page.tsx",
  "apps/web/src/app/fleet/page.tsx",
  "apps/web/src/app/cars/[id]/page.tsx",
  "apps/web/src/app/booking/page.tsx",
  "apps/web/src/app/account/page.tsx",
] as const;

export const REQUIRED_COMPONENTS = [
  "apps/web/src/components/SearchBar/SearchBar.tsx",
  "apps/web/src/components/CarCarousel/CarCarousel.tsx",
  "apps/web/src/components/CarSpecGrid/CarSpecGrid.tsx",
  "apps/web/src/components/BookingWizard/BookingWizard.tsx",
  "apps/web/src/components/PriceCalculator/PriceCalculator.tsx",
  "apps/web/src/components/FleetFilterSidebar/FleetFilterSidebar.tsx",
  "apps/web/src/components/layout/FleetBookingShell.tsx",
] as const;

export const DESIGN_TOKENS = {
  primary: "#0ea5e9",
  accent: "#38bdf8",
  bg: "#0c1222",
} as const;

export const FORBIDDEN_PATTERNS = [
  "sticky bottom booking",
  "position: fixed; bottom: 0",
  "position:fixed;bottom:0",
] as const;
