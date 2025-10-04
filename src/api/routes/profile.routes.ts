import { Router } from 'express';
import * as profileController from '@/api/controllers/profile.controller';
import { authenticateToken } from '@/api/middlewares/auth.middleware';
import { validate } from '@/api/middlewares/validation.middleware';
import { updateProfileSchema, publicProfileParamsSchema } from '@/api/validations/profile.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: API de gestion des profils utilisateurs
 */

/**
 * @swagger
 * /profiles/me:
 *   get:
 *     summary: Récupère le profil de l'utilisateur actuellement connecté
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Le profil de l'utilisateur
 *       401:
 *         description: Non autorisé
 */
router.get('/me', authenticateToken, profileController.getMyProfile);

/**
 * @swagger
 * /profiles/me:
 *   put:
 *     summary: Met à jour le profil de l'utilisateur actuellement connecté
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       401:
 *         description: Non autorisé
 */
router.put('/me', authenticateToken, validate(updateProfileSchema), profileController.updateMyProfile);

/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     summary: Récupère le profil public d'un utilisateur par son ID
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Informations publiques de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', validate(publicProfileParamsSchema), profileController.getPublicProfileById);

export default router;