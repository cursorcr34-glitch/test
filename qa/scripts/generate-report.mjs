import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const qaRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportsDir = path.join(qaRoot, "reports");
mkdirSync(reportsDir, { recursive: true });

const suites = [
  { name: "unit", target: "tests/unit" },
  { name: "integration", target: "tests/integration" },
  { name: "e2e", target: "tests/e2e" },
];

const suiteResults = {};
let totalPassed = 0;
let totalFailed = 0;
let totalTests = 0;

for (const suite of suites) {
  spawnSync(
    "npx",
    ["vitest", "run", "--config", "vitest.config.ts", suite.target],
    { cwd: qaRoot, encoding: "utf8", shell: true },
  );

  const jsonPath = path.join(reportsDir, "vitest-results.json");
  let passed = 0;
  let failed = 0;
  let total = 0;

  if (existsSync(jsonPath)) {
    const vitestReport = JSON.parse(readFileSync(jsonPath, "utf8"));
    passed = vitestReport.numPassedTests ?? 0;
    failed = vitestReport.numFailedTests ?? 0;
    total = vitestReport.numTotalTests ?? passed + failed;
  }

  totalPassed += passed;
  totalFailed += failed;
  totalTests += total;

  suiteResults[suite.name] = {
    total,
    passed,
    failed,
    percent: total ? Math.round((passed / total) * 100) : 0,
    files: [`tests/${suite.name}/`],
  };
}

const issues = [
  {
    severity: "critical",
    description:
      "Reproduction: clone repo and run `cd qa && npm install && npm test`. Expected: Emlak platform apps/api/web/admin/mobile and Prisma schema exist. Actual: repository contains only README.md with placeholder content; all structural, integration, and e2e acceptance checks fail.",
    file: "README.md",
    line: 1,
  },
  {
    severity: "critical",
    description:
      "Reproduction: verify user story us-1 acceptance criterion 'App runs'. Run `npm run dev` in apps/web and apps/api. Actual: apps/web and apps/api directories are missing; no package.json scripts exist.",
    file: "apps/web/package.json",
    line: 1,
  },
  {
    severity: "critical",
    description:
      "Reproduction: open customer landing page. Expected: premium hero, property filters, AZ/EN/RU switch, AZN pricing. Actual: no Next.js app, layout, or page components implemented.",
    file: "apps/web/app/page.tsx",
    line: 1,
  },
  {
    severity: "high",
    description:
      "Reproduction: inspect database layer. Expected: PostgreSQL Prisma models for Property, User, Inquiry, Favorite, Agent with six launch districts seeded. Actual: packages/database/prisma/schema.prisma not found.",
    file: "packages/database/prisma/schema.prisma",
    line: 1,
  },
  {
    severity: "high",
    description:
      "Reproduction: call REST endpoints /properties, /search, /districts, /inquiries. Actual: no API service under apps/api; inquiry lifecycle cannot be exercised.",
    file: "apps/api/src/routes/properties.ts",
    line: 1,
  },
  {
    severity: "high",
    description:
      "Reproduction: register users as buyer, seller, and agent; access role-restricted routes. Actual: JWT auth and RBAC middleware not implemented.",
    file: "apps/api/src/auth/index.ts",
    line: 1,
  },
  {
    severity: "medium",
    description:
      "Reproduction: open admin panel and dashboard. Expected: listing CRUD, inquiry handling, agent management, sales stats, lead conversion, district heatmap. Actual: apps/admin missing entirely.",
    file: "apps/admin/app/page.tsx",
    line: 1,
  },
  {
    severity: "medium",
    description:
      "Reproduction: launch React Native app, search listings, save favorites, relaunch app. Actual: apps/mobile missing; favorites sync cannot be validated.",
    file: "apps/mobile/package.json",
    line: 1,
  },
  {
    severity: "medium",
    description:
      "Reproduction: audit UI against platform standards. Expected: CSS modules/globals with design tokens, next/font typography, loading/empty/error states, no generic starter copy. Actual: no frontend implementation present.",
    file: "apps/web/app/globals.css",
    line: 1,
  },
];

const report = {
  passed: totalFailed === 0 && totalTests > 0,
  issues,
  testCoverage: {
    unit: suiteResults.unit,
    integration: suiteResults.integration,
    e2e: suiteResults.e2e,
    overall: {
      total: totalTests,
      passed: totalPassed,
      failed: totalFailed,
      percent: totalTests ? Math.round((totalPassed / totalTests) * 100) : 0,
    },
    acceptanceCriteria: {
      "us-1: App runs": false,
      "us-1: Basic UI works": false,
    },
  },
};

writeFileSync(path.join(reportsDir, "qa-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));

process.exit(report.passed ? 0 : 1);
