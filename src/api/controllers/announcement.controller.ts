import { Request, Response } from 'express';
import * as announcementService from '../services/announcement.service';
import { UserRole } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

// --- Contrôleur pour créer une annonce ---
export const create = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const authorId = req.user?.id;
    if (!authorId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const announcement = await announcementService.createAnnouncement(req.body, authorId);
    res.status(201).json(announcement);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating announcement', error: error.message });
  }
};

// --- Contrôleur pour récupérer toutes les annonces ---
export const getAll = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.query;
    const announcements = await announcementService.findAllAnnouncements({ courseId: courseId as string | undefined });
    res.status(200).json(announcements);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
};

// --- Contrôleur pour récupérer une annonce par ID ---
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const announcement = await announcementService.findAnnouncementById(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(200).json(announcement);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching announcement', error: error.message });
  }
};

// --- Contrôleur pour mettre à jour une annonce ---
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedAnnouncement = await announcementService.updateAnnouncementById(id, req.body);
    res.status(200).json(updatedAnnouncement);
  } catch (error: any) {
    if (error.code === 'P2025') {
       return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(500).json({ message: 'Error updating announcement', error: error.message });
  }
};

// --- Contrôleur pour supprimer une annonce ---
export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await announcementService.deleteAnnouncementById(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
       return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(500).json({ message: 'Error deleting announcement', error: error.message });
  }
};