import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import { Connection} from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';
import {marketConstants,programId} from '../../config.json'
import { IDL } from '../types/IDL';

/**
 * Place a new limit sell order == ASK
 *
 * @param kp - User's kp
 * @param price - The price for the sell order.
 * @returns A confirmation message.
 */
export async function placeNewSellOrder(kp: Keypair, price: number = 22,connection:Connection) {
  try {
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
    const authority = kp;

    const wallet = new anchor.Wallet(authority);

    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      anchor.AnchorProvider.defaultOptions(),
    );

    const program = new anchor.Program(IDL, programId, provider);
    const authorityCoinTokenAccount = await spl.getAssociatedTokenAddress(
      new anchor.web3.PublicKey(coinMint),
      authority.publicKey,
      false,
    );

    const [openOrdersPda] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from('open-orders', 'utf-8'),
          new anchor.web3.PublicKey(marketPda).toBuffer(),
          authority.publicKey.toBuffer(),
        ],
        new anchor.web3.PublicKey(programId),
      );

    await program.methods
      .newOrder(
        { ask: {} },
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
        payer: authorityCoinTokenAccount,
        bids: bidsPda,
        asks: asksPda,
        reqQ: reqQPda,
        eventQ: eventQPda,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    const openOrders = await program.account.openOrders.fetch(
        openOrdersPda,
    );
    console.log("Open orders for ",authority.publicKey.toString())
    console.log(openOrders.orders.map(item=>item.toString()))
    return {
      message: 'Place limit order sell price: ' + price,
    };
  } catch (err) {
    console.log('something went wrong while placing a sell order!');
    console.log(err);
  }
}
