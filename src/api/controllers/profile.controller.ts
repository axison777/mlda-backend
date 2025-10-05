import { Request, Response } from 'express';
import * as profileService from '../services/profile.service';
import * as userService from '../services/user.service';
import { UserRole } from '@prisma/client';

// Étend l'interface Request pour inclure notre propriété 'user'
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

// --- Contrôleur pour récupérer le profil de l'utilisateur connecté ---
export const getMyProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const profile = await profileService.findProfileByUserId(userId);
    // Le profil peut être null si l'utilisateur n'en a pas encore créé
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// --- Contrôleur pour mettre à jour le profil de l'utilisateur connecté ---
export const updateMyProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const profile = await profileService.upsertUserProfile(userId, req.body);
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// --- Contrôleur pour récupérer le profil public d'un utilisateur par son ID ---
export const getPublicProfileById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // On récupère les infos publiques de l'utilisateur et de son profil
        const user = await userService.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // On ne renvoie que les informations non sensibles
        const { email, ...publicUser } = user;
        res.status(200).json(publicUser);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching public profile', error: error.message });
    }
};