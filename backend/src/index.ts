import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import transactionRoutes from './routes/transactions';
import notificationRoutes from './routes/notifications';
import webhookRoutes from './routes/webhook';

// Load environment variables
config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/webhook', webhookRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 