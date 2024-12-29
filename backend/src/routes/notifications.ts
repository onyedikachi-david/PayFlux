import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { validateRequest } from '../middleware/validateRequest';
import { sendSMS } from '../utils/sms';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Send test notification
router.post(
  '/test',
  [
    body('phoneNumber').isMobilePhone('any'),
    body('message').isString().notEmpty(),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phoneNumber, message } = req.body;
      await sendSMS(phoneNumber, message);
      res.json({ success: true, message: 'Test notification sent' });
    } catch (error) {
      next(error);
    }
  }
);

// Resend transaction notification
router.post(
  '/resend/:requestId',
  [
    body('requestId').isString(),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requestId } = req.params;
      
      const transaction = await prisma.transaction.findUnique({
        where: { requestId }
      });

      if (!transaction) {
        throw new AppError(404, 'Transaction not found');
      }

      const message = transaction.status === 'COMPLETED'
        ? `Your payment of NGN ${transaction.amountNgn} has been fulfilled!`
        : `You have a pending payment of NGN ${transaction.amountNgn}`;

      await sendSMS(transaction.receiverPhone, message);
      res.json({ success: true, message: 'Notification resent' });
    } catch (error) {
      next(error);
    }
  }
);

export default router; 