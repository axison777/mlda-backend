import { Request, Response } from 'express';
import * as lessonService from '@/api/services/lesson.service';

// --- Contrôleur pour créer une leçon ---
export const create = async (req: Request, res: Response) => {
  try {
    const { courseId, ...lessonData } = req.body;
    const lesson = await lessonService.createLesson(lessonData, courseId);
    res.status(201).json(lesson);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating lesson', error: error.message });
  }
};

// --- Contrôleur pour récupérer les leçons d'un cours ---
export const getByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const lessons = await lessonService.findLessonsByCourse(courseId);
    res.status(200).json(lessons);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching lessons for the course', error: error.message });
  }
};

// --- Contrôleur pour récupérer une leçon par ID ---
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lesson = await lessonService.findLessonById(id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.status(200).json(lesson);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching lesson', error: error.message });
  }
};

// --- Contrôleur pour mettre à jour une leçon ---
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedLesson = await lessonService.updateLessonById(id, req.body);
    res.status(200).json(updatedLesson);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.status(500).json({ message: 'Error updating lesson', error: error.message });
  }
};

// --- Contrôleur pour supprimer une leçon ---
export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await lessonService.deleteLessonById(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.status(500).json({ message: 'Error deleting lesson', error: error.message });
  }
};