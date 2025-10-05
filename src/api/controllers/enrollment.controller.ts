import { Request, Response } from 'express';
import * as enrollmentService from '../services/enrollment.service';
import { UserRole } from '@prisma/client';

// Étend l'interface Request pour inclure notre propriété 'user'
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

// --- Contrôleur pour inscrire un étudiant à un cours ---
export const enroll = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user?.id;
    const { courseId } = req.body;

    if (!studentId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const enrollment = await enrollmentService.enrollStudentInCourse(studentId, courseId);
    res.status(201).json({ enrollment, message: 'Successfully enrolled in course' });
  } catch (error: any) {
    if (error.message.includes('already enrolled')) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error enrolling in course', error: error.message });
  }
};

// --- Contrôleur pour récupérer les inscriptions de l'utilisateur connecté ---
export const getMyEnrollments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const enrollments = await enrollmentService.findUserEnrollments(studentId);
    res.status(200).json({ enrollments });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching user enrollments', error: error.message });
  }
};