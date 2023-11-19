import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import { Connection, Keypair, PublicKey } from "@solana/web3.js"
import getFermiDexProgram from '../utils/getFermiDexProgram';

type PlaceOrderParams = {
  authority: Keypair
  price: number
  qty:number
  connection: Connection
  marketPda:PublicKey
  coinMint:PublicKey
  pcMint:PublicKey
}

export async function placeNewBuyOrder({coinMint,connection,authority,marketPda,pcMint,price,qty}:PlaceOrderParams) {
  try {
    const program = getFermiDexProgram(authority,connection)

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
      new anchor.web3.PublicKey(program.programId),
    );

    const tx = await program.methods
      .newOrder(
        { bid: {} },
        new anchor.BN(price),
        new anchor.BN(qty),
        new anchor.BN(price*qty),
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

export async function placeNewSellOrderCustom({coinMint,connection,authority,marketPda,pcMint,price,qty}:PlaceOrderParams) {
  try {
    const program = getFermiDexProgram(authority,connection)

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
        new anchor.web3.PublicKey(program.programId),
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
