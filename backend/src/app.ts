import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import routes from "./routes/index.js";

function parseOrigins(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/\/+$/, ""));
}

export function createApp() {
  const app = express();
  const allowedOrigins = parseOrigins(env.corsOrigin);

  app.use(
    cors({
      origin(origin, callback) {
        // Allow non-browser requests (no Origin header) like health checks/curl.
        if (!origin) return callback(null, true);

        const normalized = origin.replace(/\/+$/, "");
        if (allowedOrigins.includes(normalized)) return callback(null, true);

        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.options("*", cors());
  app.use(express.json());

  app.use("/api", routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
