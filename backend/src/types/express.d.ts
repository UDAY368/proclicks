import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      adminUser?: JwtPayload | { userId: string; username: string };
    }
  }
}

export {};
