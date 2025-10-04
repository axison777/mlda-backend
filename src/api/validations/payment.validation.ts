import { z } from 'zod';

const cartItemSchema = z.object({
  id: z.string().cuid('Each cart item must have a valid CUID'),
  type: z.enum(['COURSE', 'PRODUCT'], {
    errorMap: () => ({ message: "Item type must be 'COURSE' or 'PRODUCT'" }),
  }),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

export const createPaymentSchema = z.object({
  body: z.object({
    cart: z.array(cartItemSchema).min(1, 'Cart cannot be empty'),
  }),
});