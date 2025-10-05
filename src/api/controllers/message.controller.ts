import { Request, Response } from 'express';
import * as messageService from '../services/message.service';
import { UserRole } from '@prisma/client';

// Étend l'interface Request pour inclure notre propriété 'user'
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

// --- Contrôleur pour envoyer un message ---
export const postMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const senderId = req.user?.id;
    const { recipientId, content } = req.body;

    if (!senderId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const message = await messageService.sendMessage(senderId, recipientId, content);
    res.status(201).json(message);
  } catch (error: any) {
    if (error.message.includes('Recipient not found')) {
        return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// --- Contrôleur pour récupérer les conversations ---
export const fetchConversations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const conversations = await messageService.getConversations(userId);
    res.status(200).json(conversations);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
};

// --- Contrôleur pour récupérer l'historique d'une conversation ---
export const fetchConversationHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { otherUserId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const messages = await messageService.getConversationHistory(userId, otherUserId);
    // Après avoir récupéré l'historique, marquer les messages comme lus
    await messageService.markMessagesAsRead(userId, otherUserId);
    res.status(200).json(messages);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching conversation history', error: error.message });
  }
};

// --- Contrôleur pour marquer les messages comme lus ---
// Note: Cette logique est maintenant intégrée dans fetchConversationHistory pour plus d'efficacité,
// mais on pourrait la garder en tant que point d'API séparé si nécessaire.
export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { otherUserId } = req.params;
        if (!userId) {
          return res.status(401).json({ message: 'User not authenticated' });
        }
        await messageService.markMessagesAsRead(userId, otherUserId);
        res.status(200).json({ message: 'Messages marked as read' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error marking messages as read', error: error.message });
    }
};