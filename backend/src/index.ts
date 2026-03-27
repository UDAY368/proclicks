import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

const app = createApp();
const server = createServer(app);

server.listen(env.port, () => {
  console.log(`API ready at http://localhost:${env.port}/api`);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
