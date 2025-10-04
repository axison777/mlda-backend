import { Request, Response } from 'express';
import * as campaignService from '@/api/services/campaign.service';

// --- Contrôleur pour créer une campagne ---
export const create = async (req: Request, res: Response) => {
  try {
    const campaign = await campaignService.createCampaign(req.body);
    res.status(201).json(campaign);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating campaign', error: error.message });
  }
};

// --- Contrôleur pour récupérer toutes les campagnes ---
export const getAll = async (req: Request, res: Response) => {
  try {
    const campaigns = await campaignService.findAllCampaigns();
    res.status(200).json(campaigns);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching campaigns', error: error.message });
  }
};

// --- Contrôleur pour récupérer une campagne par ID ---
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const campaign = await campaignService.findCampaignById(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.status(200).json(campaign);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching campaign', error: error.message });
  }
};

// --- Contrôleur pour mettre à jour une campagne ---
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCampaign = await campaignService.updateCampaignById(id, req.body);
    res.status(200).json(updatedCampaign);
  } catch (error: any) {
    if (error.code === 'P2025') {
       return res.status(404).json({ message: 'Campaign not found' });
    }
    res.status(500).json({ message: 'Error updating campaign', error: error.message });
  }
};

// --- Contrôleur pour supprimer une campagne ---
export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await campaignService.deleteCampaignById(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
       return res.status(404).json({ message: 'Campaign not found' });
    }
    res.status(500).json({ message: 'Error deleting campaign', error: error.message });
  }
};