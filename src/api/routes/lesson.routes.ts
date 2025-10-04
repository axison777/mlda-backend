import { Router } from 'express';
import * as lessonController from '@/api/controllers/lesson.controller';
import { authenticateToken, authorizeRoles } from '@/api/middlewares/auth.middleware';
import { validate } from '@/api/middlewares/validation.middleware';
import {
  createLessonSchema,
  updateLessonSchema,
  lessonIdParamSchema,
  courseIdParamSchema
} from '@/api/validations/lesson.validation';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: API de gestion des leçons
 */

// --- Routes Publiques ---

/**
 * @swagger
 * /lessons/course/{courseId}:
 *   get:
 *     summary: Récupère toutes les leçons d'un cours spécifique
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du cours
 *     responses:
 *       200:
 *         description: Une liste de leçons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 */
router.get('/course/:courseId', validate(courseIdParamSchema), lessonController.getByCourse);

/**
 * @swagger
 * /lessons/{id}:
 *   get:
 *     summary: Récupère une leçon par son ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la leçon
 *     responses:
 *       200:
 *         description: Détails de la leçon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Leçon non trouvée
 */
router.get('/:id', validate(lessonIdParamSchema), lessonController.getById);


// --- Routes Protégées (Authentification requise) ---

const authorizedRoles: UserRole[] = [UserRole.ADMIN, UserRole.TEACHER];

/**
 * @swagger
 * /lessons:
 *   post:
 *     summary: Crée une nouvelle leçon (Admin, Teacher)
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               order: { type: integer }
 *               courseId: { type: string }
 *     responses:
 *       201:
 *         description: Leçon créée avec succès
 *       401:
 *         description: Non autorisé
 */
router.post(
  '/',
  authenticateToken,
  authorizeRoles(authorizedRoles),
  validate(createLessonSchema),
  lessonController.create
);

/**
 * @swagger
 * /lessons/{id}:
 *   put:
 *     summary: Met à jour une leçon (Admin, Teacher)
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lesson'
 *     responses:
 *       200:
 *         description: Leçon mise à jour
 *       404:
 *         description: Leçon non trouvée
 */
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(authorizedRoles),
  validate(updateLessonSchema),
  lessonController.update
);

/**
 * @swagger
 * /lessons/{id}:
 *   delete:
 *     summary: Supprime une leçon (Admin, Teacher)
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Leçon supprimée avec succès
 *       404:
 *         description: Leçon non trouvée
 */
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(authorizedRoles),
  validate(lessonIdParamSchema),
  lessonController.remove
);

export default router;