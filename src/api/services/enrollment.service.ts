import prisma from '../../lib/prisma';
import { Enrollment, Prisma } from '@prisma/client';

// --- Service pour inscrire un étudiant à un cours ---
export const enrollStudentInCourse = async (
  studentId: string,
  courseId: string
): Promise<Enrollment> => {
  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        student: {
          connect: { id: studentId },
        },
        course: {
          connect: { id: courseId },
        },
      },
    });
    return enrollment;
  } catch (error) {
    // Gérer l'erreur de contrainte unique de Prisma (P2002)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('Student is already enrolled in this course.');
    }
    // Renvoyer les autres erreurs
    throw error;
  }
};

// --- Service pour récupérer les inscriptions d'un utilisateur ---
export const findUserEnrollments = async (studentId: string): Promise<Enrollment[]> => {
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId },
    include: {
      course: {
        include: {
          teacher: {
            select: { firstName: true, lastName: true },
          },
          _count: {
            select: { lessons: true },
          },
        },
      },
    },
  });
  return enrollments;
};