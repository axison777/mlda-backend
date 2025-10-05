import { Router } from 'express';
import * as campaignController from '../controllers/campaign.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  createCampaignSchema,
  updateCampaignSchema,
  campaignIdParamSchema
} from '../validations/campaign.validation';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: API de gestion des campagnes publicitaires (Admin)
 */

// Appliquer l'authentification et l'autorisation d'administrateur à toutes les routes de ce fichier
router.use(authenticateToken);
router.use(authorizeRoles([UserRole.ADMIN]));

/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Récupère la liste de toutes les campagnes (Admin)
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Une liste de campagnes
 */
router.get('/', campaignController.getAll);

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Crée une nouvelle campagne (Admin)
 *     tags: [Campaigns]
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
 *               startDate: { type: string, format: 'date-time' }
 *               endDate: { type: string, format: 'date-time' }
 *               budget: { type: number }
 *     responses:
 *       201:
 *         description: Campagne créée
 */
router.post('/', validate(createCampaignSchema), campaignController.create);

/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Récupère une campagne par son ID (Admin)
 *     tags: [Campaigns]
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
 *         description: Détails de la campagne
 *       404:
 *         description: Campagne non trouvée
 */
router.get('/:id', validate(campaignIdParamSchema), campaignController.getById);

/**
 * @swagger
 * /campaigns/{id}:
 *   put:
 *     summary: Met à jour une campagne (Admin)
 *     tags: [Campaigns]
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
 *               startDate: { type: string, format: 'date-time' }
 *               endDate: { type: string, format: 'date-time' }
 *               budget: { type: number }
 *               status: { type: string, enum: ['ACTIVE', 'PAUSED', 'ENDED'] }
 *     responses:
 *       200:
 *         description: Campagne mise à jour
 *       404:
 *         description: Campagne non trouvée
 */
router.put('/:id', validate(updateCampaignSchema), campaignController.update);

/**
 * @swagger
 * /campaigns/{id}:
 *   delete:
 *     summary: Supprime une campagne (Admin)
 *     tags: [Campaigns]
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
 *         description: Campagne supprimée
 *       404:
 *         description: Campagne non trouvée
 */
router.delete('/:id', validate(campaignIdParamSchema), campaignController.remove);

export default router;