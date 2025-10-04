import { PrismaClient } from '@prisma/client';

// Déclare une variable globale pour stocker le client Prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Initialise le client Prisma, en le réutilisant s'il existe déjà (utile en développement avec le rechargement à chaud)
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;