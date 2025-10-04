import { Request, Response } from 'express';
import * as userService from '@/api/services/user.service';

// --- Contrôleur pour récupérer tous les utilisateurs ---
export const getAll = async (req: Request, res: Response) => {
  try {
    const { page, limit, ...filters } = req.query;
    const pageNum = page ? parseInt(page as string, 10) : undefined;
    const limitNum = limit ? parseInt(limit as string, 10) : undefined;

    const result = await userService.findAllUsers({
      page: pageNum,
      limit: limitNum,
      ...filters
    });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// --- Contrôleur pour récupérer un utilisateur par ID ---
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.findUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// --- Contrôleur pour mettre à jour un utilisateur ---
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedUser = await userService.updateUserById(id, req.body);
    res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error.code === 'P2025') {
       return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// --- Contrôleur pour supprimer un utilisateur ---
export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUserById(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
       return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};