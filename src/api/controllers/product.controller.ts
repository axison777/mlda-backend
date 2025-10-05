import { Request, Response } from 'express';
import * as productService from '../services/product.service';

// --- Contrôleur pour créer un produit ---
export const create = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// --- Contrôleur pour récupérer tous les produits ---
export const getAll = async (req: Request, res: Response) => {
  try {
    const { page, limit, active, ...filters } = req.query;
    const pageNum = page ? parseInt(page as string, 10) : undefined;
    const limitNum = limit ? parseInt(limit as string, 10) : undefined;
    const activeBool = active !== undefined ? (active as string).toLowerCase() === 'true' : undefined;

    const result = await productService.findAllProducts({
      page: pageNum,
      limit: limitNum,
      active: activeBool,
      ...filters
    });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// --- Contrôleur pour récupérer un produit par ID ---
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.findProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// --- Contrôleur pour mettre à jour un produit ---
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productService.updateProductById(id, req.body);
    res.status(200).json(updatedProduct);
  } catch (error: any) {
    if (error.code === 'P2025') {
       return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// --- Contrôleur pour supprimer un produit ---
export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await productService.deleteProductById(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
       return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};