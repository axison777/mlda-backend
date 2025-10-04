import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid user ID'),
  }),
  body: z.object({
    email: z.string().email().optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    role: z.nativeEnum(UserRole).optional(),
    // Ne pas inclure le mot de passe ici pour la sécurité
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid user ID'),
  }),
});