# Fermi SDK

## Setup Localnet

1. Run `solana-test-validator`
2. Get the deployed programId of the FermiDex program.
3. Paste the programId into the `config.json` in fermi-sdk
4. Now create a new market by running `npx ts-node ./examples/newMarket.example.ts`
5. Copy paste the generated market constants from the console output to the `config.json` marketConstants field.

You now are ready to interact with the market through various functions available in sdk

`import * as FermiDex from "../src`

## Setup for devnet

Go to `config.json`

- Replace `rpcUrl` with `https://api.devnet.solana.com` or any custom endpoint for devnet
- Replace `programId` with address of deployed program on devnet [contact team for latest programID: tg: @dtree33]

# Fermi Protocol SDK Tutorial

The Fermi Protocol SDK provides functionalities to interact with the Fermi DEX on Solana. In this tutorial, we will cover the following steps:

1. Setting up the environment
2. Creating a market
3. Airdropping tokens
4. Fetching token balances
5. Placing orders
6. Finalizing orders

## Things to keep in mind

Make sure all the keypairs have sol in it , else airdrop some using `solana airdrop <sol-amount> <address>`

## 1. Setting Up the Environment

To begin, import the necessary modules and configurations:

```
import { Connection, PublicKey } from "@solana/web3.js";
import * as FermiDex from "../src";
import { rpcUrl } from "../config.json";
import {markets} from "./markets.ts"
```

Initialize your connection:

```
const connection = new Connection(rpcUrl);
```

Load local keypairs for the owner and two users:

```
const owner = FermiDex.getLocalKeypair("~/.config/solana/id.json");
const user1 = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
const user2 = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json");
```

## 2. Creating a Market

To initialize a market:

```
await FermiDex.initialiseMarket(owner, connection);
```

## 3. Create client

Create a client with a authority keypair , connection and specify which market to interact with

```
/*
Example market :
{
  marketPda: "6U2rPcw5vqdc6cpPq4APpNmmdhZe3Qfnv36Wgz4xi94H",
  coinMint: "34ma6yJYJ1MANrzYB16iVTaAay8uisw5qUr42Np5Vze6",
  pcMint: "HvhQgh71p4Tz7g7bBNbsMCYShpesPt16kG2YtaYFwFE4",
}
*/
const client = new FermiDex.FermiClient({
  market:markets[0],
  connection,
  authority:userKp
})
```

## 3. Airdropping Tokens

Airdrop coin and PC tokens

```
// airdrop coin tokens
await FermiDex.airdropToken({
    receiverPk: bobKp.publicKey,
    amount: 1000 * (10 ** 9),
    connection,
    mint: new PublicKey(currentMarket.coinMint),
    ownerKp: owner,
});
//airdrop pc tokens
await FermiDex.airdropToken({
    receiverPk: bobKp.publicKey,
    amount: 1000 * (10 ** 9),
    connection,
    mint: new PublicKey(currentMarket.pcMint),
    ownerKp: owner,
});
```

## 4. Fetching Token Balances

To fetch and display the balances for both users:

```
// Fetch custom token balance of wallet by specifying mint address of token
const cutomTokenBalance = await FermiDex.getTokenBalance(userKp.publicKey,new PublicKey(selectedMarket.pcMint),connection);

// Fetch Pc token balance of current market
const pcTokenBalance = await client.getWalletPcBalance()

// Fetch Coin token balance of current market
const coinTokenBalance = await client.getWalletCoinBalance()

// Fetch open orders account balance
const openOrdersTokenBalances = await client.fetchOpenOrdersAccountBalances();
```

## 5. Placing Orders

Place a buy order for `bob` and a sell order for `alice`:

```
const buyOrder = await bobClient.placeBuyOrder(30,1)
console.log({buyOrder})

const sellOrder = await aliceClient.placeSellOrder(30,1)
console.log({sellOrder})
```

## 6. Finalizing Orders

Finalizing orders involves matching and executing trades. Here's how to do it:

```
// Get a map of finalisable orders
const matchedEventsAlice = await aliceClient.getFinalisableOrderMap();

console.log({ matchedEventsAlice });
const matchedOrders = Object.keys(matchedEventsAlice); // Get
const orderIdToFinalise = matchedOrders[0]; // Select which order to finalise
const match = matchedEventsAlice[orderIdToFinalise];

const finaliseSellOrder = await aliceClient.finaliseSellOrder(
  orderIdToFinalise, // string 
  aliceKp, // Keypair
  match.eventSlot1, // number 
  match.eventSlot2 // number 
);
console.log({ finaliseSellOrder });

const finaliseBuyOrder = await bobClient.finaliseBuyOrder(
  orderIdToFinalise,
  bobKp,
  match.eventSlot1,
  match.eventSlot2
);
console.log({ finaliseBuyOrder });
```

## 7. Fetching market data like openOrders , asks , bids , eventQueue

To fetch asks & bids

```
const bids = await client.getBids()
const asks = await client.getAsks()
```

To fetch event queue

```
const eventQueue = await client.getEventQueue();
```

To fetch openOrders account 
```
const oo = await client.getOpenOrders()
```

# 8. Cancelling orders 
To cancel order , you have to specify orderId which needs to be cancelled
```
// orderIdToCancel : string
const cancelBuy = await client.cancelBuyOrder(orderIdToCancel);
const cancelSell = await client.cancelSellOrder(orderIdToCancel);
```

# 9. Deposit Tokens 
To deposit tokens in open orders account from wallet 
```
// amount: number
const depositPc = await client.depositPcTokens(amount);
const depositCoin = await client.depositCoinTokens(amount);
```

# 10. Withdraw Tokens
To withdraw tokens from open orders account to wallet
```
// amount : number 
const withdrawPc = await client.withdrawPcTokens(10);
const withdrawCoins = await client.withdrawPcTokens(10);
```
---
