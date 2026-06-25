import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const WORKSPACE_ROOT = path.resolve(__dirname, "../../..");

export const REQUIRED_PATHS = {
  webApp: "apps/web",
  adminApp: "apps/admin",
  mobileApp: "apps/mobile",
  api: "apps/api",
  prismaSchema: "packages/database/prisma/schema.prisma",
  webPackageJson: "apps/web/package.json",
  apiPackageJson: "apps/api/package.json",
} as const;

export const REQUIRED_DISTRICTS = [
  "Nərimanov",
  "Yasamal",
  "Xətai",
  "Səbail",
  "Badamdar",
  "Gəncə",
] as const;

export const REQUIRED_LANGUAGES = ["az", "en", "ru"] as const;

export const REQUIRED_ROLES = ["buyer", "seller", "agent"] as const;
