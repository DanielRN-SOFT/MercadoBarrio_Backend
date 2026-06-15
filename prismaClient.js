import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
  omit: {
    usuarios: {
      password: true,
    },
  },
});

export default prisma;
