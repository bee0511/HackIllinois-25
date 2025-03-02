// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import HackIllinois25IDL from '../target/idl/hack_illinois_25.json'
import type { HackIllinois25 } from '../target/types/hack_illinois_25'

// Re-export the generated IDL and type
export { HackIllinois25, HackIllinois25IDL }

// The programId is imported from the program IDL.
export const HACK_ILLINOIS25_PROGRAM_ID = new PublicKey(HackIllinois25IDL.address)

// This is a helper function to get the HackIllinois25 Anchor program.
export function getHackIllinois25Program(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...HackIllinois25IDL, address: address ? address.toBase58() : HackIllinois25IDL.address } as HackIllinois25, provider)
}

// This is a helper function to get the program ID for the HackIllinois25 program depending on the cluster.
export function getHackIllinois25ProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the HackIllinois25 program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return HACK_ILLINOIS25_PROGRAM_ID
  }
}
