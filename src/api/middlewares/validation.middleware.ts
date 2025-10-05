import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError, ZodIssue } from 'zod';

export const validate = (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
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
        errors: error.issues.map((e: ZodIssue) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    // Gérer d'autres types d'erreurs si nécessaire
    return res.status(500).json({ message: 'Internal server error' });
  }
};