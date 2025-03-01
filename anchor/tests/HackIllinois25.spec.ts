import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {HackIllinois25} from '../target/types/HackIllinois25'

describe('HackIllinois25', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.HackIllinois25 as Program<HackIllinois25>

  const HackIllinois25Keypair = Keypair.generate()

  it('Initialize HackIllinois25', async () => {
    await program.methods
      .initialize()
      .accounts({
        HackIllinois25: HackIllinois25Keypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([HackIllinois25Keypair])
      .rpc()

    const currentCount = await program.account.HackIllinois25.fetch(HackIllinois25Keypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment HackIllinois25', async () => {
    await program.methods.increment().accounts({ HackIllinois25: HackIllinois25Keypair.publicKey }).rpc()

    const currentCount = await program.account.HackIllinois25.fetch(HackIllinois25Keypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment HackIllinois25 Again', async () => {
    await program.methods.increment().accounts({ HackIllinois25: HackIllinois25Keypair.publicKey }).rpc()

    const currentCount = await program.account.HackIllinois25.fetch(HackIllinois25Keypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement HackIllinois25', async () => {
    await program.methods.decrement().accounts({ HackIllinois25: HackIllinois25Keypair.publicKey }).rpc()

    const currentCount = await program.account.HackIllinois25.fetch(HackIllinois25Keypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set HackIllinois25 value', async () => {
    await program.methods.set(42).accounts({ HackIllinois25: HackIllinois25Keypair.publicKey }).rpc()

    const currentCount = await program.account.HackIllinois25.fetch(HackIllinois25Keypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the HackIllinois25 account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        HackIllinois25: HackIllinois25Keypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.HackIllinois25.fetchNullable(HackIllinois25Keypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
