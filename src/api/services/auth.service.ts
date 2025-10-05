import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- Service pour l'inscription ---
export const registerUser = async (userData: Prisma.UserCreateInput) => {
  // 1. Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // 2. Hacher le mot de passe
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // 3. Créer l'utilisateur dans la base de données
  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });

  // 4. Retirer le mot de passe de l'objet retourné
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// --- Service pour la connexion ---
export const loginUser = async (credentials: Pick<Prisma.UserCreateInput, 'email' | 'password'>) => {
  // 1. Trouver l'utilisateur par email
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // 2. Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // 3. S'assurer que la clé secrète JWT est définie
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET is not defined in the environment variables.");
    // Ne pas exposer les détails de l'erreur interne au client
    throw new Error("Authentication configuration error.");
  }

  // 4. Générer le token JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    jwtSecret
  );

  // 5. Retirer le mot de passe et retourner l'utilisateur et le token
  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};