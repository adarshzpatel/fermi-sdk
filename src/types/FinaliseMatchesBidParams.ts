import { Keypair, Connection, PublicKey } from "@solana/web3.js";

export type FinaliseMatchesBidParams = {
  eventSlot1: number;
  eventSlot2: number;
  authority: Keypair;
  authoritySecond: Keypair;
  openOrdersOwnerPda: PublicKey;
  openOrdersCounterpartyPda: PublicKey;
  connection: Connection;
};
