import { Request, Response } from 'express';
import * as progressService from '../services/progress.service';
import { UserRole } from '@prisma/client';

// Étend l'interface Request pour inclure notre propriété 'user'
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

// --- Contrôleur pour mettre à jour la progression d'une leçon ---
export const updateLessonProgress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user?.id;
    const { lessonId } = req.params;
    const { completed, timeSpent } = req.body;

    if (!studentId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const progress = await progressService.updateLessonProgress(studentId, lessonId, { completed, timeSpent });
    res.status(200).json({ progress, message: 'Progress updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating lesson progress', error: error.message });
  }
};

// --- Contrôleur pour récupérer la progression d'un cours ---
export const getCourseProgress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user?.id;
    const { courseId } = req.params;

    if (!studentId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const progress = await progressService.getCourseProgress(studentId, courseId);
    res.status(200).json({ progress });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching course progress', error: error.message });
  }
};