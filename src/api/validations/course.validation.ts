import { z } from 'zod';
import { CourseLevel, PublishStatus } from '@prisma/client';

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    level: z.nativeEnum(CourseLevel, { errorMap: () => ({ message: 'Invalid course level' }) }),
    price: z.number().positive('Price must be a positive number'),
    status: z.nativeEnum(PublishStatus).optional(),
    featured: z.boolean().optional(),
    thumbnail: z.string().url().optional(),
  }),
});

export const updateCourseSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    level: z.nativeEnum(CourseLevel).optional(),
    price: z.number().positive().optional(),
    status: z.nativeEnum(PublishStatus).optional(),
    featured: z.boolean().optional(),
    thumbnail: z.string().url().optional(),
  }),
  params: z.object({
    id: z.string().cuid('Invalid course ID'),
  }),
});

export const courseIdParamSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid course ID'),
  }),
});