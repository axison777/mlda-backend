import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createPaymentSchema } from '../validations/payment.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: API de gestion des paiements
 */

// Toutes les routes ici nécessitent une authentification
router.use(authenticateToken);

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Crée une nouvelle intention de paiement
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     type: { type: string, enum: ['COURSE', 'PRODUCT'] }
 *                     quantity: { type: integer }
 *     responses:
 *       201:
 *         description: Intention de paiement créée avec succès
 */
router.post('/', validate(createPaymentSchema), paymentController.createPaymentIntent);

/**
 * @swagger
 * /payments/my-history:
 *   get:
 *     summary: Récupère l'historique des paiements de l'utilisateur connecté
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Une liste de paiements
 */
router.get('/my-history', paymentController.getMyPayments);

export default router;