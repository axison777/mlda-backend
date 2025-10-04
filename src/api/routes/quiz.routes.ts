import { Router } from 'express';
import * as quizController from '@/api/controllers/quiz.controller';
import { authenticateToken, authorizeRoles } from '@/api/middlewares/auth.middleware';
import { validate } from '@/api/middlewares/validation.middleware';
import { createQuizSchema, submitAttemptSchema, quizIdParamSchema } from '@/api/validations/quiz.validation';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: API de gestion des quiz
 */

// Toutes les routes ici nécessitent une authentification
router.use(authenticateToken);

/**
 * @swagger
 * /quiz:
 *   post:
 *     summary: Crée un nouveau quiz (Admin, Teacher)
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *     responses:
 *       201:
 *         description: Quiz créé avec succès
 */
router.post(
  '/',
  authorizeRoles([UserRole.ADMIN, UserRole.TEACHER]),
  validate(createQuizSchema),
  quizController.create
);

/**
 * @swagger
 * /quiz/{quizId}/attempt:
 *   post:
 *     summary: Soumet une tentative de réponse à un quiz (Student)
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
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
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId: { type: string }
 *                     choiceId: { type: string }
 *               timeSpent: { type: integer }
 *     responses:
 *       200:
 *         description: Tentative soumise avec succès
 */
router.post(
  '/:quizId/attempt',
  authorizeRoles([UserRole.STUDENT]),
  validate(submitAttemptSchema),
  quizController.submitAttempt
);

/**
 * @swagger
 * /quiz/{id}:
 *   get:
 *     summary: Récupère un quiz par son ID
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du quiz (les réponses sont masquées pour les étudiants)
 *       404:
 *         description: Quiz non trouvé
 */
router.get('/:id', validate(quizIdParamSchema), quizController.getById);


export default router;