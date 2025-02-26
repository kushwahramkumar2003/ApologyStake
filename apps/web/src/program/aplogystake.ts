/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/apologystake.json`.
 */
export type Apologystake = {
  address: "6W2YxRyMJoDEWWRsTmh8KdkAuz4AahY2WLMXh3ZEigBf";
  metadata: {
    name: "apologystake";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "claimStake";
      docs: ["Allows victim to claim the staked SOL."];
      discriminator: [62, 145, 133, 242, 244, 59, 53, 139];
      accounts: [
        {
          name: "apology";
          docs: ["The apology account containing stake details"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [97, 112, 111, 108, 111, 103, 121];
              },
              {
                kind: "account";
                path: "apology.offender";
                account: "apology";
              },
              {
                kind: "account";
                path: "apology.victim";
                account: "apology";
              },
              {
                kind: "account";
                path: "apology.nonce";
                account: "apology";
              },
            ];
          };
        },
        {
          name: "victim";
          docs: ["The victim must sign to claim stake"];
          writable: true;
          signer: true;
        },
        {
          name: "vault";
          docs: ["Vault holding the staked SOL"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "apology";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          docs: ["Required for transfer operations"];
          address: "11111111111111111111111111111111";
        },
      ];
      args: [];
    },
    {
      name: "initializeApology";
      docs: [
        "Creates a new apology with an optional SOL stake and mints an NFT as proof.",
      ];
      discriminator: [103, 23, 194, 31, 215, 134, 15, 230];
      accounts: [
        {
          name: "apology";
          docs: [
            "The apology account to be created",
            "PDA derived from offender, victim, and nonce",
          ];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [97, 112, 111, 108, 111, 103, 121];
              },
              {
                kind: "account";
                path: "offender";
              },
              {
                kind: "account";
                path: "victim";
              },
              {
                kind: "arg";
                path: "nonce";
              },
            ];
          };
        },
        {
          name: "offender";
          docs: [
            "The account making the apology and paying for account creation",
          ];
          writable: true;
          signer: true;
        },
        {
          name: "victim";
          docs: ["The account receiving the apology"];
        },
        {
          name: "vault";
          docs: ["Vault account to hold staked SOL"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "apology";
              },
            ];
          };
        },
        {
          name: "nftMint";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [97, 112, 111, 108, 111, 103, 121, 95, 110, 102, 116];
              },
              {
                kind: "account";
                path: "apology";
              },
            ];
          };
        },
        {
          name: "nftTokenAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "victim";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: "account";
                path: "nftMint";
              },
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "metadataProgram";
          address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
        },
        {
          name: "masterEditionAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 101, 116, 97, 100, 97, 116, 97];
              },
              {
                kind: "account";
                path: "metadataProgram";
              },
              {
                kind: "account";
                path: "nftMint";
              },
              {
                kind: "const";
                value: [101, 100, 105, 116, 105, 111, 110];
              },
            ];
            program: {
              kind: "account";
              path: "metadataProgram";
            };
          };
        },
        {
          name: "nftMetadata";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 101, 116, 97, 100, 97, 116, 97];
              },
              {
                kind: "account";
                path: "metadataProgram";
              },
              {
                kind: "account";
                path: "nftMint";
              },
            ];
            program: {
              kind: "account";
              path: "metadataProgram";
            };
          };
        },
        {
          name: "systemProgram";
          docs: ["Required for system operations"];
          address: "11111111111111111111111111111111";
        },
        {
          name: "rent";
          docs: ["Required for rent calculations"];
          address: "SysvarRent111111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "probationDays";
          type: "u64";
        },
        {
          name: "stakeAmount";
          type: "u64";
        },
        {
          name: "message";
          type: "string";
        },
        {
          name: "nonce";
          type: "i64";
        },
        {
          name: "twitter";
          type: "string";
        },
        {
          name: "nftUri";
          type: "string";
        },
      ];
    },
    {
      name: "releaseStake";
      docs: ["Releases staked SOL back to the offender."];
      discriminator: [51, 5, 28, 250, 185, 168, 18, 53];
      accounts: [
        {
          name: "apology";
          docs: ["The apology account containing stake details"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [97, 112, 111, 108, 111, 103, 121];
              },
              {
                kind: "account";
                path: "apology.offender";
                account: "apology";
              },
              {
                kind: "account";
                path: "apology.victim";
                account: "apology";
              },
              {
                kind: "account";
                path: "apology.nonce";
                account: "apology";
              },
            ];
          };
        },
        {
          name: "offender";
          docs: ["The original offender's account to receive returned stake"];
          writable: true;
        },
        {
          name: "victim";
          docs: ["The victim must sign to release stake"];
          writable: true;
          signer: true;
        },
        {
          name: "vault";
          docs: ["Vault holding the staked SOL"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "apology";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          docs: ["Required for transfer operations"];
          address: "11111111111111111111111111111111";
        },
      ];
      args: [];
    },
  ];
  accounts: [
    {
      name: "apology";
      discriminator: [120, 59, 73, 25, 117, 226, 255, 185];
    },
  ];
  events: [
    {
      name: "apologyCompleted";
      discriminator: [94, 127, 159, 191, 163, 133, 30, 133];
    },
    {
      name: "apologyCreated";
      discriminator: [45, 133, 182, 125, 86, 88, 252, 100];
    },
  ];
  errors: [
    {
      code: 6000;
      name: "invalidStatus";
      msg: "Apology is not in the correct status";
    },
    {
      code: 6001;
      name: "probationNotEnded";
      msg: "Probation period has not ended";
    },
    {
      code: 6002;
      name: "unauthorizedVictim";
      msg: "Only the victim can perform this action";
    },
    {
      code: 6003;
      name: "invalidProbationDays";
      msg: "Probation days must be greater than zero";
    },
    {
      code: 6004;
      name: "emptyMessage";
      msg: "Message cannot be empty";
    },
    {
      code: 6005;
      name: "invalidVictim";
      msg: "Cannot apologize to self";
    },
    {
      code: 6006;
      name: "insufficientFunds";
      msg: "Insufficient funds to stake";
    },
    {
      code: 6007;
      name: "invalidStakeAmount";
      msg: "Stake amount must be greater than 0";
    },
  ];
  types: [
    {
      name: "apology";
      docs: ["Main account structure storing apology data."];
      type: {
        kind: "struct";
        fields: [
          {
            name: "offender";
            docs: ["Public key of the apologizing party"];
            type: "pubkey";
          },
          {
            name: "victim";
            docs: ["Public key of the party receiving the apology"];
            type: "pubkey";
          },
          {
            name: "nonce";
            docs: ["Unique identifier for this apology"];
            type: "i64";
          },
          {
            name: "stakeAmount";
            docs: ["Amount of SOL staked in lamports"];
            type: "u64";
          },
          {
            name: "probationEnd";
            docs: ["Unix timestamp when probation period ends"];
            type: "i64";
          },
          {
            name: "createdAt";
            docs: ["Unix timestamp when apology was created"];
            type: "i64";
          },
          {
            name: "status";
            docs: ["Current status of the apology"];
            type: {
              defined: {
                name: "apologyStatus";
              };
            };
          },
          {
            name: "message";
            docs: ["The apology message text"];
            type: "string";
          },
          {
            name: "twitter";
            docs: ["Victim's Twitter handle"];
            type: "string";
          },
        ];
      };
    },
    {
      name: "apologyCompleted";
      docs: ["Event emitted when apology is completed."];
      type: {
        kind: "struct";
        fields: [
          {
            name: "apologyId";
            docs: ["Public key of the apology account."];
            type: "pubkey";
          },
          {
            name: "resolution";
            docs: ["How the apology was resolved."];
            type: {
              defined: {
                name: "apologyResolution";
              };
            };
          },
        ];
      };
    },
    {
      name: "apologyCreated";
      docs: ["Event emitted when new apology is created."];
      type: {
        kind: "struct";
        fields: [
          {
            name: "apologyId";
            docs: ["Public key of the apology account."];
            type: "pubkey";
          },
          {
            name: "offender";
            docs: ["Public key of the apologizing party."];
            type: "pubkey";
          },
          {
            name: "victim";
            docs: ["Public key of the party receiving apology."];
            type: "pubkey";
          },
          {
            name: "stakeAmount";
            docs: ["Amount of SOL staked in lamports."];
            type: "u64";
          },
          {
            name: "probationDays";
            docs: ["Length of probation in days."];
            type: "u64";
          },
          {
            name: "twitter";
            docs: ["Victim's Twitter handle."];
            type: "string";
          },
        ];
      };
    },
    {
      name: "apologyResolution";
      docs: ["How an apology was resolved."];
      type: {
        kind: "enum";
        variants: [
          {
            name: "released";
          },
          {
            name: "claimed";
          },
        ];
      };
    },
    {
      name: "apologyStatus";
      docs: ["Status of an apology."];
      type: {
        kind: "enum";
        variants: [
          {
            name: "active";
          },
          {
            name: "completed";
          },
        ];
      };
    },
  ];
};
