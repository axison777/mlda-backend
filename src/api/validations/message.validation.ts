import { z } from 'zod';

export const sendMessageSchema = z.object({
  body: z.object({
    recipientId: z.string().cuid('A valid recipient ID is required'),
    content: z.string().min(1, 'Message content cannot be empty'),
  }),
});

export const conversationParamsSchema = z.object({
  params: z.object({
    otherUserId: z.string().cuid('A valid user ID is required for the conversation'),
  }),
});