import prisma from '@/lib/prisma';
import { Prisma, Achievement } from '@prisma/client';

// --- Service pour créer un succès ---
export const createAchievement = async (data: Prisma.AchievementCreateInput): Promise<Achievement> => {
  const achievement = await prisma.achievement.create({ data });
  return achievement;
};

// --- Service pour récupérer tous les succès ---
export const findAllAchievements = async (): Promise<Achievement[]> => {
  const achievements = await prisma.achievement.findMany({
    orderBy: { name: 'asc' },
  });
  return achievements;
};

// --- Service pour récupérer un succès par son ID ---
export const findAchievementById = async (id: string): Promise<Achievement | null> => {
  const achievement = await prisma.achievement.findUnique({ where: { id } });
  return achievement;
};

// --- Service pour mettre à jour un succès ---
export const updateAchievementById = async (
  id: string,
  updates: Prisma.AchievementUpdateInput
): Promise<Achievement> => {
  const achievement = await prisma.achievement.update({
    where: { id },
    data: updates,
  });
  return achievement;
};

// --- Service pour supprimer un succès ---
export const deleteAchievementById = async (id: string): Promise<Achievement> => {
  const achievement = await prisma.achievement.delete({ where: { id } });
  return achievement;
};

// --- Service pour attribuer un succès à un utilisateur ---
// On s'assure de ne pas créer de doublon
export const awardAchievementToUser = async (
  userId: string,
  achievementId: string,
  prismaClient: Prisma.TransactionClient | typeof prisma = prisma
) => {
  try {
    const userAchievement = await prismaClient.userAchievement.create({
      data: {
        user: { connect: { id: userId } },
        achievement: { connect: { id: achievementId } },
      },
    });
    return userAchievement;
  } catch (error) {
    // Ignorer l'erreur si le succès est déjà attribué (contrainte unique)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return null; // Indique que le succès était déjà obtenu
    }
    throw error;
  }
};

// --- Service pour récupérer les succès d'un utilisateur ---
export const findUserAchievements = async (userId: string) => {
    return prisma.userAchievement.findMany({
        where: { userId },
        include: {
            achievement: true, // Inclure les détails de chaque succès
        },
        orderBy: {
            earnedAt: 'desc',
        }
    });
};