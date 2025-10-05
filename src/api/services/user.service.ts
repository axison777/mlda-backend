import prisma from '../../lib/prisma';
import { Prisma, User, UserRole } from '@prisma/client';

// --- Service pour récupérer tous les utilisateurs (avec filtres et pagination) ---
export const findAllUsers = async (params: {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
}) => {
  const { page = 1, limit = 10, role, search } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {};

  if (role) where.role = role;
  if (search) {
    where.OR = [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: { // Exclure le mot de passe
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// --- Service pour récupérer un utilisateur par son ID ---
export const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { // Exclure le mot de passe
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      profile: true,
      enrollments: {
        select: { course: { select: { id: true, title: true } } },
      },
    },
  });
  return user;
};

// --- Service pour mettre à jour un utilisateur ---
export const updateUserById = async (
  id: string,
  updates: Prisma.UserUpdateInput
): Promise<Omit<User, 'password'>> => {
  // S'assurer que le mot de passe ne peut pas être mis à jour via cette fonction
  if (updates.password) {
    delete (updates as any).password;
  }

  const user = await prisma.user.update({
    where: { id },
    data: updates,
  });

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// --- Service pour supprimer un utilisateur ---
export const deleteUserById = async (id: string): Promise<Omit<User, 'password'>> => {
  // Note : La suppression en cascade doit être gérée avec soin.
  // Prisma peut être configuré pour cela.
  const user = await prisma.user.delete({
    where: { id },
  });
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};