import { Request, Response } from 'express';
import * as courseService from '../services/course.service';
import { UserRole } from '@prisma/client';

// Étend l'interface Request pour inclure notre propriété 'user'
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

// --- Contrôleur pour créer un cours ---
export const create = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const teacherId = req.user?.id;
    if (!teacherId) {
      return res.status(403).json({ message: 'User not authenticated' });
    }

    const course = await courseService.createCourse(req.body, teacherId);
    res.status(201).json(course);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

// --- Contrôleur pour récupérer tous les cours ---
export const getAll = async (req: Request, res: Response) => {
  try {
    const { page, limit, ...filters } = req.query;
    const pageNum = page ? parseInt(page as string, 10) : undefined;
    const limitNum = limit ? parseInt(limit as string, 10) : undefined;

    const result = await courseService.findAllCourses({
      page: pageNum,
      limit: limitNum,
      ...filters
    });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// --- Contrôleur pour récupérer un cours par ID ---
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await courseService.findCourseById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

// --- Contrôleur pour mettre à jour un cours ---
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCourse = await courseService.updateCourseById(id, req.body);
    res.status(200).json(updatedCourse);
  } catch (error: any) {
    // Gérer le cas où le cours à mettre à jour n'existe pas
    if (error.code === 'P2025') {
       return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// --- Contrôleur pour supprimer un cours ---
export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await courseService.deleteCourseById(id);
    res.status(204).send(); // 204 No Content pour une suppression réussie
  } catch (error: any) {
     // Gérer le cas où le cours à supprimer n'existe pas
    if (error.code === 'P2025') {
       return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};