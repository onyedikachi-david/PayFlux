"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = require("dotenv");
const streams_1 = require("./quicknode/streams");
const errorHandler_1 = require("./middleware/errorHandler");
const transactions_1 = __importDefault(require("./routes/transactions"));
const notifications_1 = __importDefault(require("./routes/notifications"));
// Load environment variables
(0, dotenv_1.config)();
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// Routes
app.use('/api/transactions', transactions_1.default);
app.use('/api/notifications', notifications_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
// Initialize Quicknode WebSocket connection
(0, streams_1.setupQuicknodeWebSocket)();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
