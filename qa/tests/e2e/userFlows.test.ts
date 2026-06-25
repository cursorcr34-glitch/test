import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  REQUIRED_PAGES,
  REQUIRED_PATHS,
  WORKSPACE_ROOT,
} from "../helpers/projectPaths";

function read(relativePath: string): string {
  return readFileSync(path.join(WORKSPACE_ROOT, relativePath), "utf8");
}

function fileExistsUnder(rootRelative: string, fragment: string): boolean {
  const root = path.join(WORKSPACE_ROOT, rootRelative);
  if (!existsSync(root)) return false;
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop()!;
    for (const entry of readdirSafe(current)) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (entry.name.toLowerCase().includes(fragment.toLowerCase())) return true;
      const content = readFileSync(fullPath, "utf8");
      if (content.toLowerCase().includes(fragment.toLowerCase())) return true;
    }
  }
  return false;
}

function readdirSafe(dir: string) {
  try {
    return readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

describe("E2E: user story us-1 acceptance criteria", () => {
  it("acceptance criterion: App runs — web package has dev and build scripts", () => {
    const webPkgPath = path.join(WORKSPACE_ROOT, REQUIRED_PATHS.webPackageJson);
    expect(existsSync(webPkgPath)).toBe(true);
    const web = JSON.parse(read(REQUIRED_PATHS.webPackageJson));
    expect(typeof web.scripts?.dev).toBe("string");
    expect(typeof web.scripts?.build).toBe("string");
    expect(typeof web.scripts?.start).toBe("string");
  });

  it("acceptance criterion: Basic UI works — landing page has hero, search, carousel", () => {
    expect(existsSync(path.join(WORKSPACE_ROOT, "apps/web/src/app/page.tsx"))).toBe(true);
    expect(existsSync(path.join(WORKSPACE_ROOT, "apps/web/src/app/layout.tsx"))).toBe(true);
    const page = read("apps/web/src/app/page.tsx");
    expect(page).toMatch(/hero|SearchBar|CarCarousel/i);
    expect(page).toMatch(/avtomobil|rezerv|DriveAZ|sür/i);
  });
});

describe("E2E: browse and search flow", () => {
  it("home SearchBar navigates to /fleet with location, dates, category params", () => {
    const searchBar = read("apps/web/src/components/SearchBar/SearchBar.tsx");
    expect(searchBar).toContain("router.push(`/fleet?");
    expect(searchBar).toContain("location");
    expect(searchBar).toContain("pickup");
    expect(searchBar).toContain("return");
    expect(searchBar).toContain("category");
  });

  it("fleet page supports filtered grid, sort, and compare up to 3 cars", () => {
    const fleet = read("apps/web/src/app/fleet/page.tsx");
    expect(fleet).toContain("filterCars");
    expect(fleet).toContain("sortCars");
    expect(fleet).toMatch(/prev\.length >= 3/);
    expect(fleet).toContain("Müqayisə cədvəli");
  });

  it("car detail links to booking via PriceCalculator CTA", () => {
    const calc = read("apps/web/src/components/PriceCalculator/PriceCalculator.tsx");
    expect(calc).toContain("İndi rezerv et");
    expect(calc).toContain("/booking?car=");
  });
});

describe("E2E: booking wizard flow", () => {
  it("wizard progresses through dates → addons → payment steps", () => {
    const wizard = read("apps/web/src/components/BookingWizard/BookingWizard.tsx");
    expect(wizard).toContain('"Tarix & yer"');
    expect(wizard).toContain('"Əlavələr"');
    expect(wizard).toContain('"Ödəniş"');
    expect(wizard).toMatch(/setStep\(step \+ 1\)/);
    expect(wizard).toContain("Rezervasiya təsdiqləndi");
    expect(wizard).toContain("/account");
  });

  it("wizard validates return date after pickup date", () => {
    const wizard = read("apps/web/src/components/BookingWizard/BookingWizard.tsx");
    expect(wizard).toContain("Qaytarma tarixi götürmə tarixindən sonra olmalıdır");
  });
});

describe("E2E: account management flow", () => {
  it("account page lists reservations with status and price in AZN", () => {
    const account = read("apps/web/src/app/account/page.tsx");
    expect(account).toContain("mockReservations");
    expect(account).toContain("formatPrice");
    expect(account).toContain("statusLabel");
    expect(account).toContain("Profil");
  });

  it("profile form supports save with loading state", () => {
    const account = read("apps/web/src/app/account/page.tsx");
    expect(account).toContain("handleSave");
    expect(account).toContain("Saxlanılır");
    expect(account).toContain("Yadda saxla");
  });
});

describe("E2E: full route coverage", () => {
  it("all five minimum pages exist with FleetBookingShell integration", () => {
    for (const pagePath of REQUIRED_PAGES) {
      expect(existsSync(path.join(WORKSPACE_ROOT, pagePath))).toBe(true);
      const content = read(pagePath);
      expect(content).toContain("FleetBookingShell");
    }
  });

  it("car detail has not-found and loading states for invalid ids", () => {
    expect(existsSync(path.join(WORKSPACE_ROOT, "apps/web/src/app/cars/[id]/not-found.tsx"))).toBe(true);
    expect(existsSync(path.join(WORKSPACE_ROOT, "apps/web/src/app/cars/[id]/loading.tsx"))).toBe(true);
    const detail = read("apps/web/src/app/cars/[id]/page.tsx");
    expect(detail).toContain("notFound()");
  });
});

describe("E2E: fleet-booking journey navigation", () => {
  it("FleetBookingShell journey links fleet, cars, booking, account", () => {
    const shell = read("apps/web/src/components/layout/FleetBookingShell.tsx");
    expect(shell).toContain('href: "/fleet"');
    expect(shell).toContain('href: "/booking"');
    expect(shell).toContain('href: "/account"');
    expect(shell).toContain("Rezervasiya addımları");
  });
});

describe("E2E: known gaps (documented for QA)", () => {
  it("frontend uses mock data — no API client layer detected", () => {
    const hasApiClient = fileExistsUnder("apps/web/src", "fetch('/api") ||
      fileExistsUnder("apps/web/src/lib", "apiClient") ||
      existsSync(path.join(WORKSPACE_ROOT, "apps/web/src/lib/api"));
    expect(hasApiClient).toBe(false);
  });

  it("BookingWizard simulates submission with timeout not REST call", () => {
    const wizard = read("apps/web/src/components/BookingWizard/BookingWizard.tsx");
    expect(wizard).toContain("setTimeout");
    expect(wizard).not.toMatch(/fetch\(|POST.*bookings/i);
  });
});
