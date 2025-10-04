import prisma from '@/lib/prisma';
import { Prisma, Course } from '@prisma/client';

// --- Service pour créer un cours ---
export const createCourse = async (
  courseData: Omit<Prisma.CourseCreateInput, 'teacher'>,
  teacherId: string
): Promise<Course> => {
  const course = await prisma.course.create({
    data: {
      ...courseData,
      teacher: {
        connect: { id: teacherId },
      },
    },
  });
  return course;
};

// --- Service pour récupérer tous les cours (avec filtres et pagination) ---
export const findAllCourses = async (params: {
  page?: number;
  limit?: number;
  level?: string;
  status?: string;
  featured?: boolean;
  search?: string;
}) => {
  const { page = 1, limit = 10, level, status, featured, search } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.CourseWhereInput = {};

  if (level) where.level = level as any;
  if (status) where.status = status as any;
  if (featured !== undefined) where.featured = featured;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take: limit,
      include: {
        teacher: {
          select: { firstName: true, lastName: true },
        },
        _count: {
          select: { lessons: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.course.count({ where }),
  ]);

  return {
    courses,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// --- Service pour récupérer un cours par son ID ---
export const findCourseById = async (id: string): Promise<Course | null> => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      teacher: {
        select: { id: true, firstName: true, lastName: true, profile: true },
      },
      lessons: {
        orderBy: { order: 'asc' },
      },
    },
  });
  return course;
};

// --- Service pour mettre à jour un cours ---
export const updateCourseById = async (
  id: string,
  updates: Prisma.CourseUpdateInput
): Promise<Course> => {
  const course = await prisma.course.update({
    where: { id },
    data: updates,
  });
  return course;
};

// --- Service pour supprimer un cours ---
export const deleteCourseById = async (id: string): Promise<Course> => {
  // Note : La suppression en cascade des leçons, etc., doit être configurée
  // dans le schéma Prisma pour que cela fonctionne correctement.
  const course = await prisma.course.delete({
    where: { id },
  });
  return course;
};