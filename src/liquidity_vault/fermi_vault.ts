export type FermiVault = {
  version: "0.1.0";
  name: "fermi_vault";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "vaultState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["The mint of the token for which we are creating this vault."];
        },
        {
          name: "vaultAuthority";
          isMut: false;
          isSigner: false;
          docs: [
            "The PDA that will be the authority for the vault token account"
          ];
        },
        {
          name: "vaultTokenAccount";
          isMut: true;
          isSigner: false;
          docs: ["The vault token account (PDA-owned)"];
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "whitelistedProgram";
          type: "publicKey";
        }
      ];
    },
    {
      name: "deposit";
      accounts: [
        {
          name: "vaultState";
          isMut: true;
          isSigner: false;
          docs: ["The vault state holding info about the vault."];
        },
        {
          name: "userState";
          isMut: true;
          isSigner: false;
          docs: ["The user’s personal vault state for tracking deposits"];
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userTokenAccount";
          isMut: true;
          isSigner: false;
          docs: ["The user’s token account from which we’ll transfer tokens"];
        },
        {
          name: "vaultTokenAccount";
          isMut: true;
          isSigner: false;
          docs: ["The PDA-owned vault token account into which we deposit"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "user";
          type: "publicKey";
        },
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "withdraw";
      accounts: [
        {
          name: "vaultState";
          isMut: true;
          isSigner: false;
          docs: ["The vault state"];
        },
        {
          name: "userState";
          isMut: true;
          isSigner: false;
          docs: ["The user’s personal state from which we deduct tokens"];
        },
        {
          name: "vaultAuthority";
          isMut: false;
          isSigner: false;
          docs: [
            "The PDA that signs on behalf of the vault for the token transfer"
          ];
        },
        {
          name: "vaultTokenAccount";
          isMut: true;
          isSigner: false;
          docs: ["The vault’s token account from which the tokens are taken"];
        },
        {
          name: "recipientTokenAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "The token account of the recipient (provided by the whitelisted program)"
          ];
        },
        {
          name: "caller";
          isMut: false;
          isSigner: false;
          docs: [
            "The caller must match the whitelisted program stored in vault_state"
          ];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "user";
          type: "publicKey";
        },
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "takeTokens";
      accounts: [
        {
          name: "vaultState";
          isMut: true;
          isSigner: false;
          docs: ["The vault state"];
        },
        {
          name: "userState";
          isMut: true;
          isSigner: false;
          docs: ["The user’s personal state from which we deduct tokens"];
        },
        {
          name: "vaultAuthority";
          isMut: false;
          isSigner: false;
          docs: [
            "The PDA that signs on behalf of the vault for the token transfer"
          ];
        },
        {
          name: "vaultTokenAccount";
          isMut: true;
          isSigner: false;
          docs: ["The vault’s token account from which the tokens are taken"];
        },
        {
          name: "recipientTokenAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "The token account of the recipient (provided by the whitelisted program)"
          ];
        },
        {
          name: "caller";
          isMut: false;
          isSigner: false;
          docs: [
            "The caller must match the whitelisted program stored in vault_state"
          ];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "user";
          type: "publicKey";
        },
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "vaultState";
      type: {
        kind: "struct";
        fields: [
          {
            name: "tokenMint";
            type: "publicKey";
          },
          {
            name: "vaultAuthorityBump";
            type: "u8";
          },
          {
            name: "vaultTokenAccountBump";
            type: "u8";
          },
          {
            name: "whitelistedProgram";
            type: "publicKey";
          }
        ];
      };
    },
    {
      name: "userState";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "vault";
            type: "publicKey";
          },
          {
            name: "amountDeposited";
            type: "u64";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "NumericalOverflow";
      msg: "Numerical overflow.";
    },
    {
      code: 6001;
      name: "InvalidWhitelistedProgram";
      msg: "Caller is not the whitelisted program.";
    },
    {
      code: 6002;
      name: "UserMismatch";
      msg: "User account mismatch.";
    },
    {
      code: 6003;
      name: "InsufficientFunds";
      msg: "Insufficient funds in user deposit.";
    },
    {
      code: 6004;
      name: "InvalidWhitelistedAddress";
      msg: "Invalid whitelisted address provided.";
    },
    {
      code: 6005;
      name: "ApprovalFailed";
      msg: "Approval failed.";
    }
  ];
};

