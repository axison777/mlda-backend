import prisma from '../../lib/prisma';
import { Prisma, Lesson } from '@prisma/client';

// --- Service pour créer une leçon ---
export const createLesson = async (
  lessonData: Omit<Prisma.LessonCreateInput, 'course'>,
  courseId: string
): Promise<Lesson> => {
  const lesson = await prisma.lesson.create({
    data: {
      ...lessonData,
      course: {
        connect: { id: courseId },
      },
    },
  });
  return lesson;
};

// --- Service pour récupérer les leçons d'un cours ---
export const findLessonsByCourse = async (courseId: string): Promise<Lesson[]> => {
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { order: 'asc' },
  });
  return lessons;
};

// --- Service pour récupérer une leçon par son ID ---
export const findLessonById = async (id: string): Promise<Lesson | null> => {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
  });
  return lesson;
};

// --- Service pour mettre à jour une leçon ---
export const updateLessonById = async (
  id: string,
  updates: Prisma.LessonUpdateInput
): Promise<Lesson> => {
  const lesson = await prisma.lesson.update({
    where: { id },
    data: updates,
  });
  return lesson;
};

// --- Service pour supprimer une leçon ---
export const deleteLessonById = async (id: string): Promise<Lesson> => {
  const lesson = await prisma.lesson.delete({
    where: { id },
  });
  return lesson;
};