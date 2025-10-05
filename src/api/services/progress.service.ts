import prisma from '../../lib/prisma';
import { LessonProgress, Prisma } from '@prisma/client';
import { awardAchievementToUser } from './achievement.service';

// --- Fonction utilitaire pour mettre à jour la progression du cours ---
const updateOverallCourseProgress = async (
  studentId: string,
  courseId: string,
  prismaClient: Prisma.TransactionClient | typeof prisma = prisma
) => {
  // Compter le nombre total de leçons dans le cours
  const totalLessons = await prismaClient.lesson.count({
    where: { courseId },
  });

  if (totalLessons === 0) {
    return; // Éviter la division par zéro
  }

  // Compter le nombre de leçons terminées par l'étudiant dans ce cours
  const completedLessons = await prismaClient.lessonProgress.count({
    where: {
      studentId,
      lesson: {
        courseId,
      },
      completed: true,
    },
  });

  // Calculer le pourcentage de progression
  const progressPercentage = (completedLessons / totalLessons) * 100;

  // Mettre à jour l'inscription de l'étudiant avec le nouveau pourcentage
  await prismaClient.enrollment.update({
    where: {
      studentId_courseId: { studentId, courseId },
    },
    data: {
      progress: progressPercentage,
    },
  });

  // Si le cours est terminé, tenter d'attribuer un succès
  if (progressPercentage >= 100) {
    const achievement = await prismaClient.achievement.findUnique({
      where: { code: 'COURSE_COMPLETED' }, // L'admin doit créer ce succès
      select: { id: true },
    });

    if (achievement) {
      await awardAchievementToUser(studentId, achievement.id, prismaClient);
    }
  }
};

// --- Service pour mettre à jour la progression d'une leçon ---
export const updateLessonProgress = async (
  studentId: string,
  lessonId: string,
  data: { completed: boolean; timeSpent?: number }
): Promise<LessonProgress> => {
  return prisma.$transaction(async (tx) => {
    // 1. Mettre à jour ou créer la progression de la leçon
    const lessonProgress = await tx.lessonProgress.upsert({
      where: {
        studentId_lessonId: { studentId, lessonId },
      },
      update: {
        completed: data.completed,
        timeSpent: {
          increment: data.timeSpent || 0,
        },
      },
      create: {
        completed: data.completed,
        timeSpent: data.timeSpent || 0,
        student: { connect: { id: studentId } },
        lesson: { connect: { id: lessonId } },
      },
      include: {
        lesson: {
          select: { courseId: true },
        },
      },
    });

    // 2. Recalculer la progression globale et attribuer des succès (dans la même transaction)
    await updateOverallCourseProgress(studentId, lessonProgress.lesson.courseId, tx);

    return lessonProgress;
  });
};

// --- Service pour récupérer la progression d'un étudiant pour un cours ---
export const getCourseProgress = async (studentId: string, courseId: string) => {
  const progress = await prisma.lessonProgress.findMany({
    where: {
      studentId,
      lesson: {
        courseId,
      },
    },
    select: {
      lessonId: true,
      completed: true,
    },
  });

  return progress;
};