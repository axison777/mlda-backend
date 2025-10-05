import { Request, Response } from 'express';
import * as statsService from '../services/stats.service';
import { UserRole } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

// --- Contrôleur pour les statistiques de l'Admin ---
export const getAdminDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await statsService.getAdminStats();
    res.status(200).json(stats);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching admin stats', error: error.message });
  }
};

// --- Contrôleur pour les statistiques du Professeur ---
export const getTeacherDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const stats = await statsService.getTeacherStats(teacherId);
    res.status(200).json(stats);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching teacher stats', error: error.message });
  }
};

// --- Contrôleur pour les statistiques de l'Étudiant ---
export const getStudentDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        if (!studentId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const stats = await statsService.getStudentStats(studentId);
        res.status(200).json(stats);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching student stats', error: error.message });
    }
};