export const IDL: FermiVault = {
  version: "0.1.0",
  name: "fermi_vault",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "vaultState",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["The mint of the token for which we are creating this vault."],
        },
        {
          name: "vaultAuthority",
          isMut: false,
          isSigner: false,
          docs: [
            "The PDA that will be the authority for the vault token account",
          ],
        },
        {
          name: "vaultTokenAccount",
          isMut: true,
          isSigner: false,
          docs: ["The vault token account (PDA-owned)"],
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "whitelistedProgram",
          type: "publicKey",
        },
      ],
    },
    {
      name: "deposit",
      accounts: [
        {
          name: "vaultState",
          isMut: true,
          isSigner: false,
          docs: ["The vault state holding info about the vault."],
        },
        {
          name: "userState",
          isMut: true,
          isSigner: false,
          docs: ["The user’s personal vault state for tracking deposits"],
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userTokenAccount",
          isMut: true,
          isSigner: false,
          docs: ["The user’s token account from which we’ll transfer tokens"],
        },
        {
          name: "vaultTokenAccount",
          isMut: true,
          isSigner: false,
          docs: ["The PDA-owned vault token account into which we deposit"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "user",
          type: "publicKey",
        },
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "withdraw",
      accounts: [
        {
          name: "vaultState",
          isMut: true,
          isSigner: false,
          docs: ["The vault state"],
        },
        {
          name: "userState",
          isMut: true,
          isSigner: false,
          docs: ["The user’s personal state from which we deduct tokens"],
        },
        {
          name: "vaultAuthority",
          isMut: false,
          isSigner: false,
          docs: [
            "The PDA that signs on behalf of the vault for the token transfer",
          ],
        },
        {
          name: "vaultTokenAccount",
          isMut: true,
          isSigner: false,
          docs: ["The vault’s token account from which the tokens are taken"],
        },
        {
          name: "recipientTokenAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "The token account of the recipient (provided by the whitelisted program)",
          ],
        },
        {
          name: "caller",
          isMut: false,
          isSigner: false,
          docs: [
            "The caller must match the whitelisted program stored in vault_state",
          ],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "user",
          type: "publicKey",
        },
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "takeTokens",
      accounts: [
        {
          name: "vaultState",
          isMut: true,
          isSigner: false,
          docs: ["The vault state"],
        },
        {
          name: "userState",
          isMut: true,
          isSigner: false,
          docs: ["The user’s personal state from which we deduct tokens"],
        },
        {
          name: "vaultAuthority",
          isMut: false,
          isSigner: false,
          docs: [
            "The PDA that signs on behalf of the vault for the token transfer",
          ],
        },
        {
          name: "vaultTokenAccount",
          isMut: true,
          isSigner: false,
          docs: ["The vault’s token account from which the tokens are taken"],
        },
        {
          name: "recipientTokenAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "The token account of the recipient (provided by the whitelisted program)",
          ],
        },
        {
          name: "caller",
          isMut: false,
          isSigner: false,
          docs: [
            "The caller must match the whitelisted program stored in vault_state",
          ],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "user",
          type: "publicKey",
        },
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "vaultState",
      type: {
        kind: "struct",
        fields: [
          {
            name: "tokenMint",
            type: "publicKey",
          },
          {
            name: "vaultAuthorityBump",
            type: "u8",
          },
          {
            name: "vaultTokenAccountBump",
            type: "u8",
          },
          {
            name: "whitelistedProgram",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "userState",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "vault",
            type: "publicKey",
          },
          {
            name: "amountDeposited",
            type: "u64",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "NumericalOverflow",
      msg: "Numerical overflow.",
    },
    {
      code: 6001,
      name: "InvalidWhitelistedProgram",
      msg: "Caller is not the whitelisted program.",
    },
    {
      code: 6002,
      name: "UserMismatch",
      msg: "User account mismatch.",
    },
    {
      code: 6003,
      name: "InsufficientFunds",
      msg: "Insufficient funds in user deposit.",
    },
    {
      code: 6004,
      name: "InvalidWhitelistedAddress",
      msg: "Invalid whitelisted address provided.",
    },
    {
      code: 6005,
      name: "ApprovalFailed",
      msg: "Approval failed.",
    },
  ],
};
