"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmReceipt = exports.verifyNIN = exports.processPaymentFulfilled = exports.processPaymentCreated = void 0;
const client_1 = require("@prisma/client");
const sms_1 = require("../utils/sms");
const logger_1 = require("../utils/logger");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
const processPaymentCreated = async (event) => {
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
        await (0, sms_1.sendSMS)(event.recipientDetails.phoneNumber, `You have a pending payment of NGN ${event.amount} from ${event.sender.slice(0, 8)}...`);
        logger_1.logger.info(`Payment request created: ${transaction.requestId}`);
        return transaction;
    }
    catch (error) {
        logger_1.logger.error('Error processing payment creation:', error);
        throw new errorHandler_1.AppError(500, 'Failed to process payment creation');
    }
};
exports.processPaymentCreated = processPaymentCreated;
const processPaymentFulfilled = async (event) => {
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
            await (0, sms_1.sendSMS)(recipient.receiverPhone, `Your payment of NGN ${event.amount} has been fulfilled! Market Maker: ${event.marketMaker.slice(0, 8)}...`);
        }
        logger_1.logger.info(`Payment fulfilled: ${transaction.requestId}`);
        return transaction;
    }
    catch (error) {
        logger_1.logger.error('Error processing payment fulfillment:', error);
        throw new errorHandler_1.AppError(500, 'Failed to process payment fulfillment');
    }
};
exports.processPaymentFulfilled = processPaymentFulfilled;
const verifyNIN = async (requestId, nin) => {
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
    }
    catch (error) {
        logger_1.logger.error('Error verifying NIN:', error);
        throw new errorHandler_1.AppError(500, 'Failed to verify NIN');
    }
};
exports.verifyNIN = verifyNIN;
const confirmReceipt = async (requestId, ussdCode) => {
    try {
        const transaction = await prisma.transaction.update({
            where: { requestId },
            data: {
                receiptConfirmed: true,
                ussdCode
            }
        });
        return transaction;
    }
    catch (error) {
        logger_1.logger.error('Error confirming receipt:', error);
        throw new errorHandler_1.AppError(500, 'Failed to confirm receipt');
    }
};
exports.confirmReceipt = confirmReceipt;
