# Fermi SDK 

## Setup Localnet 

1. Run `solana-test-validator`
2. Get the deployed programId of the FermiDex program.
3. Paste the programId into the `config.json` in fermi-sdk 
4. Now create a new market buy running `npx ts-node ./examples/newMarket.example.ts`
5. Copy paste the generated market constants from the console output to the `config.json` marketConstants field.

Now you are ready to interact with the market through various functions available in sdk 

`import * as FermiDex from "../src`

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
import { rpcUrl, marketConstants } from "../config.json";
```

Initialize your connection:

```
const connection = new Connection(rpcUrl);
```

Load local keypairs for the owner and two users:

```
const owner = FermiDex.getLocalKeypair("/Users/zero/.config/solana/id.json");
const user1 = FermiDex.getLocalKeypair("./test-keypairs/user1/key.json");
const user2 = FermiDex.getLocalKeypair("./test-keypairs/user2/key.json");
```

## 2. Creating a Market

To initialize a market:

```
await FermiDex.initialiseMarket(owner, connection);
```

## 3. Airdropping Tokens

Airdrop coin and PC tokens to both users:

```
await FermiDex.airdropCoinToken(user1, owner, connection);
await FermiDex.airdropPcToken(user1, owner, connection);
await FermiDex.airdropCoinToken(user2, owner, connection);
await FermiDex.airdropPcToken(user2, owner, connection);
```

## 4. Fetching Token Balances

To fetch and display the balances for both users:

```
// fetch pc balance
const pcmint = new PublicKey(marketConstants.pcMint)
const pcTokenBalance = await FermiDex.getTokenBalance(user.publicKey,pcmint,connection);
console.log("Pc balance :",pcTokenBalance)
// fetch coin balance
const coinmint = new PublicKey(marketConstants.coinMint)
const coinTokenBalance = await FermiDex.getTokenBalance(user.publicKey,coinmint,connection);
console.log("Coin balance :",coinTokenBalance);
```

## 5. Placing Orders

Place a sell order for `user2` and a buy order for `user1`:

```
await FermiDex.placeNewBuyOrder(user1, 36, connection);
await FermiDex.placeNewSellOrder(user2, 35, connection);
```

## 6. Finalizing Orders

Finalizing orders involves matching and executing trades. Here's how to do it:

```
const authority = user2;
const counterparty = user1;

const openOrdersAuthority = await FermiDex.getOpenOrders(authority, connection);
const openOrdersCounterparty = await FermiDex.getOpenOrders(counterparty, connection);
const eventQ = await FermiDex.getParsedEventQ(user1, connection);

const matchedEvents = FermiDex.findMatchingEvents(openOrdersAuthority.orders, eventQ);

for (const [orderId, match] of matchedEvents) {
    const { orderIdMatched, orderIdSecondMatched } = match;
    if (!orderIdMatched || !orderIdSecondMatched) continue;
    
    await FermiDex.finaliseMatchesAsk({
      eventSlot1: orderIdSecondMatched.idx,
      eventSlot2: orderIdMatched.idx,
      authority: authority,
      authoritySecond: counterparty,
      openOrdersOwnerPda: openOrdersAuthority.pda,
      openOrdersCounterpartyPda: openOrdersCounterparty.pda,
      connection: connection
    });

    await FermiDex.finaliseMatchesBid({
      eventSlot1: orderIdSecondMatched.idx,
      eventSlot2: orderIdMatched.idx,
      authority: authority,
      authoritySecond: counterparty,
      openOrdersOwnerPda: openOrdersAuthority.pda,
      openOrdersCounterpartyPda: openOrdersCounterparty.pda,
      connection: connection
    });
}
```

---

