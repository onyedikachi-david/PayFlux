import { Router } from 'express';
import { processPaymentCreated, processPaymentFulfilled } from '../services/transactionService';
import { logger } from '../utils/logger';

const router = Router();

router.post('/', async (req, res) => {
    try {
        if (req.body?.matchedTransactions && Array.isArray(req.body.matchedTransactions)) {
            for (const transaction of req.body.matchedTransactions) {
                const { accounts, blockTime, signature } = transaction;
                const date = new Date(blockTime * 1000).toLocaleString();
                
                logger.info('\n' + '='.repeat(110) + '\n');
                logger.info(`   💰 New Transaction: ${signature}`);
                logger.info(`      Block Time: ${date}`);
                logger.info(`      Accounts: ${JSON.stringify(accounts, null, 2)}`);

                // Process the transaction based on the instruction type
                if (transaction.instruction === 'create_payment') {
                    await processPaymentCreated(transaction);
                } else if (transaction.instruction === 'fulfill_payment') {
                    await processPaymentFulfilled(transaction);
                }
            }
        }

        res.status(200).send('Webhook received');
    } catch (error) {
        logger.error('Error processing webhook:', error);
        res.status(500).send('Error processing webhook');
    }
});

export default router; 