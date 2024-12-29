// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import PayFluxIDL from '../target/idl/PayFlux.json'
import type { PayFlux } from '../target/types/PayFlux'

// Re-export the generated IDL and type
export { PayFlux, PayFluxIDL }

// The programId is imported from the program IDL.
export const PAY_FLUX_PROGRAM_ID = new PublicKey(PayFluxIDL.address)

// This is a helper function to get the PayFlux Anchor program.
export function getPayFluxProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...PayFluxIDL, address: address ? address.toBase58() : PayFluxIDL.address } as PayFlux, provider)
}

// This is a helper function to get the program ID for the PayFlux program depending on the cluster.
export function getPayFluxProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the PayFlux program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return PAY_FLUX_PROGRAM_ID
  }
}
