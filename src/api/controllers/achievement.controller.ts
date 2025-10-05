import { Request, Response } from 'express';
import * as achievementService from '../services/achievement.service';

// --- Contrôleur pour créer un succès ---
export const create = async (req: Request, res: Response) => {
  try {
    const achievement = await achievementService.createAchievement(req.body);
    res.status(201).json(achievement);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating achievement', error: error.message });
  }
};

// --- Contrôleur pour récupérer tous les succès ---
export const getAll = async (req: Request, res: Response) => {
  try {
    const achievements = await achievementService.findAllAchievements();
    res.status(200).json(achievements);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching achievements', error: error.message });
  }
};

// --- Contrôleur pour récupérer un succès par ID ---
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const achievement = await achievementService.findAchievementById(id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.status(200).json(achievement);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching achievement', error: error.message });
  }
};

// --- Contrôleur pour mettre à jour un succès ---
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedAchievement = await achievementService.updateAchievementById(id, req.body);
    res.status(200).json(updatedAchievement);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.status(500).json({ message: 'Error updating achievement', error: error.message });
  }
};

// --- Contrôleur pour supprimer un succès ---
export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await achievementService.deleteAchievementById(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.status(500).json({ message: 'Error deleting achievement', error: error.message });
  }
};

// --- Contrôleur pour récupérer les succès de l'utilisateur connecté ---
export const getMyAchievements = async (req: any, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const userAchievements = await achievementService.findUserAchievements(userId);
        res.status(200).json(userAchievements);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching user achievements', error: error.message });
    }
};