import { z } from 'zod';

export const enrollSchema = z.object({
  body: z.object({
    courseId: z.string().cuid('A valid course ID is required'),
  }),
});