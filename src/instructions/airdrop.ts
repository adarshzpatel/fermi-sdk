import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import { createAssociatedTokenAccount } from '../utils/createAssociatedTokenAccount';
import { mintTo } from '../utils/mintTo';
import { Keypair, Connection } from '@solana/web3.js';
import { getLocalKeypair } from '../utils/getLocalKeypair';
import {marketConstants} from "../../config.json"

export const airdropTo = async (userKp: Keypair,connection:Connection) => {
  try {
    const {coinMint,pcMint} = marketConstants
    const authority = userKp;
    const owner = getLocalKeypair('/Users/zero/.config/solana/id.json');
    const wallet = new anchor.Wallet(owner);
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      anchor.AnchorProvider.defaultOptions(),
    );

    // create token account 
    const authorityCoinTokenAccount = await spl.getAssociatedTokenAddress(
      new anchor.web3.PublicKey(coinMint),
      authority.publicKey,
      false,
    );


    await createAssociatedTokenAccount(
      provider,
      new anchor.web3.PublicKey(coinMint),
      authorityCoinTokenAccount,
      authority.publicKey,
    ).then(()=> console.log("✅ Coin ATA created for ",userKp.publicKey.toString())).catch(err=>console.log(err));


    await mintTo(
      provider,
      new anchor.web3.PublicKey(coinMint),
      authorityCoinTokenAccount,
      BigInt('10000000000'),
    ).then(()=> console.log("✅ Coin tokens minted to ",userKp.publicKey.toString())).catch(err=>console.log(err))


    const authorityPcTokenAccount = await spl.getAssociatedTokenAddress(
      new anchor.web3.PublicKey(pcMint),
      authority.publicKey,
      false,
    );

    await createAssociatedTokenAccount(
      provider,
      new anchor.web3.PublicKey(pcMint),
      authorityPcTokenAccount,
      authority.publicKey,
    ).then(()=> console.log("✅ Pc ATA created for ",userKp.publicKey.toString())).catch(err=>console.log(err));

    
    await mintTo(
      provider,
      new anchor.web3.PublicKey(pcMint),
      authorityPcTokenAccount,
      BigInt('1000000000'),
    ).then(()=> console.log("✅ Pc tokens minted to ",userKp.publicKey.toString())).catch(err=>console.log(err));

    console.log('Airdropped to ', authority.publicKey.toString(), '✅');
    return {
      authorityCoinTokenAccount,
      authorityPcTokenAccount,
    };
  } catch (err) {
    console.log('Something went wrong while airdropping .');
    console.log(err);
  }
}
