import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import { Connection } from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';
import { marketConstants, programId } from '../../config.json'
import { IDL } from '../types/IDL';

/**
 * Place a new limit sell order == ASK
 *
 * @param kp - User's kp
 * @param price - The price for the sell order.
 * @returns A confirmation message.
 */
export async function placeNewSellOrder(kp: Keypair, price: number = 22, connection: Connection) {
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

    const tx = await program.methods
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

    console.log("Placed limit sell order at price ", price)


    return {
      tx,
      message: 'Placed limit order sell price: ' + price,
    };
  } catch (err) {
    console.log('something went wrong while placing a sell order!');
    console.log(err);
  }
}


export async function placeNewSellOrderCustom(kp: Keypair, price: number = 22, connection: Connection,marketPda:anchor.web3.PublicKey,coinMint:anchor.web3.PublicKey,pcMint:anchor.web3.PublicKey) {
  try {
    const authority = kp;

    const wallet = new anchor.Wallet(authority);

    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      anchor.AnchorProvider.defaultOptions(),
    );

    const program = new anchor.Program(IDL, programId, provider);

    const [bidsPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("bids", "utf-8"), marketPda.toBuffer()],
      program.programId
    );
    const [asksPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("asks", "utf-8"), marketPda.toBuffer()],
      program.programId
    );
  
    const [reqQPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("req-q", "utf-8"), marketPda.toBuffer()],
      program.programId
    );
    const [eventQPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("event-q", "utf-8"), marketPda.toBuffer()],
      program.programId
    );

    const coinVault = await spl.getAssociatedTokenAddress(
      coinMint,
      marketPda,
      true
    );
    const pcVault = await spl.getAssociatedTokenAddress(
      pcMint,
      marketPda,
      true
    );

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

    const tx = await program.methods
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

    console.log("Placed limit sell order at price ", price)


    return {
      tx,
      message: 'Placed limit order sell price: ' + price,
    };
  } catch (err) {
    console.log('something went wrong while placing a sell order!');
    console.log(err);
  }
}
