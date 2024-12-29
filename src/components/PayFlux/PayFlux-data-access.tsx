'use client'

import { getPayFluxProgram, getPayFluxProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function usePayFluxProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getPayFluxProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getPayFluxProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['PayFlux', 'all', { cluster }],
    queryFn: () => program.account.PayFlux.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['PayFlux', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ PayFlux: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function usePayFluxProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = usePayFluxProgram()

  const accountQuery = useQuery({
    queryKey: ['PayFlux', 'fetch', { cluster, account }],
    queryFn: () => program.account.PayFlux.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['PayFlux', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ PayFlux: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['PayFlux', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ PayFlux: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['PayFlux', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ PayFlux: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['PayFlux', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ PayFlux: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
