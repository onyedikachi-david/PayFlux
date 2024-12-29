import { PrismaClient } from '@prisma/client';
import { sendSMS } from '../utils/sms';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

interface PaymentCreatedEvent {
  name: 'PaymentCreated';
  requestId: string;
  sender: string;
  amount: number;
  recipientDetails: {
    accountNumber: string;
    accountName: string;
    phoneNumber: string;
  };
}

interface PaymentFulfilledEvent {
  name: 'PaymentFulfilled';
  requestId: string;
  marketMaker: string;
  amount: number;
}

export const processPaymentCreated = async (event: PaymentCreatedEvent) => {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        requestId: event.requestId,
        senderWallet: event.sender,
        receiverAccount: event.recipientDetails.accountNumber,
        receiverName: event.recipientDetails.accountName,
        receiverPhone: event.recipientDetails.phoneNumber,
        amountNgn: event.amount,
        status: 'PENDING'
      }
    });

    // Send SMS notification to recipient
    await sendSMS(
      event.recipientDetails.phoneNumber,
      `You have a pending payment of NGN ${event.amount} from ${event.sender.slice(0, 8)}...`
    );

    logger.info(`Payment request created: ${transaction.requestId}`);
    return transaction;
  } catch (error) {
    logger.error('Error processing payment creation:', error);
    throw new AppError(500, 'Failed to process payment creation');
  }
};

export const processPaymentFulfilled = async (event: PaymentFulfilledEvent) => {
  try {
    const transaction = await prisma.transaction.update({
      where: { requestId: event.requestId },
      data: {
        status: 'COMPLETED',
        marketMakerWallet: event.marketMaker
      }
    });

    // Get recipient's phone number
    const recipient = await prisma.transaction.findUnique({
      where: { requestId: event.requestId }
    });

    if (recipient) {
      // Send confirmation SMS
      await sendSMS(
        recipient.receiverPhone,
        `Your payment of NGN ${event.amount} has been fulfilled! Market Maker: ${event.marketMaker.slice(0, 8)}...`
      );
    }

    logger.info(`Payment fulfilled: ${transaction.requestId}`);
    return transaction;
  } catch (error) {
    logger.error('Error processing payment fulfillment:', error);
    throw new AppError(500, 'Failed to process payment fulfillment');
  }
};

export const verifyNIN = async (requestId: string, nin: string) => {
  try {
    // TODO: Implement NIN verification with external service
    const isValid = true; // Placeholder for actual verification

    if (isValid) {
      await prisma.transaction.update({
        where: { requestId },
        data: { ninVerified: true }
      });
      return true;
    }
    return false;
  } catch (error) {
    logger.error('Error verifying NIN:', error);
    throw new AppError(500, 'Failed to verify NIN');
  }
};

export const confirmReceipt = async (requestId: string, ussdCode: string) => {
  try {
    const transaction = await prisma.transaction.update({
      where: { requestId },
      data: {
        receiptConfirmed: true,
        ussdCode
      }
    });
    return transaction;
  } catch (error) {
    logger.error('Error confirming receipt:', error);
    throw new AppError(500, 'Failed to confirm receipt');
  }
}; 