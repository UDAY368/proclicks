import "dotenv/config";

function firstDefinedEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim()) return value.trim();
  }
  return "";
}

const resolvedDatabaseUrl = firstDefinedEnv(
  "DATABASE_URL",
  "DATABASE_PUBLIC_URL",
  "DATABASE_PRIVATE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "PGDATABASE_URL"
);

if (resolvedDatabaseUrl && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = resolvedDatabaseUrl;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number.parseInt(process.env.PORT ?? "4000", 10),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  databaseUrl: resolvedDatabaseUrl,
  databasePublicUrl: firstDefinedEnv("DATABASE_PUBLIC_URL", "DATABASE_URL"),
  jwtSecret: process.env.JWT_SECRET ?? "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
} as const;

if (!env.databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

if (!env.jwtSecret) {
  throw new Error("JWT_SECRET is required");
}
