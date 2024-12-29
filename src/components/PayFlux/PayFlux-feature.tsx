'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { ExplorerLink } from '../cluster/cluster-ui'
import { usePayFluxProgram } from './PayFlux-data-access'
import { PayFluxCreate, PayFluxList } from './PayFlux-ui'

export default function PayFluxFeature() {
  const { publicKey } = useWallet()
  const { programId } = usePayFluxProgram()

  return publicKey ? (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-indigo-400">
            PayFlux
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            A decentralized crypto-to-fiat bridge enabling direct transfers from Solana wallets to Nigerian bank accounts. 
            Send crypto payments and let market makers fulfill the fiat transfers.
          </p>
          <div className="mt-6 text-sm text-slate-400">
            <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl ring-1 ring-white/10">
          <PayFluxCreate />
        </div>

        <div className="mt-12">
          <PayFluxList />
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-12 shadow-2xl ring-1 ring-white/10">
            <h1 className="text-6xl font-bold mb-6 text-indigo-400">
              Welcome to PayFlux
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect your wallet to start sending crypto payments or fulfill payment requests as a market maker.
            </p>
            <div className="inline-block">
              <div className="transform hover:scale-105 transition-transform duration-200 hover:shadow-lg">
                <WalletButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
