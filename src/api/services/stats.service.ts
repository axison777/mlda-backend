import prisma from '@/lib/prisma';
import { UserRole, PaymentStatus } from '@prisma/client';

// --- Service pour les statistiques de l'Administrateur ---
export const getAdminStats = async () => {
  const [
    totalUsers,
    totalStudents,
    totalTeachers,
    totalCourses,
    totalEnrollments,
    totalRevenue,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.count({ where: { role: UserRole.STUDENT } }),
    prisma.user.count({ where: { role: UserRole.TEACHER } }),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: PaymentStatus.COMPLETED },
    }),
  ]);

  return {
    totalUsers,
    totalStudents,
    totalTeachers,
    totalCourses,
    totalEnrollments,
    totalRevenue: totalRevenue._sum.amount || 0,
  };
};

// --- Service pour les statistiques d'un Professeur ---
export const getTeacherStats = async (teacherId: string) => {
  const [
    totalCourses,
    totalStudents,
    totalRevenue,
  ] = await prisma.$transaction([
    prisma.course.count({ where: { teacherId } }),
    prisma.enrollment.count({ where: { course: { teacherId } } }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: PaymentStatus.COMPLETED,
        items: { some: { course: { teacherId } } },
      },
    }),
  ]);

  return {
    totalCourses,
    totalStudents,
    totalRevenue: totalRevenue._sum.amount || 0,
  };
};

// --- Service pour les statistiques d'un Étudiant ---
export const getStudentStats = async (studentId: string) => {
    const [
        coursesEnrolled,
        lessonsCompleted,
        timeSpent,
        avgQuizScore,
    ] = await prisma.$transaction([
        prisma.enrollment.count({ where: { studentId } }),
        prisma.lessonProgress.count({ where: { studentId, completed: true } }),
        prisma.lessonProgress.aggregate({
            _sum: { timeSpent: true },
            where: { studentId },
        }),
        prisma.quizAttempt.aggregate({
            _avg: { score: true },
            where: { studentId },
        })
    ]);

    return {
        coursesEnrolled,
        lessonsCompleted,
        // timeSpent est en secondes, on peut le convertir en heures/minutes côté frontend
        timeSpent: timeSpent._sum.timeSpent || 0,
        averageQuizScore: avgQuizScore._avg.score || 0,
    };
};