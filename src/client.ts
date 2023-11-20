// Implement a client architechture for the sdk
import { Program } from "@project-serum/anchor";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { FermiDex } from "./types";
import getFermiDexProgram from "./utils/getFermiDexProgram";
import {
  cancelAskIx,
  cancelBidIx,
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
  private authority: Keypair;

  constructor({ market, connection, authority }: FermiClientParams) {
    this.authority = authority;
    this.program = getFermiDexProgram(authority, connection);
    const _market = {
      marketPda: new PublicKey(market.marketPda),
      coinMint: new PublicKey(market.coinMint),
      pcMint: new PublicKey(market.pcMint),
    };
    this.market = _market;
  }

  setCurrentMarket(market: FermiClientParams["market"]) {
    const _market = {
      marketPda: new PublicKey(market.marketPda),
      coinMint: new PublicKey(market.coinMint),
      pcMint: new PublicKey(market.pcMint),
    };
    this.market = _market;
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
  async finaliseAskOrder(orderId: string, authoritySecond: Keypair) {
    return finaliseAskIx({
      program: this.program,
      authority: this.authority,
      authoritySecond,
      coinMint: this.market.coinMint,
      pcMint: this.market.pcMint,
      eventSlot1: 1,
      eventSlot2: 2,
      marketPda: this.market.marketPda,
      openOrdersCounterpartyPda: new PublicKey("TBA"),
      openOrdersOwnerPda: new PublicKey("TBA"),
    });
  }
  async finaliseBidOrder(orderId: string, authoritySecond: Keypair) {
    return finaliseBidIx({
      program: this.program,
      authority: this.authority,
      authoritySecond,
      coinMint: this.market.coinMint,
      pcMint: this.market.pcMint,
      eventSlot1: 1,
      eventSlot2: 2,
      marketPda: this.market.marketPda,
      openOrdersCounterpartyPda: new PublicKey("TBA"),
      openOrdersOwnerPda: new PublicKey("TBA"),
    });
  }

  async getOpenOrders() {
    return fetchOpenOrdersAccount(
      this.authority,
      this.program,
      this.market.marketPda
    );
  }
  async getFinalisableOrderMatches() {
    const { orders } = await this.getOpenOrders();
    const eventQ = await this.getEventQueue();
    const matchedOrders = findMatchingEvents(orders, eventQ);
    return matchedOrders.entries();
  }
  // Market specific
  async getEventQueue() {
    return getParsedEventQ({
      authority: this.authority,
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
        qty: Number(item?.qty) / 1000000000,
      };
    });
    return asks;
  }
}
