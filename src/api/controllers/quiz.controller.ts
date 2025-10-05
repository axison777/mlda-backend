import { Request, Response } from 'express';
import * as quizService from '../services/quiz.service';
import { UserRole } from '@prisma/client';

// Étend l'interface Request pour inclure notre propriété 'user'
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

// --- Contrôleur pour créer un Quiz ---
export const create = async (req: Request, res: Response) => {
  try {
    // Note: Une validation plus robuste (avec Zod, par exemple) serait idéale ici.
    const quiz = await quizService.createQuiz(req.body);
    res.status(201).json(quiz);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating quiz', error: error.message });
  }
};

// --- Contrôleur pour récupérer un Quiz par ID ---
// La logique diffère selon le rôle de l'utilisateur
export const getById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role;

    let quiz;
    if (userRole === UserRole.ADMIN || userRole === UserRole.TEACHER) {
      // Les admins/professeurs voient les réponses
      quiz = await quizService.getQuizWithAnswers(id);
    } else {
      // Les étudiants ne voient pas les réponses
      quiz = await quizService.getQuizForStudent(id);
    }

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching quiz', error: error.message });
  }
};

// --- Contrôleur pour soumettre une tentative de Quiz ---
export const submitAttempt = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user?.id;
    const { quizId } = req.params;
    const submission = req.body; // { answers: [...], timeSpent: ... }

    if (!studentId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const result = await quizService.submitQuizAttempt(studentId, quizId, submission);
    res.status(200).json({ result, message: 'Quiz attempt submitted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error submitting quiz attempt', error: error.message });
  }
};