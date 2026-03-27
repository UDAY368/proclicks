import type { Request, Response } from "express";
import { z } from "zod";
import { comparePassword, signAdminToken } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function loginAdmin(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid credentials payload" });
    return;
  }

  const { username, password } = parsed.data;

  const admin = await prisma.adminUser.findUnique({
    where: { username },
  });

  if (!admin || !admin.isActive) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  const matched = await comparePassword(password, admin.passwordHash);
  if (!matched) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  const token = signAdminToken({
    userId: admin.id,
    username: admin.username,
  });

  res.json({
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      displayName: admin.displayName,
    },
  });
}
