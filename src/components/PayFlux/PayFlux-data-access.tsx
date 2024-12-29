'use client'

import { getPayFluxProgram, getPayFluxProgramId } from '@project/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';

export interface RecipientDetails {
  accountNumber: string;
  accountName: string;
  phoneNumber: string;
}

export enum PaymentStatus {
  Pending,
  Completed,
}

export interface PaymentRequest {
  sender: PublicKey;
  amount: number;
  status: PaymentStatus;
  marketMaker: PublicKey | null;
  recipientDetails: RecipientDetails;
  bump: number;
  requestId: string;
}

export function usePayFluxProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const provider = useAnchorProvider();
  const programId = useMemo(() => getPayFluxProgramId(cluster.network as Cluster), [cluster]);
  const program = useMemo(() => getPayFluxProgram(provider, programId), [provider, programId]);

  return {
    program,
    programId,
  };
}

export const findPaymentPda = (requestId: string, programId: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('payment'), Buffer.from(requestId)],
    programId
  );
};
