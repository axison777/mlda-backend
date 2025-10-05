import { Router } from 'express';
import * as progressController from '../controllers/progress.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { updateLessonProgressSchema, getCourseProgressSchema } from '../validations/progress.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: API de suivi de la progression des étudiants
 */

// Toutes les routes ici nécessitent une authentification
router.use(authenticateToken);

/**
 * @swagger
 * /progress/lesson/{lessonId}:
 *   post:
 *     summary: Met à jour la progression d'une leçon pour l'utilisateur connecté
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Progression mise à jour
 */
router.post('/lesson/:lessonId', validate(updateLessonProgressSchema), progressController.updateLessonProgress);

/**
 * @swagger
 * /progress/course/{courseId}:
 *   get:
 *     summary: Récupère la progression de l'utilisateur pour un cours spécifique
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des progressions de leçons pour le cours
 */
router.get('/course/:courseId', validate(getCourseProgressSchema), progressController.getCourseProgress);

export default router;