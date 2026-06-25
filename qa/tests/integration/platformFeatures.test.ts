import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  REQUIRED_DISTRICTS,
  REQUIRED_LANGUAGES,
  REQUIRED_PATHS,
  REQUIRED_ROLES,
  WORKSPACE_ROOT,
} from "../helpers/projectPaths";

function readIfExists(relativePath: string): string | null {
  const fullPath = path.join(WORKSPACE_ROOT, relativePath);
  if (!existsSync(fullPath)) return null;
  return readFileSync(fullPath, "utf8");
}

describe("Integration: database schema", () => {
  it("defines core Prisma models", () => {
    const schema = readIfExists(REQUIRED_PATHS.prismaSchema);
    expect(schema).toBeTruthy();
    for (const model of ["Property", "User", "Inquiry", "Favorite", "Agent"]) {
      expect(schema).toContain(`model ${model}`);
    }
  });

  it("seeds or documents all six launch districts", () => {
    const schema = readIfExists(REQUIRED_PATHS.prismaSchema);
    const seedPath = path.join(WORKSPACE_ROOT, "packages/database/prisma/seed.ts");
    const seed = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
    const combined = `${schema ?? ""}\n${seed}`;
    for (const district of REQUIRED_DISTRICTS) {
      expect(combined).toContain(district);
    }
  });
});

describe("Integration: REST API surface", () => {
  const apiRoot = path.join(WORKSPACE_ROOT, REQUIRED_PATHS.api);

  it("exposes properties CRUD and search routes", () => {
    const routesDir = path.join(apiRoot, "src/routes");
    expect(existsSync(routesDir)).toBe(true);
    const files = existsSync(routesDir)
      ? readFileSync(path.join(apiRoot, "package.json"), "utf8")
      : "";
    expect(files.length).toBeGreaterThan(0);
    const routeFiles = ["properties", "search", "districts", "inquiries"]
      .map((name) => path.join(routesDir, `${name}.ts`))
      .some((file) => existsSync(file));
    expect(routeFiles).toBe(true);
  });

  it("implements JWT auth with buyer/seller/agent RBAC", () => {
    const authDir = path.join(apiRoot, "src/auth");
    expect(existsSync(authDir)).toBe(true);
    const authIndex = readIfExists(path.join(REQUIRED_PATHS.api, "src/auth/index.ts"));
    expect(authIndex).toBeTruthy();
    for (const role of REQUIRED_ROLES) {
      expect(authIndex!.toLowerCase()).toContain(role);
    }
  });
});

describe("Integration: multilingual customer web", () => {
  it("supports AZ/EN/RU locale configuration", () => {
    const i18nDir = path.join(WORKSPACE_ROOT, REQUIRED_PATHS.webApp, "i18n");
    const messagesDir = path.join(WORKSPACE_ROOT, REQUIRED_PATHS.webApp, "messages");
    expect(existsSync(i18nDir) || existsSync(messagesDir)).toBe(true);
    const messagesRoot = existsSync(messagesDir) ? messagesDir : i18nDir;
    for (const locale of REQUIRED_LANGUAGES) {
      const localeFile = path.join(messagesRoot, `${locale}.json`);
      const localeDir = path.join(messagesRoot, locale);
      expect(existsSync(localeFile) || existsSync(localeDir)).toBe(true);
    }
  });
});

describe("Integration: admin and dashboard", () => {
  it("includes admin listing and inquiry management modules", () => {
    const adminRoot = path.join(WORKSPACE_ROOT, REQUIRED_PATHS.adminApp);
    expect(existsSync(adminRoot)).toBe(true);
    for (const segment of ["listings", "inquiries", "agents", "analytics"]) {
      expect(fileExistsUnder(REQUIRED_PATHS.adminApp, segment)).toBe(true);
    }
  });

  it("includes dashboard metrics and district heatmap views", () => {
    expect(fileExistsUnder(REQUIRED_PATHS.adminApp, "dashboard")).toBe(true);
    expect(fileExistsUnder(REQUIRED_PATHS.adminApp, "heatmap")).toBe(true);
    expect(fileExistsUnder(REQUIRED_PATHS.adminApp, "conversion")).toBe(true);
  });
});

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
      if (entry.name.toLowerCase().includes(fragment.toLowerCase())) {
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
