'use client';

import React, { FC, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { usePayFluxProgram } from './PayFlux-data-access';

interface RecipientDetails {
  accountNumber: string;
  accountName: string;
  phoneNumber: string;
}

export const PaymentForm: FC = () => {
  const { program, programId } = usePayFluxProgram();
  const { publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [recipientDetails, setRecipientDetails] = useState<RecipientDetails>({
    accountNumber: '',
    accountName: '',
    phoneNumber: '',
  });
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !program) return;

    try {
      setIsLoading(true);
      const requestId = `payment-${Date.now()}`;
      const amountInLamports = new BN(parseFloat(amount) * 1e9);

      const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from('payment'), Buffer.from(requestId)],
        programId
      );

      await program.methods
        .createPayment(requestId, amountInLamports, {
          accountNumber: recipientDetails.accountNumber,
          accountName: recipientDetails.accountName,
          phoneNumber: recipientDetails.phoneNumber,
        })
        .accounts({
          sender: publicKey,
          'payment_request': pda,
          'system_program': SystemProgram.programId,
        } as any)
        .rpc();

      setRecipientDetails({
        accountNumber: '',
        accountName: '',
        phoneNumber: '',
      });
      setAmount('');
    } catch (error) {
      console.error('Error creating payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-8 text-indigo-400">Send Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Account Number
            </label>
            <input
              type="text"
              maxLength={10}
              required
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                transition-colors duration-200"
              value={recipientDetails.accountNumber}
              onChange={(e) =>
                setRecipientDetails({
                  ...recipientDetails,
                  accountNumber: e.target.value,
                })
              }
              placeholder="Enter account number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Account Name
            </label>
            <input
              type="text"
              required
              maxLength={100}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                transition-colors duration-200"
              value={recipientDetails.accountName}
              onChange={(e) =>
                setRecipientDetails({
                  ...recipientDetails,
                  accountName: e.target.value,
                })
              }
              placeholder="Enter account name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              required
              maxLength={15}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                transition-colors duration-200"
              value={recipientDetails.phoneNumber}
              onChange={(e) =>
                setRecipientDetails({
                  ...recipientDetails,
                  phoneNumber: e.target.value,
                })
              }
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Amount (SOL)
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.000000001"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                transition-colors duration-200"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in SOL"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !publicKey}
          className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700
            text-white font-medium rounded-xl shadow-lg
            transform transition-all duration-200 hover:scale-[1.02]
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900
            disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            'Submit Payment'
          )}
        </button>
      </form>
    </div>
  );
}; 