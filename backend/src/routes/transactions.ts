import { Router, Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { validateRequest } from '../middleware/validateRequest';
import { verifyNIN, confirmReceipt } from '../services/transactionService';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get all transactions
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

// Get transaction by requestId
router.get(
  '/:requestId',
  param('requestId').isString(),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { requestId: req.params.requestId }
      });

      if (!transaction) {
        throw new AppError(404, 'Transaction not found');
      }

      res.json(transaction);
    } catch (error) {
      next(error);
    }
  }
);

// Verify NIN
router.post(
  '/:requestId/verify-nin',
  [
    param('requestId').isString(),
    body('nin').isString().isLength({ min: 11, max: 11 }),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requestId } = req.params;
      const { nin } = req.body;

      const isVerified = await verifyNIN(requestId, nin);
      res.json({ success: isVerified });
    } catch (error) {
      next(error);
    }
  }
);

// Confirm receipt
router.post(
  '/:requestId/confirm-receipt',
  [
    param('requestId').isString(),
    body('ussdCode').isString().notEmpty(),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requestId } = req.params;
      const { ussdCode } = req.body;

      const transaction = await confirmReceipt(requestId, ussdCode);
      res.json(transaction);
    } catch (error) {
      next(error);
    }
  }
);

export default router; 