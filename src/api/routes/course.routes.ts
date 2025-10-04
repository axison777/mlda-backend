import { Router } from 'express';
import * as courseController from '@/api/controllers/course.controller';
import { authenticateToken, authorizeRoles } from '@/api/middlewares/auth.middleware';
import { validate } from '@/api/middlewares/validation.middleware';
import { createCourseSchema, updateCourseSchema, courseIdParamSchema } from '@/api/validations/course.validation';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: API de gestion des cours
 */

// --- Routes Publiques ---

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Récupère une liste de cours avec filtres et pagination
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre de cours par page
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         description: Filtre par niveau de cours (A1, B2, etc.)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par mot-clé dans le titre ou la description
 *     responses:
 *       200:
 *         description: Une liste de cours
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 pagination:
 *                   type: object
 */
router.get('/', courseController.getAll);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Récupère un cours par son ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du cours
 *     responses:
 *       200:
 *         description: Détails du cours
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Cours non trouvé
 */
router.get('/:id', validate(courseIdParamSchema), courseController.getById);

// --- Routes Protégées (Authentification requise) ---

const authorizedRoles: UserRole[] = [UserRole.ADMIN, UserRole.TEACHER];

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Crée un nouveau cours (Admin, Teacher)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Cours créé avec succès
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Rôle non autorisé
 */
router.post(
  '/',
  authenticateToken,
  authorizeRoles(authorizedRoles),
  validate(createCourseSchema),
  courseController.create
);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Met à jour un cours existant (Admin, Teacher)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du cours
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Cours mis à jour
 *       404:
 *         description: Cours non trouvé
 */
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(authorizedRoles),
  validate(updateCourseSchema),
  courseController.update
);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Supprime un cours (Admin, Teacher)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du cours
 *     responses:
 *       204:
 *         description: Cours supprimé avec succès
 *       404:
 *         description: Cours non trouvé
 */
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(authorizedRoles),
  validate(courseIdParamSchema),
  courseController.remove
);

export default router;