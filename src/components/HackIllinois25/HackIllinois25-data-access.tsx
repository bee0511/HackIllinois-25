'use client'

import { getHackIllinois25Program, getHackIllinois25ProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useHackIllinois25Program() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getHackIllinois25ProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getHackIllinois25Program(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['HackIllinois25', 'all', { cluster }],
    queryFn: () => program.account.HackIllinois25.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['HackIllinois25', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ HackIllinois25: keypair.publicKey }).signers([keypair]).rpc(),
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

export function useHackIllinois25ProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useHackIllinois25Program()

  const accountQuery = useQuery({
    queryKey: ['HackIllinois25', 'fetch', { cluster, account }],
    queryFn: () => program.account.HackIllinois25.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['HackIllinois25', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ HackIllinois25: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['HackIllinois25', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ HackIllinois25: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['HackIllinois25', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ HackIllinois25: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['HackIllinois25', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ HackIllinois25: account }).rpc(),
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
