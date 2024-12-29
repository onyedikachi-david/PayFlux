'use client'

import { MarketMakerDashboard } from '@/components/PayFlux/MarketMakerDashboard';
import { WalletButton } from '@/components/solana/solana-provider';

export default function MarketMakerPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-indigo-400">
            Market Maker Dashboard
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            View and fulfill pending payment requests, verify transactions, and manage fiat transfers
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl ring-1 ring-white/10">
          <MarketMakerDashboard />
        </div>
      </div>
    </div>
  );
} 