import { Router } from 'express';
import * as userController from '@/api/controllers/user.controller';
import { authenticateToken, authorizeRoles } from '@/api/middlewares/auth.middleware';
import { validate } from '@/api/middlewares/validation.middleware';
import { updateUserSchema, userIdParamSchema } from '@/api/validations/user.validation';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API de gestion des utilisateurs (Admin)
 */

// Appliquer l'authentification et l'autorisation d'administrateur à toutes les routes de ce fichier
router.use(authenticateToken);
router.use(authorizeRoles([UserRole.ADMIN]));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupère la liste de tous les utilisateurs (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Une liste d'utilisateurs
 */
router.get('/', userController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par son ID (Admin)
 *     tags: [Users]
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
 *         description: Détails de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', validate(userIdParamSchema), userController.getById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Met à jour un utilisateur (Admin)
 *     tags: [Users]
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
 *               email: { type: string, format: email }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               role: { type: string, enum: ['STUDENT', 'TEACHER', 'ADMIN'] }
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/:id', validate(updateUserSchema), userController.update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur (Admin)
 *     tags: [Users]
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
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/:id', validate(userIdParamSchema), userController.remove);

export default router;