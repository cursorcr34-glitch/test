import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { REQUIRED_PATHS, WORKSPACE_ROOT } from "../helpers/projectPaths";

function exists(relativePath: string): boolean {
  return existsSync(path.join(WORKSPACE_ROOT, relativePath));
}

describe("Unit: project structure", () => {
  it("has a customer web application directory", () => {
    expect(exists(REQUIRED_PATHS.webApp)).toBe(true);
  });

  it("has an admin panel application directory", () => {
    expect(exists(REQUIRED_PATHS.adminApp)).toBe(true);
  });

  it("has a mobile application directory", () => {
    expect(exists(REQUIRED_PATHS.mobileApp)).toBe(true);
  });

  it("has a REST API service directory", () => {
    expect(exists(REQUIRED_PATHS.api)).toBe(true);
  });

  it("has a Prisma schema for PostgreSQL models", () => {
    expect(exists(REQUIRED_PATHS.prismaSchema)).toBe(true);
  });
});

describe("Unit: platform UI/UX standards", () => {
  it("uses CSS modules or globals instead of inline-only styling in web app", () => {
    const globalsCss = path.join(WORKSPACE_ROOT, REQUIRED_PATHS.webApp, "app/globals.css");
    const stylesDir = path.join(WORKSPACE_ROOT, REQUIRED_PATHS.webApp, "styles");
    const hasGlobals = existsSync(globalsCss);
    const hasStylesDir = existsSync(stylesDir);
    expect(hasGlobals || hasStylesDir).toBe(true);
  });

  it("defines design tokens via CSS variables", () => {
    const globalsCss = path.join(WORKSPACE_ROOT, REQUIRED_PATHS.webApp, "app/globals.css");
    if (!existsSync(globalsCss)) {
      expect.fail("globals.css missing");
    }
    const css = readFileSync(globalsCss, "utf8");
    expect(css).toMatch(/--primary|--surface|--muted|--accent/);
  });

  it("avoids generic starter copy on the landing page", () => {
    const pagePath = path.join(WORKSPACE_ROOT, REQUIRED_PATHS.webApp, "app/page.tsx");
    if (!existsSync(pagePath)) {
      expect.fail("app/page.tsx missing");
    }
    const page = readFileSync(pagePath, "utf8");
    expect(page.toLowerCase()).not.toContain("web app");
    expect(page.toLowerCase()).not.toContain("get started by editing");
  });
});
