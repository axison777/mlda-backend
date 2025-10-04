import { z } from 'zod';

export const updateLessonProgressSchema = z.object({
  params: z.object({
    lessonId: z.string().cuid('Invalid lesson ID'),
  }),
  body: z.object({
    completed: z.boolean({ required_error: 'The "completed" field is required' }),
    timeSpent: z.number().int().positive().optional(),
  }),
});

export const getCourseProgressSchema = z.object({
  params: z.object({
    courseId: z.string().cuid('Invalid course ID'),
  }),
});