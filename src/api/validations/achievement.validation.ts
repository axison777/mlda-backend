import { z } from 'zod';

export const createAchievementSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Achievement name is required'),
    description: z.string().min(1, 'Description is required'),
    iconUrl: z.string().url('Must be a valid URL').optional(),
  }),
});

export const updateAchievementSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    iconUrl: z.string().url().optional(),
  }),
  params: z.object({
    id: z.string().cuid('Invalid achievement ID'),
  }),
});

export const achievementIdParamSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid achievement ID'),
  }),
});