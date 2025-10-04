import { Router } from 'express';
import * as announcementController from '@/api/controllers/announcement.controller';
import { authenticateToken, authorizeRoles } from '@/api/middlewares/auth.middleware';
import { validate } from '@/api/middlewares/validation.middleware';
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  announcementIdParamSchema
} from '@/api/validations/announcement.validation';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Announcements
 *   description: API de gestion des annonces
 */

// --- Routes Publiques ---

/**
 * @swagger
 * /announcements:
 *   get:
 *     summary: Récupère la liste des annonces
 *     tags: [Announcements]
 *     parameters:
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *         description: Filtre les annonces pour un cours spécifique (inclut aussi les annonces globales)
 *     responses:
 *       200:
 *         description: Une liste d'annonces
 */
router.get('/', announcementController.getAll);

/**
 * @swagger
 * /announcements/{id}:
 *   get:
 *     summary: Récupère une annonce par son ID
 *     tags: [Announcements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'annonce
 *       404:
 *         description: Annonce non trouvée
 */
router.get('/:id', validate(announcementIdParamSchema), announcementController.getById);


// --- Routes de gestion (Admin ou Professeur) ---

const authorizedRoles: UserRole[] = [UserRole.ADMIN, UserRole.TEACHER];

/**
 * @swagger
 * /announcements:
 *   post:
 *     summary: Crée une nouvelle annonce (Admin, Teacher)
 *     tags: [Announcements]
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
 *               courseId: { type: string }
 *     responses:
 *       201:
 *         description: Annonce créée
 */
router.post(
  '/',
  authenticateToken,
  authorizeRoles(authorizedRoles),
  validate(createAnnouncementSchema),
  announcementController.create
);

/**
 * @swagger
 * /announcements/{id}:
 *   put:
 *     summary: Met à jour une annonce (Admin, Teacher)
 *     tags: [Announcements]
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
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               courseId: { type: string }
 *     responses:
 *       200:
 *         description: Annonce mise à jour
 *       404:
 *         description: Annonce non trouvée
 */
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(authorizedRoles),
  validate(updateAnnouncementSchema),
  announcementController.update
);

/**
 * @swagger
 * /announcements/{id}:
 *   delete:
 *     summary: Supprime une annonce (Admin, Teacher)
 *     tags: [Announcements]
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
 *         description: Annonce supprimée
 *       404:
 *         description: Annonce non trouvée
 */
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(authorizedRoles),
  validate(announcementIdParamSchema),
  announcementController.remove
);

export default router;