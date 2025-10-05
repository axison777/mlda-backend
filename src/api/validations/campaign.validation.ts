import { z } from 'zod';
import { CampaignStatus } from '@prisma/client';

export const createCampaignSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Campaign name is required'),
    startDate: z.coerce.date({ message: "Invalid start date" }),
    endDate: z.coerce.date({ message: "Invalid end date" }),
    budget: z.number().positive('Budget must be a positive number'),
    status: z.nativeEnum(CampaignStatus).optional(),
  }),
});

export const updateCampaignSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    budget: z.number().positive().optional(),
    status: z.nativeEnum(CampaignStatus).optional(),
  }),
  params: z.object({
    id: z.string().cuid('Invalid campaign ID'),
  }),
});

export const campaignIdParamSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid campaign ID'),
  }),
});