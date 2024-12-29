import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {PayFlux} from '../target/types/PayFlux'

describe('PayFlux', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.PayFlux as Program<PayFlux>

  const PayFluxKeypair = Keypair.generate()

  it('Initialize PayFlux', async () => {
    await program.methods
      .initialize()
      .accounts({
        PayFlux: PayFluxKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([PayFluxKeypair])
      .rpc()

    const currentCount = await program.account.PayFlux.fetch(PayFluxKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment PayFlux', async () => {
    await program.methods.increment().accounts({ PayFlux: PayFluxKeypair.publicKey }).rpc()

    const currentCount = await program.account.PayFlux.fetch(PayFluxKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment PayFlux Again', async () => {
    await program.methods.increment().accounts({ PayFlux: PayFluxKeypair.publicKey }).rpc()

    const currentCount = await program.account.PayFlux.fetch(PayFluxKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement PayFlux', async () => {
    await program.methods.decrement().accounts({ PayFlux: PayFluxKeypair.publicKey }).rpc()

    const currentCount = await program.account.PayFlux.fetch(PayFluxKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set PayFlux value', async () => {
    await program.methods.set(42).accounts({ PayFlux: PayFluxKeypair.publicKey }).rpc()

    const currentCount = await program.account.PayFlux.fetch(PayFluxKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the PayFlux account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        PayFlux: PayFluxKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.PayFlux.fetchNullable(PayFluxKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
