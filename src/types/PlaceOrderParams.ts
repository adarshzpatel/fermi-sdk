import { Connection, Keypair, PublicKey } from "@solana/web3.js"

export type PlaceOrderParams = {
  kp: Keypair
  price: number
  qty:number
  connection: Connection
  marketPda:PublicKey
  coinMint:PublicKey
  pcMint:PublicKey
}