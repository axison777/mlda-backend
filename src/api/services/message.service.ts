import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// --- Service pour envoyer un message ---
export const sendMessage = async (senderId: string, recipientId: string, content: string) => {
  // Vérifier si le destinataire existe
  const recipient = await prisma.user.findUnique({ where: { id: recipientId } });
  if (!recipient) {
    throw new Error('Recipient not found.');
  }

  const message = await prisma.message.create({
    data: {
      content,
      sender: { connect: { id: senderId } },
      recipient: { connect: { id: recipientId } },
    },
  });
  return message;
};

// --- Service pour récupérer les conversations d'un utilisateur ---
export const getConversations = async (userId: string) => {
  // Récupérer tous les messages où l'utilisateur est soit l'expéditeur, soit le destinataire
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { recipientId: userId }],
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      sender: { select: { id: true, firstName: true, lastName: true, profile: { select: { avatarUrl: true } } } },
      recipient: { select: { id: true, firstName: true, lastName: true, profile: { select: { avatarUrl: true } } } },
    },
  });

  // Grouper les messages par conversation pour n'afficher que le plus récent
  const conversations = new Map();
  messages.forEach((message) => {
    const otherUser = message.senderId === userId ? message.recipient : message.sender;
    if (!conversations.has(otherUser.id)) {
      conversations.set(otherUser.id, {
        otherUser,
        lastMessage: message,
      });
    }
  });

  return Array.from(conversations.values());
};

// --- Service pour récupérer l'historique d'une conversation ---
export const getConversationHistory = async (userId: string, otherUserId: string) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: userId },
      ],
    },
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      sender: { select: { id: true, firstName: true, lastName: true } },
    },
  });
  return messages;
};

// --- Service pour marquer les messages d'une conversation comme lus ---
export const markMessagesAsRead = async (userId: string, otherUserId: string) => {
  const result = await prisma.message.updateMany({
    where: {
      senderId: otherUserId,
      recipientId: userId,
      read: false,
    },
    data: {
      read: true,
    },
  });
  return result;
};