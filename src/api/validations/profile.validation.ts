import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    bio: z.string().optional(),
    avatarUrl: z.string().url('Avatar URL must be a valid URL').optional(),
  }),
});

export const publicProfileParamsSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid user ID'),
  }),
});