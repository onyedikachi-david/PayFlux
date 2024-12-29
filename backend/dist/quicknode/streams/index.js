"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupQuicknodeWebSocket = void 0;
const ws_1 = require("ws");
const transactionService_1 = require("../../services/transactionService");
const logger_1 = require("../../utils/logger");
const setupQuicknodeWebSocket = () => {
    const wsConnection = new ws_1.WebSocket(process.env.QUICKNODE_WSS_URL, {
        headers: {
            'Authorization': process.env.QUICKNODE_API_KEY
        }
    });
    wsConnection.on('open', () => {
        logger_1.logger.info('Connected to Quicknode WebSocket');
        // Subscribe to program account changes
        const subscribeMessage = {
            jsonrpc: '2.0',
            id: 1,
            method: 'accountSubscribe',
            params: [
                process.env.PROGRAM_ID,
                {
                    encoding: 'jsonParsed',
                    commitment: 'confirmed'
                }
            ]
        };
        wsConnection.send(JSON.stringify(subscribeMessage));
    });
    wsConnection.on('message', async (data) => {
        try {
            const event = JSON.parse(data.toString());
            if (event.name === 'PaymentCreated') {
                await (0, transactionService_1.processPaymentCreated)(event);
            }
            if (event.name === 'PaymentFulfilled') {
                await (0, transactionService_1.processPaymentFulfilled)(event);
            }
        }
        catch (error) {
            logger_1.logger.error('Error processing WebSocket message:', error);
        }
    });
    wsConnection.on('error', (error) => {
        logger_1.logger.error('WebSocket error:', error);
    });
    wsConnection.on('close', () => {
        logger_1.logger.warn('WebSocket connection closed. Attempting to reconnect...');
        setTimeout(exports.setupQuicknodeWebSocket, 5000);
    });
    // Ping to keep connection alive
    setInterval(() => {
        if (wsConnection.readyState === ws_1.WebSocket.OPEN) {
            wsConnection.ping();
        }
    }, 30000);
};
exports.setupQuicknodeWebSocket = setupQuicknodeWebSocket;
