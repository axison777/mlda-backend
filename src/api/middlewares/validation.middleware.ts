import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    // Gérer d'autres types d'erreurs si nécessaire
    return res.status(500).json({ message: 'Internal server error' });
  }
};