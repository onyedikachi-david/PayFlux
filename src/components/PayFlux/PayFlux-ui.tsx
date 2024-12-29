'use client'

import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
// import { ellipsify } from '../ui/ui-layout'
import { ExplorerLink } from '../cluster/cluster-ui'
import { usePayFluxProgram } from './PayFlux-data-access'
import { PaymentForm } from './PaymentForm'
import { MarketMakerDashboard } from './MarketMakerDashboard'

export function PayFluxCreate() {
  return (
    <div className="space-y-8">
      <PaymentForm />
    </div>
  )
}

export function PayFluxList() {
  const { program } = usePayFluxProgram()

  if (!program) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Please connect your wallet to continue.</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <MarketMakerDashboard />
    </div>
  )
}
