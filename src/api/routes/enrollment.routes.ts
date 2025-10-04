import { Router } from 'express';
import * as enrollmentController from '@/api/controllers/enrollment.controller';
import { authenticateToken } from '@/api/middlewares/auth.middleware';
import { validate } from '@/api/middlewares/validation.middleware';
import { enrollSchema } from '@/api/validations/enrollment.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: API de gestion des inscriptions aux cours
 */

// Toutes les routes ici nécessitent une authentification
router.use(authenticateToken);

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Inscrit l'utilisateur connecté à un cours
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: cuid
 *     responses:
 *       201:
 *         description: Inscription réussie
 *       409:
 *         description: Déjà inscrit à ce cours
 */
router.post('/', validate(enrollSchema), enrollmentController.enroll);

/**
 * @swagger
 * /enrollments/my-courses:
 *   get:
 *     summary: Récupère la liste des cours auxquels l'utilisateur est inscrit
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Une liste d'inscriptions
 */
router.get('/my-courses', enrollmentController.getMyEnrollments);

export default router;