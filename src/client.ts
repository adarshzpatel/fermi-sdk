// Implement a client architechture for the sdk
import { Program } from "@project-serum/anchor";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { FermiDex } from "./types";
import { getFermiDexProgram } from "./utils/getFermiDexProgram";

import {
  cancelAskIx,
  cancelBidIx,
  cancelWithPenalty,
  createAskIx,
  createBidIx,
  depositCoinTokensIx,
  depositPcTokensIx,
  withdrawCoinTokensIx,
  withdrawPcTokensIx,
} from "./instructions";
import { finaliseAskIx, finaliseBidIx } from "./instructions/finaliseOrders";
import {
  fetchOpenOrdersAccount,
  findMatchingEvents,
  getParsedEventQ,
  getTokenBalance,
  priceFromOrderId,
} from "./utils";
import * as anchor from "@project-serum/anchor";

type Market = {
  marketPda: PublicKey;
  coinMint: PublicKey;
  pcMint: PublicKey;
};

type FermiClientParams = {
  market: {
    authority?: string;
    programId?: string;
    marketPda: string;
    coinMint: string;
    pcMint: string;
  };
  authority: Keypair;
  connection: Connection;
};

export class FermiClient {
  private program: Program<FermiDex>;
  private market: Market;
  public authority: Keypair;
  public connection: Connection;

  constructor({ market, connection, authority }: FermiClientParams) {
    this.authority = authority;
    this.program = getFermiDexProgram(authority, connection);
    const _market = {
      marketPda: new PublicKey(market.marketPda),
      coinMint: new PublicKey(market.coinMint),
      pcMint: new PublicKey(market.pcMint),
    };
    this.market = _market;
    this.connection = connection;
  }

  setCurrentMarket(market: FermiClientParams["market"]) {
    const _market = {
      marketPda: new PublicKey(market.marketPda),
      coinMint: new PublicKey(market.coinMint),
      pcMint: new PublicKey(market.pcMint),
    };
    this.market = _market;
  }

  setConnection(conn: Connection) {
    this.connection = conn;
  }
  getCurrentMarket() {
    return this.market;
  }

  getProgram() {
    return this.program;
  }

  // Wallet specific
  async placeBuyOrder(price: number, qty: number) {
    return createBidIx({
      program: this.program,
      coinMint: this.market.coinMint,
      authority: this.authority,
      marketPda: this.market.marketPda,
      pcMint: this.market.pcMint,
      price: price,
      qty: qty,
    });
  }
  async placeSellOrder(price: number, qty: number) {
    return createAskIx({
      program: this.program,
      coinMint: this.market.coinMint,
      authority: this.authority,
      marketPda: this.market.marketPda,
      pcMint: this.market.pcMint,
      price: price,
      qty: qty,
    });
  }

  async cancelWithPenalty(eventSlot1:number,eventSlot2:number,side:"Ask"|"Bid",askerPk:PublicKey,bidderPk:PublicKey){
    return cancelWithPenalty({
      authority: this.authority,
      program: this.program,
      marketPda: this.market.marketPda,
      askerPk,
      bidderPk,
      eventSlot1,
      eventSlot2,
      side
    })
  }
  async cancelBuyOrder(orderId: string) {
    return cancelBidIx({
      marketPda: this.market.marketPda,
      program: this.program,
      orderId,
      authority: this.authority,
    });
  }
  async cancelSellOrder(orderId: string) {
    return cancelAskIx({
      marketPda: this.market.marketPda,
      program: this.program,
      orderId,
      authority: this.authority,
    });
  }
  async depositCoinTokens(amount: number) {
    return depositCoinTokensIx({
      marketPda: this.market.marketPda,
      coinMint: this.market.coinMint,
      amount: amount,
      authority: this.authority,
      program: this.program,
    });
  }
  async depositPcTokens(amount: number) {
    return depositPcTokensIx({
      marketPda: this.market.marketPda,
      pcMint: this.market.pcMint,
      amount: amount,
      authority: this.authority,
      program: this.program,
    });
  }

