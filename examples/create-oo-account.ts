import { PublicKey } from "@solana/web3.js"
import { initClientWithKeypairPath } from "./utils"
import { marketPda } from "./constants"
import { BN } from "@coral-xyz/anchor"
import { getLocalKeypair } from "../src"

const main = async () => {
  // Create an OpenOrders accounts for bob and alice
  const bobKp = getLocalKeypair("./test-keypairs/bob/key.json")
  const aliceKp = getLocalKeypair("./test-keypairs/alice/key.json")

  const bobClient = initClientWithKeypairPath("./test-keypairs/bob/key.json")
  const aliceClient = initClientWithKeypairPath("./test-keypairs/alice/key.json")
  const market = await bobClient.deserializeMarketAccount(new PublicKey(marketPda))

  if(market === null) throw new Error("Market not found")

  const ooPkBob = await bobClient.createOpenOrders(
    bobKp, // payer keypair
    new PublicKey(marketPda),
    "Bob",
    bobKp
  )

  console.log("Open orders acccount created for bob",ooPkBob.toString())
  
  const ooPkAlice = await aliceClient.createOpenOrders(
    aliceKp, // payer keypair
    new PublicKey(marketPda),
    "Alice",
    aliceKp
  )
  console.log("Open orders acccount created for Alice",ooPkAlice.toString())


}

main().catch((err) => {
  console.log(err)
  process.exit(1)
})