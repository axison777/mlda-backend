import prisma from '../../lib/prisma';
import { Prisma, Campaign } from '@prisma/client';

// --- Service pour créer une campagne ---
export const createCampaign = async (data: Prisma.CampaignCreateInput): Promise<Campaign> => {
  const campaign = await prisma.campaign.create({ data });
  return campaign;
};

// --- Service pour récupérer toutes les campagnes ---
export const findAllCampaigns = async () => {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { startDate: 'desc' },
  });
  return campaigns;
};

// --- Service pour récupérer une campagne par son ID ---
export const findCampaignById = async (id: string): Promise<Campaign | null> => {
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  return campaign;
};

// --- Service pour mettre à jour une campagne ---
export const updateCampaignById = async (
  id: string,
  updates: Prisma.CampaignUpdateInput
): Promise<Campaign> => {
  const campaign = await prisma.campaign.update({
    where: { id },
    data: updates,
  });
  return campaign;
};

// --- Service pour supprimer une campagne ---
export const deleteCampaignById = async (id: string): Promise<Campaign> => {
  const campaign = await prisma.campaign.delete({ where: { id } });
  return campaign;
};