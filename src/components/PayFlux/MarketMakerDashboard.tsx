'use client';

import React, { FC, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { usePayFluxProgram } from './PayFlux-data-access';

interface PendingRequest {
  requestId: string;
  sender: string;
  amount: number;
  recipientDetails: {
    accountNumber: string;
    accountName: string;
    phoneNumber: string;
  };
  status: 'pending' | 'fulfilled' | 'verified' | 'completed';
}

export const MarketMakerDashboard: FC = () => {
  const { program, programId } = usePayFluxProgram();
  const { publicKey } = useWallet();
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [nin, setNin] = useState('');
  const [ussdCode, setUssdCode] = useState('');

  const fetchPendingRequests = async () => {
    if (!program) return;
    try {
      const response = await fetch('/api/transactions/pending');
      const data = await response.json();
      setPendingRequests(data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
    const interval = setInterval(fetchPendingRequests, 10000);
    return () => clearInterval(interval);
  }, [program]);

  const handleFulfill = async (requestId: string) => {
    if (!publicKey || !program) return;
    
    try {
      setIsLoading(true);
      setSelectedRequest(requestId);

      const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from('payment'), Buffer.from(requestId)],
        programId
      );

      await program.methods
        .fulfillPayment()
        .accounts({
          'market_maker': publicKey,
          'payment_request': pda,
        } as any)
        .rpc();

      await fetchPendingRequests();
    } catch (error) {
      console.error('Error fulfilling payment:', error);
    } finally {
      setIsLoading(false);
      setSelectedRequest(null);
    }
  };

  const handleVerifyNin = async (requestId: string) => {
    try {
      const response = await fetch('/api/transactions/verify-nin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, nin }),
      });
      if (response.ok) {
        await fetchPendingRequests();
        setNin('');
      }
    } catch (error) {
      console.error('Error verifying NIN:', error);
    }
  };

  const handleConfirmReceipt = async (requestId: string) => {
    try {
      const response = await fetch('/api/transactions/confirm-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, ussdCode }),
      });
      if (response.ok) {
        await fetchPendingRequests();
        setUssdCode('');
      }
    } catch (error) {
      console.error('Error confirming receipt:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-8 text-indigo-400">Payment Requests</h2>
      <div className="space-y-6">
        {pendingRequests.map((request) => (
          <div
            key={request.requestId}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg ring-1 ring-white/10
              transform transition-all duration-200 hover:shadow-xl hover:ring-indigo-500/20"
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Request ID</p>
                <p className="font-mono text-slate-200">{request.requestId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Amount</p>
                <p className="text-xl font-semibold text-indigo-400">{(request.amount / 1e9).toFixed(4)} SOL</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Recipient Name</p>
                <p className="text-slate-200">{request.recipientDetails.accountName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Account Number</p>
                <p className="font-mono text-slate-200">{request.recipientDetails.accountNumber}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {request.status === 'pending' && (
                <button
                  onClick={() => handleFulfill(request.requestId)}
                  disabled={isLoading && selectedRequest === request.requestId}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700
                    text-white font-medium rounded-lg shadow-lg
                    transform transition-all duration-200 hover:scale-[1.02]
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900
                    disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading && selectedRequest === request.requestId ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Fulfill Request'
                  )}
                </button>
              )}

              {request.status === 'fulfilled' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter NIN to verify"
                    value={nin}
                    onChange={(e) => setNin(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleVerifyNin(request.requestId)}
                    className="w-full py-3 px-4 bg-green-600 hover:bg-green-700
                      text-white font-medium rounded-lg shadow-lg
                      transform transition-all duration-200 hover:scale-[1.02]"
                  >
                    Verify NIN
                  </button>
                </div>
              )}

              {request.status === 'verified' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter USSD code to confirm receipt"
                    value={ussdCode}
                    onChange={(e) => setUssdCode(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleConfirmReceipt(request.requestId)}
                    className="w-full py-3 px-4 bg-green-600 hover:bg-green-700
                      text-white font-medium rounded-lg shadow-lg
                      transform transition-all duration-200 hover:scale-[1.02]"
                  >
                    Confirm Receipt
                  </button>
                </div>
              )}

              {request.status === 'completed' && (
                <div className="text-center py-2 px-4 bg-green-600/20 text-green-400 rounded-lg">
                  Transaction Completed
                </div>
              )}
            </div>
          </div>
        ))}
        {pendingRequests.length === 0 && (
          <div className="text-center py-12 bg-slate-800/50 backdrop-blur-sm rounded-xl ring-1 ring-white/10">
            <p className="text-slate-400 text-lg">
              No payment requests available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 