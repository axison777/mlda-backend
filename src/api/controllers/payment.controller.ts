import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';
import { UserRole } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

// --- Contrôleur pour créer une intention de paiement ---
export const createPaymentIntent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { cart } = req.body; // cart: [{ id, type, quantity }]

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const payment = await paymentService.createPayment(userId, cart);
    res.status(201).json(payment);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating payment intent', error: error.message });
  }
};

// --- Contrôleur pour récupérer l'historique des paiements de l'utilisateur ---
export const getMyPayments = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const payments = await paymentService.findUserPayments(userId);
        res.status(200).json(payments);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching payment history', error: error.message });
    }
};