import "dotenv/config";

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number.parseInt(process.env.PORT ?? "4000", 10),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL ?? "",
  databasePublicUrl: process.env.DATABASE_PUBLIC_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
} as const;

if (!env.databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

if (!env.databasePublicUrl) {
  throw new Error("DATABASE_PUBLIC_URL is required");
}

if (!env.jwtSecret) {
  throw new Error("JWT_SECRET is required");
}
