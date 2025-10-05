import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';
import { UserRole } from '@prisma/client';

// Étend l'interface Request d'Express pour inclure notre propriété 'user'
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

// 1. Middleware pour authentifier le token
export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: UserRole };

    // Vérifier si l'utilisateur existe toujours en base de données
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = { id: user.id, role: user.role }; // Attacher l'utilisateur à la requête
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// 2. Middleware pour autoriser des rôles spécifiques
export const authorizeRoles = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden: No role assigned' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Forbidden: Role ${req.user.role} is not authorized` });
    }

    next();
  };
};