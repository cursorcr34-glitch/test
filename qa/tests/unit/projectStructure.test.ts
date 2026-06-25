import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  DESIGN_TOKENS,
  FORBIDDEN_PATTERNS,
  REQUIRED_COMPONENTS,
  REQUIRED_PAGES,
  REQUIRED_PATHS,
  WORKSPACE_ROOT,
} from "../helpers/projectPaths";

function exists(relativePath: string): boolean {
  return existsSync(path.join(WORKSPACE_ROOT, relativePath));
}

function read(relativePath: string): string {
  return readFileSync(path.join(WORKSPACE_ROOT, relativePath), "utf8");
}

describe("Unit: rentacar project structure", () => {
  it("has customer web application at apps/web", () => {
    expect(exists(REQUIRED_PATHS.webApp)).toBe(true);
    expect(exists(REQUIRED_PATHS.webPackageJson)).toBe(true);
  });

  it("defines all five required routes", () => {
    for (const page of REQUIRED_PAGES) {
      expect(exists(page)).toBe(true);
    }
  });

  it("includes all six required components plus fleet-booking layout shell", () => {
    for (const component of REQUIRED_COMPONENTS) {
      expect(exists(component)).toBe(true);
    }
  });

  it("uses fleet-booking layout archetype via FleetBookingShell", () => {
    const shell = read("apps/web/src/components/layout/FleetBookingShell.tsx");
    expect(shell).toContain("FleetBookingShell");
    expect(shell).toMatch(/journey|JOURNEY_STEPS/i);
    expect(shell).toContain("/fleet");
    expect(shell).toContain("/booking");
    expect(shell).toContain("/account");
  });
});

describe("Unit: design tokens and UI standards", () => {
  it("defines CSS variables for primary, surface, muted, accent in globals.css", () => {
    const css = read("apps/web/src/app/globals.css");
    expect(css).toMatch(/--color-primary|--primary/);
    expect(css).toMatch(/--color-surface|--surface/);
    expect(css).toMatch(/--color-text-muted|--muted/);
    expect(css).toMatch(/--color-accent|--accent/);
  });

  it("uses required brand colors primary, accent, and bg", () => {
    const css = read("apps/web/src/app/globals.css");
    expect(css).toContain(DESIGN_TOKENS.primary);
    expect(css).toContain(DESIGN_TOKENS.accent);
    expect(css).toContain(DESIGN_TOKENS.bg);
  });

  it("loads DM Sans and Inter via next/font in root layout", () => {
    const layout = read("apps/web/src/app/layout.tsx");
    expect(layout).toContain("DM_Sans");
    expect(layout).toContain("Inter");
    expect(layout).toContain("--font-dm-sans");
    expect(layout).toContain("--font-inter");
  });

  it("uses CSS modules instead of inline-only styling", () => {
    const componentsDir = path.join(WORKSPACE_ROOT, "apps/web/src/components");
    const cssModules = readdirSync(componentsDir, { recursive: true }).filter(
      (f) => typeof f === "string" && f.endsWith(".module.css")
    );
    expect(cssModules.length).toBeGreaterThan(5);
  });

  it("avoids generic starter copy on landing page", () => {
    const page = read("apps/web/src/app/page.tsx");
    expect(page.toLowerCase()).not.toContain("web app");
    expect(page.toLowerCase()).not.toContain("get started by editing");
    expect(page.toLowerCase()).not.toContain("multi-artifact starter");
  });
});

describe("Unit: forbidden platform patterns", () => {
  it("does not use emoji car icons", () => {
    const webRoot = path.join(WORKSPACE_ROOT, "apps/web/src");
    const emojiPattern = /[\u{1F697}\u{1F699}\u{1F695}\u{1F68C}]/u;
    const files = collectFiles(webRoot, [".tsx", ".ts", ".css"]);
    for (const file of files) {
      const content = readFileSync(file, "utf8");
      expect(content).not.toMatch(emojiPattern);
    }
  });

  it("does not implement sticky bottom booking panel", () => {
    const webRoot = path.join(WORKSPACE_ROOT, "apps/web/src");
    const files = collectFiles(webRoot, [".tsx", ".css"]);
    for (const file of files) {
      const content = readFileSync(file, "utf8").toLowerCase();
      for (const pattern of FORBIDDEN_PATTERNS) {
        expect(content).not.toContain(pattern.toLowerCase());
      }
    }
  });

  it("home page uses SearchBar and CarCarousel not generic 3-stat hero", () => {
    const page = read("apps/web/src/app/page.tsx");
    expect(page).toContain("SearchBar");
    expect(page).toContain("CarCarousel");
    expect(page).not.toMatch(/statCard|stat-card|statsGrid/i);
  });
});

describe("Unit: utility functions", () => {
  it("formatPrice outputs AZN currency symbol", () => {
    const format = read("apps/web/src/lib/utils/format.ts");
    expect(format).toContain("₼");
    expect(format).toContain("formatPrice");
  });

  it("calculateDays returns minimum 1 day", () => {
    const format = read("apps/web/src/lib/utils/format.ts");
    expect(format).toContain("calculateDays");
    expect(format).toMatch(/Math\.max\(diff,\s*1\)/);
  });
});

function collectFiles(dir: string, extensions: string[]): string[] {
  const result: string[] = [];
  if (!existsSync(dir)) return result;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...collectFiles(full, extensions));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      result.push(full);
    }
  }
  return result;
}
