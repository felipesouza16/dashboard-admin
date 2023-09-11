import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient();

//ao utilizar a aplicação em desenvolvimento evita a instância do Prisma diversas vezes, melhorando a velociade do ambiente de desenvolvimento
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

export default prismadb;
