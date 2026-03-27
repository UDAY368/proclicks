import type { NextFunction, Request, Response } from "express";
import { verifyAdminToken } from "../lib/auth.js";

export function requireAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = verifyAdminToken(token);
    req.adminUser = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
