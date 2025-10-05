import { Router } from 'express';
import * as messageController from '../controllers/message.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { sendMessageSchema, conversationParamsSchema } from '../validations/message.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Messaging
 *   description: API de messagerie privée entre utilisateurs
 */

// Appliquer l'authentification à toutes les routes de ce fichier
router.use(authenticateToken);

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Envoie un message à un autre utilisateur
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId: { type: string }
 *               content: { type: string }
 *     responses:
 *       201:
 *         description: Message envoyé avec succès
 *       404:
 *         description: Destinataire non trouvé
 */
router.post('/', validate(sendMessageSchema), messageController.postMessage);

/**
 * @swagger
 * /messages/conversations:
 *   get:
 *     summary: Récupère la liste des conversations de l'utilisateur
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Une liste de conversations
 */
router.get('/conversations', messageController.fetchConversations);

/**
 * @swagger
 * /messages/{otherUserId}:
 *   get:
 *     summary: Récupère l'historique des messages avec un autre utilisateur
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: otherUserId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historique de la conversation
 */
router.get('/:otherUserId', validate(conversationParamsSchema), messageController.fetchConversationHistory);

/**
 * @swagger
 * /messages/{otherUserId}/read:
 *   post:
 *     summary: Marque les messages d'une conversation comme lus
 *     tags: [Messaging]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: otherUserId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages marqués comme lus
 */
router.post('/:otherUserId/read', validate(conversationParamsSchema), messageController.markAsRead);


export default router;