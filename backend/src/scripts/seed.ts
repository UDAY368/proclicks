import { env } from "../config/env.js";
import { hashPassword } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";

async function main() {
  const passwordHash = await hashPassword("Admin@111");

  await prisma.adminUser.upsert({
    where: { username: "user@111" },
    update: {
      passwordHash,
      displayName: "Admin User",
      isActive: true,
    },
    create: {
      username: "user@111",
      passwordHash,
      displayName: "Admin User",
      isActive: true,
    },
  });

  await prisma.appConfig.upsert({
    where: { key: "JWT_SECRET" },
    update: { value: env.jwtSecret },
    create: { key: "JWT_SECRET", value: env.jwtSecret },
  });

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
