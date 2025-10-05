import prisma from '../../lib/prisma';
import { Prisma, Payment } from '@prisma/client';

// Type pour les articles du panier envoyés par le frontend
interface CartItem {
  id: string;
  type: 'COURSE' | 'PRODUCT';
  quantity: number;
}

// --- Service pour créer une intention de paiement ---
export const createPayment = async (userId: string, cart: CartItem[]): Promise<Payment> => {
  return prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const paymentItemsData: Prisma.PaymentItemCreateManyPaymentInput[] = [];

    // 1. Parcourir le panier pour valider les articles et calculer le total
    for (const item of cart) {
      if (item.type === 'COURSE') {
        const course = await tx.course.findUnique({ where: { id: item.id } });
        if (!course) throw new Error(`Course with ID ${item.id} not found.`);
        totalAmount += course.price * item.quantity;
        paymentItemsData.push({
          courseId: course.id,
          quantity: item.quantity,
          price: course.price,
        });
      } else if (item.type === 'PRODUCT') {
        const product = await tx.product.findUnique({ where: { id: item.id } });
        if (!product) throw new Error(`Product with ID ${item.id} not found.`);
        if (!product.active) throw new Error(`Product "${product.name}" is not available for purchase.`);
        totalAmount += product.price * item.quantity;
        paymentItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }
    }

    if (paymentItemsData.length === 0) {
      throw new Error('Cart cannot be empty.');
    }

    // 2. Créer l'enregistrement de paiement
    const payment = await tx.payment.create({
      data: {
        amount: totalAmount,
        status: 'PENDING', // Le statut initial est en attente
        provider: 'system', // Fournisseur de paiement par défaut
        user: { connect: { id: userId } },
        items: {
          createMany: {
            data: paymentItemsData,
          },
        },
      },
      include: {
        items: true, // Inclure les articles dans la réponse
      },
    });

    return payment;
  });
};

// --- Service pour récupérer les paiements d'un utilisateur ---
export const findUserPayments = async (userId: string): Promise<Payment[]> => {
    return prisma.payment.findMany({
        where: { userId },
        include: {
            items: {
                include: {
                    product: true,
                    course: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};