import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import { Connection, } from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';
import { marketConstants, programId } from '../../config.json'
import { IDL } from '../types/IDL';

/**
 * Place a new limit buy order == bid
 *
 * @param kp -  User's keypair
 * @param price - The price for the sell order.
 * @returns A confirmation message.
 */
export async function placeNewBuyOrder(kp: Keypair, price: number, connection: Connection) {
  try {
    const authority = kp;
    const wallet = new anchor.Wallet(authority);
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      anchor.AnchorProvider.defaultOptions(),
    );
    const {
      asksPda,
      bidsPda,
      coinMint,
      coinVault,
      eventQPda,
      marketPda,
      pcMint,
      pcVault,
      reqQPda,
    } = marketConstants
    const program = new anchor.Program(IDL, programId, provider);

    const authorityPcTokenAccount = await spl.getAssociatedTokenAddress(
      new anchor.web3.PublicKey(pcMint),
      authority.publicKey,
      false,
    );

    const [openOrdersPda] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('open-orders', 'utf-8'),
        new anchor.web3.PublicKey(marketPda).toBuffer(),
        authority.publicKey.toBuffer(),
      ],
      new anchor.web3.PublicKey(programId),
    );

    const tx = await program.methods
      .newOrder(
        { bid: {} },
        new anchor.BN(price),
        new anchor.BN(1),
        new anchor.BN(price),
        { limit: {} },
      )
      .accounts({
        openOrders: openOrdersPda,
        market: marketPda,
        coinVault,
        pcVault,
        coinMint: coinMint,
        pcMint: pcMint,
        payer: authorityPcTokenAccount,
        bids: bidsPda,
        asks: asksPda,
        reqQ: reqQPda,
        eventQ: eventQPda,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    console.log("Placed limit buy order at price ",price)

    return {
      tx,
      message: 'Placed limit order Buy price: ' + price,
    };
  } catch (err) {
    console.log('something went wrong while placing a buy order!');
    console.log(err);
  }
}
