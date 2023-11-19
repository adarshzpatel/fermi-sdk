import * as anchor from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';
import { Keypair } from "@solana/web3.js"; // if needed for getLocalKeypair function
import {programId} from "../../config.json"
import { IDL } from '../types';

function getFermiDexProgram(authority:Keypair,connection:Connection) {
  const wallet = new anchor.Wallet(authority);
  const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      anchor.AnchorProvider.defaultOptions(),
  );

  return new anchor.Program(IDL as any, programId, provider);
}

export default getFermiDexProgram