import { Router } from 'express';
import * as achievementController from '@/api/controllers/achievement.controller';
import { authenticateToken, authorizeRoles } from '@/api/middlewares/auth.middleware';
import { validate } from '@/api/middlewares/validation.middleware';
import {
  createAchievementSchema,
  updateAchievementSchema,
  achievementIdParamSchema
} from '@/api/validations/achievement.validation';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Achievements
 *   description: API de gestion des succès et de la gamification
 */

// Appliquer l'authentification à toutes les routes
router.use(authenticateToken);

/**
 * @swagger
 * /achievements:
 *   get:
 *     summary: Récupère la liste de tous les succès disponibles
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Une liste de succès
 */
router.get('/', achievementController.getAll);

/**
 * @swagger
 * /achievements/my-achievements:
 *   get:
 *     summary: Récupère les succès débloqués par l'utilisateur connecté
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: La liste des succès de l'utilisateur
 */
router.get('/my-achievements', achievementController.getMyAchievements);


// --- Routes de gestion (Admin seulement) ---
const adminOnly = Router();
adminOnly.use(authorizeRoles([UserRole.ADMIN]));

/**
 * @swagger
 * /achievements:
 *   post:
 *     summary: Crée un nouveau succès (Admin)
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               iconUrl: { type: string }
 *               code: { type: string }
 *     responses:
 *       201:
 *         description: Succès créé
 */
adminOnly.post('/', validate(createAchievementSchema), achievementController.create);

/**
 * @swagger
 * /achievements/{id}:
 *   get:
 *     summary: Récupère un succès par son ID (Admin)
 *     tags: [Achievements]
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
 *         description: Détails du succès
 *       404:
 *         description: Succès non trouvé
 */
adminOnly.get('/:id', validate(achievementIdParamSchema), achievementController.getById);

/**
 * @swagger
 * /achievements/{id}:
 *   put:
 *     summary: Met à jour un succès (Admin)
 *     tags: [Achievements]
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
 *               name: { type: string }
 *               description: { type: string }
 *               iconUrl: { type: string }
 *               code: { type: string }
 *     responses:
 *       200:
 *         description: Succès mis à jour
 *       404:
 *         description: Succès non trouvé
 */
adminOnly.put('/:id', validate(updateAchievementSchema), achievementController.update);

/**
 * @swagger
 * /achievements/{id}:
 *   delete:
 *     summary: Supprime un succès (Admin)
 *     tags: [Achievements]
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
 *         description: Succès supprimé
 *       404:
 *         description: Succès non trouvé
 */
adminOnly.delete('/:id', validate(achievementIdParamSchema), achievementController.remove);

router.use(adminOnly);

export default router;