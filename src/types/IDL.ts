export type FermiDex = {
  "version": "0.1.0",
  "name": "fermi_dex",
  "instructions": [
    {
      "name": "initializeMarket",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "coinVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pcVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "coinMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "bids",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "asks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reqQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "coinLotSize",
          "type": "u64"
        },
        {
          "name": "pcLotSize",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelBid",
      "accounts": [
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bids",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "asks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "orderId",
          "type": "u128"
        },
        {
          "name": "expectedOwner",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "cancelAsk",
      "accounts": [
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bids",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "asks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "orderId",
          "type": "u128"
        },
        {
          "name": "expectedOwner",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "depositPcTokens",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositCoinTokens",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawCoins",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "coinMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "coinVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pcVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawTokens",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "coinMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "coinVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pcVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "newOrder",
      "accounts": [
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "coinVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pcVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "coinMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bids",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "asks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reqQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "limitPrice",
          "type": "u64"
        },
        {
          "name": "maxCoinQty",
          "type": "u64"
        },
        {
          "name": "maxNativePcQty",
          "type": "u64"
        },
        {
          "name": "orderType",
          "type": {
            "defined": "OrderType"
          }
        }
      ]
    },
    {
      "name": "finaliseMatchesBid",
      "accounts": [
        {
          "name": "openOrdersOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "openOrdersCounterparty",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pcVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "coinMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reqQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authoritySecond",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pcpayer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "event1Slot",
          "type": "u8"
        },
        {
          "name": "event2Slot",
          "type": "u8"
        }
      ]
    },
    {
      "name": "finaliseMatchesAsk",
      "docs": [
        "just in time transfers for ask side"
      ],
      "accounts": [
        {
          "name": "openOrdersOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "openOrdersCounterparty",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "coinVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "coinMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reqQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authoritySecond",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "coinpayer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "event1Slot",
          "type": "u8"
        },
        {
          "name": "event2Slot",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "market",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "coinVault",
            "type": "publicKey"
          },
          {
            "name": "pcVault",
            "type": "publicKey"
          },
          {
            "name": "coinMint",
            "type": "publicKey"
          },
          {
            "name": "pcMint",
            "type": "publicKey"
          },
          {
            "name": "coinLotSize",
            "type": "u64"
          },
          {
            "name": "pcLotSize",
            "type": "u64"
          },
          {
            "name": "coinDepositsTotal",
            "type": "u64"
          },
          {
            "name": "pcDepositsTotal",
            "type": "u64"
          },
          {
            "name": "bids",
            "type": "publicKey"
          },
          {
            "name": "asks",
            "type": "publicKey"
          },
          {
            "name": "reqQ",
            "type": "publicKey"
          },
          {
            "name": "eventQ",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "requestQueue",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "header",
            "type": {
              "defined": "RequestQueueHeader"
            }
          }
        ]
      }
    },
    {
      "name": "eventQueue",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "header",
            "type": {
              "defined": "EventQueueHeader"
            }
          },
          {
            "name": "head",
            "type": "u64"
          },
          {
            "name": "buf",
            "type": {
              "array": [
                {
                  "defined": "Event"
                },
                100
              ]
            }
          }
        ]
      }
    },
    {
      "name": "orders",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sorted",
            "type": {
              "vec": {
                "defined": "Order"
              }
            }
          }
        ]
      }
    },
    {
      "name": "openOrders",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "market",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "nativeCoinFree",
            "type": "u64"
          },
          {
            "name": "nativePcFree",
            "type": "u64"
          },
          {
            "name": "nativeCoinTotal",
            "type": "u64"
          },
          {
            "name": "nativePcTotal",
            "type": "u64"
          },
          {
            "name": "freeSlotBits",
            "type": "u8"
          },
          {
            "name": "isBidBits",
            "type": "u8"
          },
          {
            "name": "orders",
            "type": {
              "array": [
                "u128",
                8
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "JitStruct",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "side",
            "type": {
              "defined": "Side"
            }
          },
          {
            "name": "maker",
            "type": "bool"
          },
          {
            "name": "nativeQtyPaid",
            "type": "u64"
          },
          {
            "name": "nativeQtyReceived",
            "type": "u64"
          },
          {
            "name": "orderId",
            "type": "u128"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "ownerSlot",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "RequestQueueHeader",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nextSeqNum",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "Order",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u128"
          },
          {
            "name": "qty",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "ownerSlot",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "EventQueueHeader",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "head",
            "type": "u64"
          },
          {
            "name": "count",
            "type": "u64"
          },
          {
            "name": "seqNum",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "Event",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "eventFlags",
            "type": "u8"
          },
          {
            "name": "ownerSlot",
            "type": "u8"
          },
          {
            "name": "nativeQtyReleased",
            "type": "u64"
          },
          {
            "name": "nativeQtyPaid",
            "type": "u64"
          },
          {
            "name": "orderId",
            "type": "u128"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "finalised",
            "type": "u8"
          },
          {
            "name": "orderIdSecond",
            "type": "u128"
          },
          {
            "name": "timestamp",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "RequestFlag",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NewOrder"
          },
          {
            "name": "CancelOrder"
          },
          {
            "name": "Bid"
          },
          {
            "name": "PostOnly"
          },
          {
            "name": "ImmediateOrCancel"
          },
          {
            "name": "DecrementTakeOnSelfTrade"
          }
        ]
      }
    },
    {
      "name": "EventFlag",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Fill"
          },
          {
            "name": "Out"
          },
          {
            "name": "Bid"
          },
          {
            "name": "Maker"
          },
          {
            "name": "ReleaseFunds"
          },
          {
            "name": "Finalise"
          }
        ]
      }
    },
    {
      "name": "EventView",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Fill",
            "fields": [
              {
                "name": "side",
                "type": {
                  "defined": "Side"
                }
              },
              {
                "name": "maker",
                "type": "bool"
              },
              {
                "name": "native_qty_paid",
                "type": "u64"
              },
              {
                "name": "native_qty_received",
                "type": "u64"
              },
              {
                "name": "order_id",
                "type": "u128"
              },
              {
                "name": "owner",
                "type": "publicKey"
              },
              {
                "name": "owner_slot",
                "type": "u8"
              },
              {
                "name": "finalised",
                "type": "u8"
              },
              {
                "name": "cpty",
                "type": "publicKey"
              },
              {
                "name": "order_id_second",
                "type": "u128"
              }
            ]
          },
          {
            "name": "Out",
            "fields": [
              {
                "name": "side",
                "type": {
                  "defined": "Side"
                }
              },
              {
                "name": "release_funds",
                "type": "bool"
              },
              {
                "name": "native_qty_unlocked",
                "type": "u64"
              },
              {
                "name": "native_qty_still_locked",
                "type": "u64"
              },
              {
                "name": "order_id",
                "type": "u128"
              },
              {
                "name": "owner",
                "type": "publicKey"
              },
              {
                "name": "owner_slot",
                "type": "u8"
              },
              {
                "name": "finalised",
                "type": "u8"
              }
            ]
          },
          {
            "name": "Finalise",
            "fields": [
              {
                "name": "side",
                "type": {
                  "defined": "Side"
                }
              },
              {
                "name": "maker",
                "type": "bool"
              },
              {
                "name": "native_qty_paid",
                "type": "u64"
              },
              {
                "name": "native_qty_received",
                "type": "u64"
              },
              {
                "name": "order_id",
                "type": "u128"
              },
              {
                "name": "owner",
                "type": "publicKey"
              },
              {
                "name": "owner_slot",
                "type": "u8"
              },
              {
                "name": "finalised",
                "type": "u8"
              },
              {
                "name": "cpty",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "RequestView",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NewOrder",
            "fields": [
              {
                "name": "side",
                "type": {
                  "defined": "Side"
                }
              },
              {
                "name": "order_type",
                "type": {
                  "defined": "OrderType"
                }
              },
              {
                "name": "order_id",
                "type": "u128"
              },
              {
                "name": "max_coin_qty",
                "type": "u64"
              },
              {
                "name": "native_pc_qty_locked",
                "type": {
                  "option": "u64"
                }
              },
              {
                "name": "owner_slot",
                "type": "u8"
              },
              {
                "name": "owner",
                "type": "publicKey"
              }
            ]
          },
          {
            "name": "CancelOrder",
            "fields": [
              {
                "name": "side",
                "type": {
                  "defined": "Side"
                }
              },
              {
                "name": "order_id",
                "type": "u128"
              },
              {
                "name": "cancel_id",
                "type": "u64"
              },
              {
                "name": "expected_owner_slot",
                "type": "u8"
              },
              {
                "name": "expected_owner",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "Side",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Bid"
          },
          {
            "name": "Ask"
          }
        ]
      }
    },
    {
      "name": "OrderType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Limit"
          },
          {
            "name": "ImmediateOrCancel"
          },
          {
            "name": "PostOnly"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "WrongPayerMint",
      "msg": "Wrong payer mint"
    },
    {
      "code": 6001,
      "name": "WrongMarket",
      "msg": "Wrong market"
    },
    {
      "code": 6002,
      "name": "WrongAuthority",
      "msg": "Wrong authority"
    },
    {
      "code": 6003,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds"
    },
    {
      "code": 6004,
      "name": "TransferFailed",
      "msg": "Transfer failed"
    },
    {
      "code": 6005,
      "name": "AlreadyInitialized",
      "msg": "Already initialized"
    },
    {
      "code": 6006,
      "name": "QueueAlreadyFull",
      "msg": "Queue already full"
    },
    {
      "code": 6007,
      "name": "EmptyQueue",
      "msg": "Empty queue"
    },
    {
      "code": 6008,
      "name": "TooManyOpenOrders",
      "msg": "Too many open orders"
    },
    {
      "code": 6009,
      "name": "SlotIsNotFree",
      "msg": "Slot is not free"
    },
    {
      "code": 6010,
      "name": "EmptyOrders",
      "msg": "Empty orders"
    },
    {
      "code": 6011,
      "name": "OrdersAlreadyFull",
      "msg": "Orders already full"
    },
    {
      "code": 6012,
      "name": "InvalidPrice",
      "msg": "Invalid price"
    },
    {
      "code": 6013,
      "name": "InvalidLocked",
      "msg": "Insufficient native qty locked"
    },
    {
      "code": 6014,
      "name": "OrderNotFound",
      "msg": "OrderNotFound"
    },
    {
      "code": 6015,
      "name": "InvalidAuthority",
      "msg": "InvalidAuthority"
    },
    {
      "code": 6016,
      "name": "Error",
      "msg": "Error"
    }
  ]
};

