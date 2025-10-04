import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    courseId: z.string().cuid('Invalid course ID').optional(),
  }),
});

export const updateAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    courseId: z.string().cuid('Invalid course ID').optional().nullable(),
  }),
  params: z.object({
    id: z.string().cuid('Invalid announcement ID'),
  }),
});

export const announcementIdParamSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid announcement ID'),
  }),
});