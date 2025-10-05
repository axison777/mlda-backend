import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema
} from '../validations/product.validation';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API de gestion des produits de la boutique
 */

// --- Routes Publiques ---

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Récupère la liste des produits disponibles
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Une liste de produits
 */
router.get('/', productController.getAll);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Récupère un produit par son ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du produit
 *       404:
 *         description: Produit non trouvé
 */
router.get('/:id', validate(productIdParamSchema), productController.getById);


// --- Routes de gestion (Admin seulement) ---

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crée un nouveau produit (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Produit créé
 */
router.post(
  '/',
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  validate(createProductSchema),
  productController.create
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Met à jour un produit (Admin)
 *     tags: [Products]
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
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produit mis à jour
 *       404:
 *         description: Produit non trouvé
 */
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  validate(updateProductSchema),
  productController.update
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Supprime un produit (Admin)
 *     tags: [Products]
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
 *         description: Produit supprimé
 *       404:
 *         description: Produit non trouvé
 */
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles([UserRole.ADMIN]),
  validate(productIdParamSchema),
  productController.remove
);

export default router;