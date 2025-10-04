import { z } from 'zod';

export const createLessonSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    videoUrl: z.string().url().optional(),
    order: z.number().int().positive('Order must be a positive integer'),
    courseId: z.string().cuid('A valid course ID is required'),
  }),
});

export const updateLessonSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    videoUrl: z.string().url().optional(),
    order: z.number().int().positive().optional(),
  }),
  params: z.object({
    id: z.string().cuid('Invalid lesson ID'),
  }),
});

export const lessonIdParamSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid lesson ID'),
  }),
});

export const courseIdParamSchema = z.object({
  params: z.object({
    courseId: z.string().cuid('Invalid course ID'),
  }),
});