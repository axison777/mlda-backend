import prisma from '../../lib/prisma';
import { Prisma, Announcement } from '@prisma/client';

// --- Service pour créer une annonce ---
export const createAnnouncement = async (
  data: Omit<Prisma.AnnouncementCreateInput, 'author'>,
  authorId: string
): Promise<Announcement> => {
  const announcement = await prisma.announcement.create({
    data: {
      ...data,
      author: {
        connect: { id: authorId },
      },
    },
  });
  return announcement;
};

// --- Service pour récupérer toutes les annonces ---
// On peut filtrer par cours ou récupérer les annonces globales
export const findAllAnnouncements = async (params: { courseId?: string }): Promise<Announcement[]> => {
  const where: Prisma.AnnouncementWhereInput = {
    // Si courseId est fourni, on récupère les annonces de ce cours ET les annonces globales
    // Sinon, on ne récupère que les annonces globales
    OR: params.courseId
      ? [{ courseId: params.courseId }, { courseId: null }]
      : [{ courseId: null }],
  };

  const announcements = await prisma.announcement.findMany({
    where,
    include: {
      author: {
        select: { firstName: true, lastName: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return announcements;
};

// --- Service pour récupérer une annonce par son ID ---
export const findAnnouncementById = async (id: string): Promise<Announcement | null> => {
  const announcement = await prisma.announcement.findUnique({ where: { id } });
  return announcement;
};

// --- Service pour mettre à jour une annonce ---
export const updateAnnouncementById = async (
  id: string,
  updates: Prisma.AnnouncementUpdateInput
): Promise<Announcement> => {
  const announcement = await prisma.announcement.update({
    where: { id },
    data: updates,
  });
  return announcement;
};

// --- Service pour supprimer une annonce ---
export const deleteAnnouncementById = async (id: string): Promise<Announcement> => {
  const announcement = await prisma.announcement.delete({ where: { id } });
  return announcement;
};