import prisma from '@/lib/prisma';
import { Prisma, Profile } from '@prisma/client';

// --- Service pour récupérer le profil d'un utilisateur ---
export const findProfileByUserId = async (userId: string): Promise<Profile | null> => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });
  return profile;
};

// --- Service pour créer ou mettre à jour le profil d'un utilisateur ---
export const upsertUserProfile = async (
  userId: string,
  data: Prisma.ProfileUpdateInput
): Promise<Profile> => {
  const profile = await prisma.profile.upsert({
    where: { userId },
    update: {
      bio: data.bio,
      avatarUrl: data.avatarUrl,
    },
    create: {
      user: { connect: { id: userId } },
      bio: data.bio as string | undefined,
      avatarUrl: data.avatarUrl as string | undefined,
    },
  });
  return profile;
};