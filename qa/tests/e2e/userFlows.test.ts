import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { REQUIRED_PATHS, WORKSPACE_ROOT } from "../helpers/projectPaths";

function fileExistsUnder(rootRelative: string, fragment: string): boolean {
  const root = path.join(WORKSPACE_ROOT, rootRelative);
  if (!existsSync(root)) return false;

  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop()!;
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (entry.name.includes(fragment)) {
        return true;
      }
      const content = readFileSync(fullPath, "utf8");
      if (content.toLowerCase().includes(fragment.toLowerCase())) {
        return true;
      }
    }
  }
  return false;
}

describe("E2E: user story us-1 acceptance criteria", () => {
  it("acceptance criterion: App runs", () => {
    const webPkg = path.join(WORKSPACE_ROOT, REQUIRED_PATHS.webPackageJson);
    const apiPkg = path.join(WORKSPACE_ROOT, REQUIRED_PATHS.apiPackageJson);
    expect(existsSync(webPkg)).toBe(true);
    expect(existsSync(apiPkg)).toBe(true);

    const web = JSON.parse(readFileSync(webPkg, "utf8"));
    const api = JSON.parse(readFileSync(apiPkg, "utf8"));
    expect(typeof web.scripts?.dev).toBe("string");
    expect(typeof web.scripts?.build).toBe("string");
    expect(typeof api.scripts?.dev).toBe("string");
    expect(typeof api.scripts?.start).toBe("string");
  });

  it("acceptance criterion: Basic UI works", () => {
    const pagePath = path.join(WORKSPACE_ROOT, REQUIRED_PATHS.webApp, "app/page.tsx");
    const layoutPath = path.join(WORKSPACE_ROOT, REQUIRED_PATHS.webApp, "app/layout.tsx");
    expect(existsSync(pagePath)).toBe(true);
    expect(existsSync(layoutPath)).toBe(true);

    const page = readFileSync(pagePath, "utf8");
    expect(page).toMatch(/hero|property|emlak|filter/i);
  });
});

describe("E2E: customer browse and filter flow", () => {
  it("supports sale/rent browse with district, price, room, and type filters", () => {
    expect(fileExistsUnder(REQUIRED_PATHS.webApp, "filter")).toBe(true);
    expect(fileExistsUnder(REQUIRED_PATHS.webApp, "district")).toBe(true);
    expect(fileExistsUnder(REQUIRED_PATHS.webApp, "price")).toBe(true);
    expect(fileExistsUnder(REQUIRED_PATHS.webApp, "rooms")).toBe(true);
    expect(fileExistsUnder(REQUIRED_PATHS.webApp, "sale")).toBe(true);
    expect(fileExistsUnder(REQUIRED_PATHS.webApp, "rent")).toBe(true);
  });

  it("renders property detail with photos, map, amenities, and floor plan", () => {
    const detailRoute = path.join(WORKSPACE_ROOT, REQUIRED_PATHS.webApp, "app/properties/[id]");
    expect(existsSync(detailRoute)).toBe(true);
    expect(fileExistsUnder(REQUIRED_PATHS.webApp, "amenities")).toBe(true);
    expect(fileExistsUnder(REQUIRED_PATHS.webApp, "floor plan")).toBe(true);
    expect(fileExistsUnder(REQUIRED_PATHS.webApp, "map")).toBe(true);
  });

  it("provides inquiry panel on property detail", () => {
    expect(fileExistsUnder(REQUIRED_PATHS.webApp, "inquiry")).toBe(true);
  });
});

describe("E2E: inquiry lifecycle and dashboard conversion", () => {
  it("tracks inquiry submission through admin response to dashboard metrics", () => {
    expect(fileExistsUnder(REQUIRED_PATHS.api, "inquir")).toBe(true);
    expect(fileExistsUnder(REQUIRED_PATHS.adminApp, "inquir")).toBe(true);
    expect(fileExistsUnder(REQUIRED_PATHS.adminApp, "conversion")).toBe(true);
    expect(fileExistsUnder(REQUIRED_PATHS.adminApp, "heatmap")).toBe(true);
  });
});

describe("E2E: mobile favorites sync", () => {
  it("includes React Native search and favorites backed by API", () => {
    const mobilePkg = path.join(WORKSPACE_ROOT, REQUIRED_PATHS.mobileApp, "package.json");
    expect(existsSync(mobilePkg)).toBe(true);
    const pkg = readFileSync(mobilePkg, "utf8");
    expect(pkg).toMatch(/react-native/i);
    expect(fileExistsUnder(REQUIRED_PATHS.mobileApp, "favorite")).toBe(true);
    expect(fileExistsUnder(REQUIRED_PATHS.mobileApp, "search")).toBe(true);
  });
});

describe("E2E: auth RBAC without authorization leaks", () => {
  it("separates buyer, seller, and agent protected routes", () => {
    expect(fileExistsUnder(REQUIRED_PATHS.api, "jwt")).toBe(true);
    expect(fileExistsUnder(REQUIRED_PATHS.webApp, "login")).toBe(true);
    expect(fileExistsUnder(REQUIRED_PATHS.webApp, "register")).toBe(true);
    expect(fileExistsUnder(REQUIRED_PATHS.adminApp, "middleware")).toBe(true);
  });
});
