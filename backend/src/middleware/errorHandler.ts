import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);
  res.status(500).json({
    error: env.nodeEnv === "production" ? "Internal server error" : err.message,
  });
}
