import prisma from '../../lib/prisma';
import { Prisma, Product } from '@prisma/client';

// --- Service pour créer un produit ---
export const createProduct = async (data: Prisma.ProductCreateInput): Promise<Product> => {
  const product = await prisma.product.create({ data });
  return product;
};

// --- Service pour récupérer tous les produits (avec filtres et pagination) ---
export const findAllProducts = async (params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  active?: boolean;
}) => {
  const { page = 1, limit = 10, category, search, active } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {};

  if (category) where.category = { equals: category };
  if (active !== undefined) where.active = active;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// --- Service pour récupérer un produit par son ID ---
export const findProductById = async (id: string): Promise<Product | null> => {
  const product = await prisma.product.findUnique({ where: { id } });
  return product;
};

// --- Service pour mettre à jour un produit ---
export const updateProductById = async (
  id: string,
  updates: Prisma.ProductUpdateInput
): Promise<Product> => {
  const product = await prisma.product.update({
    where: { id },
    data: updates,
  });
  return product;
};

// --- Service pour supprimer un produit ---
export const deleteProductById = async (id: string): Promise<Product> => {
  const product = await prisma.product.delete({ where: { id } });
  return product;
};