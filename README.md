# PayFlux - Crypto-to-Fiat Bridge

> 🏆 Built for the Quicknode Hackathon 2024 - Bridging Web3 and Traditional Finance

## Hackathon Context

PayFlux demonstrates the power of Quicknode's infrastructure in solving real-world financial inclusion challenges. Our solution bridges the gap between cryptocurrency and traditional banking in Nigeria, showcasing both Quicknode Streams and Functions capabilities.

### Quicknode Integration Highlights

#### 1. Quicknode Streams Implementation
- **Real-time Transaction Monitoring**: Utilizing WebSocket endpoints for instant payment status updates
- **Event-Driven Architecture**: Subscribing to specific blockchain events for payment tracking
- **Low-Latency Updates**: Ensuring market makers receive immediate notifications of new payment requests
- **Scalable WebSocket Management**: Handling multiple concurrent payment streams efficiently

```typescript
// Quicknode Streams Integration Example
const streamConfig = {
  type: 'account',
  account: PROGRAM_ID,
  filters: [
    { dataSize: 128 },  // Filter for PaymentRequest accounts
    { memcmp: { offset: 0, bytes: PAYMENT_DISCRIMINATOR } }
  ]
};

quicknode.on('accountUpdate', streamConfig, (update) => {
  // Real-time payment status updates
  processPaymentUpdate(update);
});
```

#### 2. Quicknode Functions Integration
- **Automated Payment Processing**: Serverless functions for payment validation and processing
- **SMS Notification System**: Trigger notifications based on blockchain events
- **NIN Verification**: Serverless identity verification for recipients
- **Market Maker Matching**: Automated matching of payment requests with available market makers

```typescript
// Quicknode Functions Example
export async function processPayment(event) {
  // Validate payment on-chain
  const paymentStatus = await validatePayment(event.paymentId);
  
  if (paymentStatus.isValid) {
    // Trigger SMS notification
    await sendSMS(event.recipientPhone);
    
    // Update market maker pool
    await updateMarketMakerPool(event.amount);
    
    // Log analytics
    await logTransaction(event);
  }
}
```

### Technical Innovation

1. **Hybrid Infrastructure**
   - Combines Quicknode's blockchain infrastructure with traditional banking APIs
   - Utilizes Quicknode Streams for real-time payment tracking
   - Leverages Quicknode Functions for automated payment processing

2. **Performance Optimization**
   - Sub-second payment status updates via WebSocket
   - Efficient market maker matching through serverless functions
   - Optimized database queries for transaction history

3. **Scalability Features**
   - Horizontal scaling of WebSocket connections
   - Distributed payment processing
   - Load-balanced API endpoints

A minimal viable crypto-to-fiat bridge enabling direct transfers from crypto wallets to Nigerian bank accounts. The system leverages Quicknode's WebSocket infrastructure for real-time transaction monitoring and event handling, making it possible to bridge the gap between crypto and traditional banking seamlessly.

## Why Quicknode?

PayFlux utilizes Quicknode's powerful infrastructure to:
- Monitor blockchain events in real-time
- Handle transaction confirmations reliably
- Process payment events with minimal latency
- Scale WebSocket connections efficiently
- Maintain high availability for payment processing

## Features

- Direct crypto-to-fiat transfers powered by Quicknode's RPC infrastructure
- Real-time market maker notifications via Quicknode WebSocket
- Instant SMS notifications triggered by blockchain events
- NIN verification for receivers
- Real-time transaction status tracking through Quicknode's event monitoring

## Core Flows

### Sender Flow
1. Connect wallet (via Quicknode RPC)
2. Enter recipient bank details:
   - Account number
   - Account holder name
   - Phone number
3. Enter NGN amount
4. Submit transaction (funds locked in PDA)

### Market Maker Flow
1. View pending requests list (real-time updates via Quicknode WebSocket)
2. Select request to fulfill
3. Connect wallet
4. Execute fulfillment transaction
5. Make bank transfer

### Receiver Flow
1. Get SMS notification (triggered by Quicknode event)
2. Verify with NIN
3. Receive bank transfer
4. Get confirmation SMS with USSD code
5. Confirm receipt

## Prerequisites

- Node v18.18.0 or higher
- Rust v1.77.2 or higher
- Anchor CLI 0.30.1 or higher
- Solana CLI 1.18.17 or higher
- SQLite3

## Project Structure

```
PayFlux/
├── anchor/                     # Solana program (smart contract)
│   ├── programs/              # Program source code
│   │   └── PayFlux/
│   │       └── src/
│   │           └── lib.rs     # Smart contract implementation
│   ├── tests/                 # Program tests
│   └── migrations/            # Deployment scripts
├── backend/                   # Express.js Backend API (Coming Soon)
│   ├── src/
│   │   ├── controllers/       # API route handlers
│   │   ├── services/         # Business logic
│   │   ├── models/           # Database models
│   │   ├── quicknode/        # Quicknode integration
│   │   │   ├── streams.ts    # WebSocket handlers
│   │   │   └── functions.ts  # Serverless functions
│   │   └── utils/            # Helper functions
│   ├── prisma/               # Database schema and migrations
│   └── tests/                # API tests
├── src/                      # Frontend (Next.js)
│   ├── app/                  # Next.js app router
│   │   ├── PayFlux/         # Payment features
│   │   ├── account/         # Wallet management
│   │   ├── clusters/        # Network selection
│   │   └── api/            # (To be moved to backend)
│   └── components/          # React components
│       ├── PayFlux/        # Payment components
│       ├── account/        # Account components
│       ├── cluster/        # Network components
│       ├── dashboard/      # Dashboard UI
│       ├── solana/         # Wallet integration
│       └── ui/             # Shared UI components
└── public/                  # Static assets
```

## Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd PayFlux
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
pnpm install

# Install backend dependencies
cd ../backend
pnpm install

# Install anchor dependencies
cd ../anchor
pnpm install
```

3. Set up environment variables:
```bash
# Frontend environment
cp frontend/.env.example frontend/.env

# Backend environment
cp backend/.env.example backend/.env
```

Edit environment files with your:
- Quicknode credentials (RPC & API keys)
- SMS provider credentials
- Database configuration
- JWT secrets

## Development

### Backend API (Express)

Start the development server:
```bash
cd backend
pnpm dev
```

Run tests:
```bash
pnpm test
```

Build for production:
```bash
pnpm build
```

### Frontend (Next.js)

Start the development server:
```bash
cd frontend
pnpm dev
```

Build for production:
```bash
pnpm build
```

## Technical Implementation

### Smart Contract Structure

```rust
pub struct PaymentRequest {
    pub sender: Pubkey,
    pub amount: u64,
    pub status: PaymentStatus,
    pub market_maker: Option<Pubkey>,
    pub recipient_details: RecipientDetails,
    pub bump: u8,
    pub request_id: String,
}
```

### Database Schema

```sql
CREATE TABLE transactions (
  request_id TEXT PRIMARY KEY,
  sender_wallet TEXT,
  receiver_account TEXT,
  receiver_name TEXT,
  receiver_phone TEXT,
  amount_ngn DECIMAL,
  market_maker_wallet TEXT NULL,
  status TEXT,
  created_at TIMESTAMP
);
```

## API Endpoints

### GET /api/transactions/pending
Get list of pending payment requests

### POST /api/transactions/verify-receipt
Verify payment receipt with NIN

### POST /api/notifications/send
Send SMS notifications to recipients

## Quicknode Integration

### WebSocket Infrastructure

PayFlux leverages Quicknode's WebSocket infrastructure for real-time event handling:

```typescript
// WebSocket connection setup
const wsConnection = new QuickNode.WebSocket(
  process.env.QUICKNODE_WSS_URL,
  {
    headers: {
      'Authorization': process.env.QUICKNODE_API_KEY
    }
  }
);

// Event handlers
wsConnection.on('connection', (ws) => {
  ws.on('message', async (data) => {
    const event = JSON.parse(data);
    
    if (event.name === 'PaymentCreated') {
      // Store transaction in database
      await db.run(`
        INSERT INTO transactions (
          request_id, sender_wallet, receiver_account, 
          receiver_name, receiver_phone, amount_ngn,
          status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'PENDING', datetime('now'))
      `, [event.requestId, event.sender, ...]);
      
      // Notify recipient via SMS
      await sendSMS(event.receiverPhone, 'You have a pending payment...');
    }

    if (event.name === 'PaymentFulfilled') {
      // Update transaction status
      await db.run(`
        UPDATE transactions 
        SET status = 'COMPLETED', 
            market_maker_wallet = ? 
        WHERE request_id = ?
      `, [event.marketMaker, event.requestId]);

      // Send confirmation SMS
      const tx = await db.get('SELECT * FROM transactions WHERE request_id = ?', [event.requestId]);
      await sendSMS(tx.receiver_phone, 'Your payment has been fulfilled!');
    }
  });
});
```

### Event Monitoring

The system monitors two main types of events:

1. `PaymentCreatedEvent`:
```typescript
{
  name: 'PaymentCreated',
  requestId: string,
  sender: PublicKey,
  amount: number,
  recipientDetails: {
    accountNumber: string,
    accountName: string,
    phoneNumber: string
  }
}
```

2. `PaymentFulfilledEvent`:
```typescript
{
  name: 'PaymentFulfilled',
  requestId: string,
  marketMaker: PublicKey,
  amount: number
}
```

### Environment Setup

Configure Quicknode credentials in your `.env`:
```bash
QUICKNODE_RPC_URL=https://your-endpoint.quiknode.pro/xxx
QUICKNODE_WSS_URL=wss://your-endpoint.quiknode.pro/xxx
QUICKNODE_API_KEY=your-api-key
```

## Deployment

1. Deploy smart contract to devnet:
```bash
cd anchor
pnpm anchor deploy --provider.cluster devnet
```

2. Deploy backend API:
```bash
cd backend
# Using PM2 for process management
pnpm deploy:prod
```

3. Deploy frontend to Vercel:
```bash
cd frontend
vercel deploy
```

4. Configure environment variables:
- Set up backend URL in frontend deployment
- Configure Quicknode credentials in backend
- Set up database connection strings
- Configure SMS provider credentials

## Testing Guide

1. Create test wallets:
```bash
solana-keygen new -o test-wallet.json
```

2. Get devnet SOL:
```bash
solana airdrop 2 <WALLET_ADDRESS> --url devnet
```

3. Test flows:
- Create payment request
- Act as market maker
- Verify SMS delivery
- Test NIN validation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
