"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
const validateRequest_1 = require("../middleware/validateRequest");
const transactionService_1 = require("../services/transactionService");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get all transactions
router.get('/', async (req, res, next) => {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(transactions);
    }
    catch (error) {
        next(error);
    }
});
// Get transaction by requestId
router.get('/:requestId', (0, express_validator_1.param)('requestId').isString(), validateRequest_1.validateRequest, async (req, res, next) => {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: { requestId: req.params.requestId }
        });
        if (!transaction) {
            throw new errorHandler_1.AppError(404, 'Transaction not found');
        }
        res.json(transaction);
    }
    catch (error) {
        next(error);
    }
});
// Verify NIN
router.post('/:requestId/verify-nin', [
    (0, express_validator_1.param)('requestId').isString(),
    (0, express_validator_1.body)('nin').isString().isLength({ min: 11, max: 11 }),
], validateRequest_1.validateRequest, async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const { nin } = req.body;
        const isVerified = await (0, transactionService_1.verifyNIN)(requestId, nin);
        res.json({ success: isVerified });
    }
    catch (error) {
        next(error);
    }
});
// Confirm receipt
router.post('/:requestId/confirm-receipt', [
    (0, express_validator_1.param)('requestId').isString(),
    (0, express_validator_1.body)('ussdCode').isString().notEmpty(),
], validateRequest_1.validateRequest, async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const { ussdCode } = req.body;
        const transaction = await (0, transactionService_1.confirmReceipt)(requestId, ussdCode);
        res.json(transaction);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