  async withdrawCoinTokens(amount: number) {
    return withdrawCoinTokensIx({
      program: this.program,
      marketPda: this.market.marketPda,
      amount: amount,
      authority: this.authority,
      coinMint: this.market.coinMint,
      pcMint: this.market.pcMint,
    });
  }
  async withdrawPcTokens(amount: number) {
    return withdrawPcTokensIx({
      program: this.program,
      marketPda: this.market.marketPda,
      amount: amount,
      authority: this.authority,
      coinMint: this.market.coinMint,
      pcMint: this.market.pcMint,
    });
  }
  async finaliseSellOrder(orderId: string,counterpartyPk:PublicKey) {
    const matchedOrders = await this.getFinalisableOrderMap();
    const match = matchedOrders[orderId];

    if (!match) throw new Error("No matching orders found");
    return finaliseAskIx({
      program: this.program,
      authority: this.authority,
      coinMint: this.market.coinMint,
      pcMint: this.market.pcMint,
      eventSlot1: match.eventSlot1,
      eventSlot2: match.eventSlot2,
      marketPda: this.market.marketPda,
      counterparty:counterpartyPk
    });
  }
  async finaliseBuyOrder(orderId: string,counterpartyPk:PublicKey) {
    const matchedOrders = await this.getFinalisableOrderMap();
    const match = matchedOrders[orderId];
 
    if (!match) throw new Error("No matching orders found");
    return finaliseBidIx({
      program: this.program,
      authority: this.authority,
      coinMint: this.market.coinMint,
      pcMint: this.market.pcMint,
      eventSlot1: match.eventSlot1,
      eventSlot2: match.eventSlot2,
      marketPda: this.market.marketPda,
      counterparty: counterpartyPk
    });
  }


  async getOpenOrders() {
    return fetchOpenOrdersAccount(
      this.authority,
      this.program,
      this.market.marketPda
    );
  }
  async fetchOpenOrdersAccountBalances() {
    const oo = await this.getOpenOrders();
    const tokenBalances = {
      nativePcTotal: oo.nativePcTotal.toString(),
      nativePcFree: oo.nativePcFree.toString(),
      nativeCoinFree: oo.nativeCoinFree.toString(),
      nativeCoinTotal: oo.nativeCoinTotal.toString(),
    };
    return tokenBalances;
  }
  async getFinalisableOrderMap() {
    const { orders } = await this.getOpenOrders();
    const eventQ = await this.getEventQueue();
    const matchedOrders = findMatchingEvents(orders, eventQ);
    return matchedOrders;
  }
  // Market specific
  async getEventQueue() {
    return getParsedEventQ({
      marketPda: this.market.marketPda,
      program: this.program,
    });
  }
  async getBids() {
    const [bidsPda] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("bids", "utf-8"),
        new PublicKey(this.market?.marketPda).toBuffer(),
      ],
      this.program.programId
    );

    const res = await this.program.account.orders.fetch(
      new anchor.web3.PublicKey(bidsPda)
    );
    const bids = (res?.sorted as any[])?.map((item) => {
      return {
        ...item,
        orderId: item.orderId.toString(),
        price: priceFromOrderId(item?.orderId, 1000000),
        qty: Number(item?.qty) / 1000000000,
      };
    });

    return bids;
  }
  async getAsks() {
    const [asksPda] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("asks", "utf-8"),
        new PublicKey(this.market?.marketPda).toBuffer(),
      ],
      this.program.programId
    );

    const res = await this.program.account.orders.fetch(
      new anchor.web3.PublicKey(asksPda)
    );

    const asks = (res?.sorted as any[])?.map((item) => {
      return {
        ...item,
        orderId: item.orderId.toString(),
        price: priceFromOrderId(item?.orderId, 1000000),
        qty: item.qty.toString(),
      };
    });

    return asks;
  }
  async getWalletPcBalance() {
    return getTokenBalance(
      this.authority.publicKey,
      new PublicKey(this.market.pcMint),
      this.connection
    );
  }

  async getWalletCoinBalance() {
    return getTokenBalance(
      this.authority.publicKey,
      new PublicKey(this.market.coinMint),
      this.connection
    );
  }
}
