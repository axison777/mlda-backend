import { Router } from 'express';
import * as statsController from '@/api/controllers/stats.controller';
import { authenticateToken, authorizeRoles } from '@/api/middlewares/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: API de récupération des statistiques des tableaux de bord
 */

// Toutes les routes ici nécessitent une authentification
router.use(authenticateToken);

/**
 * @swagger
 * /stats/admin:
 *   get:
 *     summary: Récupère les statistiques pour le tableau de bord de l'administrateur
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques de l'administrateur
 */
router.get(
  '/admin',
  authorizeRoles([UserRole.ADMIN]),
  statsController.getAdminDashboardStats
);

/**
 * @swagger
 * /stats/teacher:
 *   get:
 *     summary: Récupère les statistiques pour le tableau de bord du professeur connecté
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques du professeur
 */
router.get(
  '/teacher',
  authorizeRoles([UserRole.TEACHER]),
  statsController.getTeacherDashboardStats
);

/**
 * @swagger
 * /stats/student:
 *   get:
 *     summary: Récupère les statistiques pour le tableau de bord de l'étudiant connecté
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques de l'étudiant
 */
router.get(
  '/student',
  authorizeRoles([UserRole.STUDENT]),
  statsController.getStudentDashboardStats
);

export default router;