import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive('Price must be a positive number'),
    imageUrl: z.string().url('Image URL must be a valid URL').optional(),
    category: z.string().min(1, 'Category is required'),
    active: z.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    imageUrl: z.string().url().optional(),
    category: z.string().min(1).optional(),
    active: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().cuid('Invalid product ID'),
  }),
});

export const productIdParamSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid product ID'),
  }),
});