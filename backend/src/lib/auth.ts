import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

type AuthPayload = {
  userId: string;
  username: string;
};

export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 12);
}

export async function comparePassword(
  plainText: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(plainText, passwordHash);
}

export function signAdminToken(payload: AuthPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAdminToken(token: string): AuthPayload {
  return jwt.verify(token, env.jwtSecret) as AuthPayload;
}
