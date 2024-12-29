"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
const validateRequest_1 = require("../middleware/validateRequest");
const sms_1 = require("../utils/sms");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Send test notification
router.post('/test', [
    (0, express_validator_1.body)('phoneNumber').isMobilePhone('any'),
    (0, express_validator_1.body)('message').isString().notEmpty(),
], validateRequest_1.validateRequest, async (req, res, next) => {
    try {
        const { phoneNumber, message } = req.body;
        await (0, sms_1.sendSMS)(phoneNumber, message);
        res.json({ success: true, message: 'Test notification sent' });
    }
    catch (error) {
        next(error);
    }
});
// Resend transaction notification
router.post('/resend/:requestId', [
    (0, express_validator_1.body)('requestId').isString(),
], validateRequest_1.validateRequest, async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const transaction = await prisma.transaction.findUnique({
            where: { requestId }
        });
        if (!transaction) {
            throw new errorHandler_1.AppError(404, 'Transaction not found');
        }
        const message = transaction.status === 'COMPLETED'
            ? `Your payment of NGN ${transaction.amountNgn} has been fulfilled!`
            : `You have a pending payment of NGN ${transaction.amountNgn}`;
        await (0, sms_1.sendSMS)(transaction.receiverPhone, message);
        res.json({ success: true, message: 'Notification resent' });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