export const IDL: FermiDex = {
  "version": "0.1.0",
  "name": "fermi_dex",
  "instructions": [
    {
      "name": "initializeMarket",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "coinVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pcVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "coinMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "bids",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "asks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reqQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "coinLotSize",
          "type": "u64"
        },
        {
          "name": "pcLotSize",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelBid",
      "accounts": [
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bids",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "asks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "orderId",
          "type": "u128"
        },
        {
          "name": "expectedOwner",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "cancelAsk",
      "accounts": [
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bids",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "asks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "orderId",
          "type": "u128"
        },
        {
          "name": "expectedOwner",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "depositPcTokens",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositCoinTokens",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawCoins",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "coinMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "coinVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pcVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawTokens",
      "accounts": [
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "coinMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "coinVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pcVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "newOrder",
      "accounts": [
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "coinVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pcVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "coinMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bids",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "asks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reqQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "limitPrice",
          "type": "u64"
        },
        {
          "name": "maxCoinQty",
          "type": "u64"
        },
        {
          "name": "maxNativePcQty",
          "type": "u64"
        },
        {
          "name": "orderType",
          "type": {
            "defined": "OrderType"
          }
        }
      ]
    },
    {
      "name": "finaliseMatchesBid",
      "accounts": [
        {
          "name": "openOrdersOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "openOrdersCounterparty",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pcVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "coinMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reqQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authoritySecond",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pcpayer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "event1Slot",
          "type": "u8"
        },
        {
          "name": "event2Slot",
          "type": "u8"
        }
      ]
    },
    {
      "name": "finaliseMatchesAsk",
      "docs": [
        "just in time transfers for ask side"
      ],
      "accounts": [
        {
          "name": "openOrdersOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "openOrdersCounterparty",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "coinVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "coinMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reqQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQ",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authoritySecond",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "coinpayer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "event1Slot",
          "type": "u8"
        },
        {
          "name": "event2Slot",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "market",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "coinVault",
            "type": "publicKey"
          },
          {
            "name": "pcVault",
            "type": "publicKey"
          },
          {
            "name": "coinMint",
            "type": "publicKey"
          },
          {
            "name": "pcMint",
            "type": "publicKey"
          },
          {
            "name": "coinLotSize",
            "type": "u64"
          },
          {
            "name": "pcLotSize",
            "type": "u64"
          },
          {
            "name": "coinDepositsTotal",
            "type": "u64"
          },
          {
            "name": "pcDepositsTotal",
            "type": "u64"
          },
          {
            "name": "bids",
            "type": "publicKey"
          },
          {
            "name": "asks",
            "type": "publicKey"
          },
          {
            "name": "reqQ",
            "type": "publicKey"
          },
          {
            "name": "eventQ",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "requestQueue",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "header",
            "type": {
              "defined": "RequestQueueHeader"
            }
          }
        ]
      }
    },
    {
      "name": "eventQueue",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "header",
            "type": {
              "defined": "EventQueueHeader"
            }
          },
          {
            "name": "head",
            "type": "u64"
          },
          {
            "name": "buf",
            "type": {
              "array": [
                {
                  "defined": "Event"
                },
                100
              ]
            }
          }
        ]
      }
    },
    {
      "name": "orders",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sorted",
            "type": {
              "vec": {
                "defined": "Order"
              }
            }
          }
        ]
      }
    },
    {
      "name": "openOrders",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "market",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "nativeCoinFree",
            "type": "u64"
          },
          {
            "name": "nativePcFree",
            "type": "u64"
          },
          {
            "name": "nativeCoinTotal",
            "type": "u64"
          },
          {
            "name": "nativePcTotal",
            "type": "u64"
          },
          {
            "name": "freeSlotBits",
            "type": "u8"
          },
          {
            "name": "isBidBits",
            "type": "u8"
          },
          {
            "name": "orders",
            "type": {
              "array": [
                "u128",
                8
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "JitStruct",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "side",
            "type": {
              "defined": "Side"
            }
          },
          {
            "name": "maker",
            "type": "bool"
          },
          {
            "name": "nativeQtyPaid",
            "type": "u64"
          },
          {
            "name": "nativeQtyReceived",
            "type": "u64"
          },
          {
            "name": "orderId",
            "type": "u128"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "ownerSlot",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "RequestQueueHeader",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nextSeqNum",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "Order",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u128"
          },
          {
            "name": "qty",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "ownerSlot",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "EventQueueHeader",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "head",
            "type": "u64"
          },
          {
            "name": "count",
            "type": "u64"
          },
          {
            "name": "seqNum",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "Event",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "eventFlags",
            "type": "u8"
          },
          {
            "name": "ownerSlot",
            "type": "u8"
          },
          {
            "name": "nativeQtyReleased",
            "type": "u64"
          },
          {
            "name": "nativeQtyPaid",
            "type": "u64"
          },
          {
            "name": "orderId",
            "type": "u128"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "finalised",
            "type": "u8"
          },
          {
            "name": "orderIdSecond",
            "type": "u128"
          },
          {
            "name": "timestamp",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "RequestFlag",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NewOrder"
          },
          {
            "name": "CancelOrder"
          },
          {
            "name": "Bid"
          },
          {
            "name": "PostOnly"
          },
          {
            "name": "ImmediateOrCancel"
          },
          {
            "name": "DecrementTakeOnSelfTrade"
          }
        ]
      }
    },
    {
      "name": "EventFlag",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Fill"
          },
          {
            "name": "Out"
          },
          {
            "name": "Bid"
          },
          {
            "name": "Maker"
          },
          {
            "name": "ReleaseFunds"
          },
          {
            "name": "Finalise"
          }
        ]
      }
    },
    {
      "name": "EventView",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Fill",
            "fields": [
              {
                "name": "side",
                "type": {
                  "defined": "Side"
                }
              },
              {
                "name": "maker",
                "type": "bool"
              },
              {
                "name": "native_qty_paid",
                "type": "u64"
              },
              {
                "name": "native_qty_received",
                "type": "u64"
              },
              {
                "name": "order_id",
                "type": "u128"
              },
              {
                "name": "owner",
                "type": "publicKey"
              },
              {
                "name": "owner_slot",
                "type": "u8"
              },
              {
                "name": "finalised",
                "type": "u8"
              },
              {
                "name": "cpty",
                "type": "publicKey"
              },
              {
                "name": "order_id_second",
                "type": "u128"
              }
            ]
          },
          {
            "name": "Out",
            "fields": [
              {
                "name": "side",
                "type": {
                  "defined": "Side"
                }
              },
              {
                "name": "release_funds",
                "type": "bool"
              },
              {
                "name": "native_qty_unlocked",
                "type": "u64"
              },
              {
                "name": "native_qty_still_locked",
                "type": "u64"
              },
              {
                "name": "order_id",
                "type": "u128"
              },
              {
                "name": "owner",
                "type": "publicKey"
              },
              {
                "name": "owner_slot",
                "type": "u8"
              },
              {
                "name": "finalised",
                "type": "u8"
              }
            ]
          },
          {
            "name": "Finalise",
            "fields": [
              {
                "name": "side",
                "type": {
                  "defined": "Side"
                }
              },
              {
                "name": "maker",
                "type": "bool"
              },
              {
                "name": "native_qty_paid",
                "type": "u64"
              },
              {
                "name": "native_qty_received",
                "type": "u64"
              },
              {
                "name": "order_id",
                "type": "u128"
              },
              {
                "name": "owner",
                "type": "publicKey"
              },
              {
                "name": "owner_slot",
                "type": "u8"
              },
              {
                "name": "finalised",
                "type": "u8"
              },
              {
                "name": "cpty",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "RequestView",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NewOrder",
            "fields": [
              {
                "name": "side",
                "type": {
                  "defined": "Side"
                }
              },
              {
                "name": "order_type",
                "type": {
                  "defined": "OrderType"
                }
              },
              {
                "name": "order_id",
                "type": "u128"
              },
              {
                "name": "max_coin_qty",
                "type": "u64"
              },
              {
                "name": "native_pc_qty_locked",
                "type": {
                  "option": "u64"
                }
              },
              {
                "name": "owner_slot",
                "type": "u8"
              },
              {
                "name": "owner",
                "type": "publicKey"
              }
            ]
          },
          {
            "name": "CancelOrder",
            "fields": [
              {
                "name": "side",
                "type": {
                  "defined": "Side"
                }
              },
              {
                "name": "order_id",
                "type": "u128"
              },
              {
                "name": "cancel_id",
                "type": "u64"
              },
              {
                "name": "expected_owner_slot",
                "type": "u8"
              },
              {
                "name": "expected_owner",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "Side",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Bid"
          },
          {
            "name": "Ask"
          }
        ]
      }
    },
    {
      "name": "OrderType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Limit"
          },
          {
            "name": "ImmediateOrCancel"
          },
          {
            "name": "PostOnly"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "WrongPayerMint",
      "msg": "Wrong payer mint"
    },
    {
      "code": 6001,
      "name": "WrongMarket",
      "msg": "Wrong market"
    },
    {
      "code": 6002,
      "name": "WrongAuthority",
      "msg": "Wrong authority"
    },
    {
      "code": 6003,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds"
    },
    {
      "code": 6004,
      "name": "TransferFailed",
      "msg": "Transfer failed"
    },
    {
      "code": 6005,
      "name": "AlreadyInitialized",
      "msg": "Already initialized"
    },
    {
      "code": 6006,
      "name": "QueueAlreadyFull",
      "msg": "Queue already full"
    },
    {
      "code": 6007,
      "name": "EmptyQueue",
      "msg": "Empty queue"
    },
    {
      "code": 6008,
      "name": "TooManyOpenOrders",
      "msg": "Too many open orders"
    },
    {
      "code": 6009,
      "name": "SlotIsNotFree",
      "msg": "Slot is not free"
    },
    {
      "code": 6010,
      "name": "EmptyOrders",
      "msg": "Empty orders"
    },
    {
      "code": 6011,
      "name": "OrdersAlreadyFull",
      "msg": "Orders already full"
    },
    {
      "code": 6012,
      "name": "InvalidPrice",
      "msg": "Invalid price"
    },
    {
      "code": 6013,
      "name": "InvalidLocked",
      "msg": "Insufficient native qty locked"
    },
    {
      "code": 6014,
      "name": "OrderNotFound",
      "msg": "OrderNotFound"
    },
    {
      "code": 6015,
      "name": "InvalidAuthority",
      "msg": "InvalidAuthority"
    },
    {
      "code": 6016,
      "name": "Error",
      "msg": "Error"
    }
  ]
};
