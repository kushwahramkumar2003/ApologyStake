/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/apologystake.json`.
 */
export type Apologystake = {
  address: "BEzAB38XypEyvKauzYz6CUKhigu3jgoFSzyLSW5ykUFJ";
  metadata: {
    name: "apologystake";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "claimStake";
      docs: [
        "Allows victim to claim the staked SOL",
        "",
        "Can only be called by the victim after probation period ends.",
        "Represents enforcement of consequences for the offense.",
        "",
        "# Arguments",
        "* `ctx` - Context containing all required accounts",
        "",
        "# Returns",
        "* `Result<()>` - Success or error result",
        "",
        "# Errors",
        "- `InvalidStatus` if apology not active",
        "- `ProbationNotEnded` if called too early",
        "- `UnauthorizedVictim` if caller not victim",
      ];
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
        "Creates a new apology with an optional SOL stake",
        "",
        "# Arguments",
        "* `ctx` - Context containing all required accounts",
        "* `probation_days` - Duration of probation period in days",
        "* `stake_amount` - Amount of SOL to stake (in lamports)",
        "* `message` - The apology message text",
        "* `nonce` - Unique identifier for this apology",
        "* `twitter` - Victim's Twitter handle for public reference",
        "",
        "# Returns",
        "* `Result<()>` - Success or error result",
        "",
        "# Errors",
        "- `InvalidProbationDays` if probation days is zero",
        "- `EmptyMessage` if message is empty",
        "- `InvalidVictim` if offender and victim are same",
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
      ];
    },
    {
      name: "releaseStake";
      docs: [
        "Releases staked SOL back to the offender",
        "",
        "Can only be called by the victim after probation period ends.",
        "Represents forgiveness/acceptance of the apology.",
        "",
        "# Arguments",
        "* `ctx` - Context containing all required accounts",
        "",
        "# Returns",
        "* `Result<()>` - Success or error result",
        "",
        "# Errors",
        "- `InvalidStatus` if apology not active",
        "- `ProbationNotEnded` if called too early",
        "- `UnauthorizedVictim` if caller not victim",
      ];
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
      docs: ["Main account structure storing apology data"];
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
      docs: ["Event emitted when apology is completed"];
      type: {
        kind: "struct";
        fields: [
          {
            name: "apologyId";
            docs: ["Public key of the apology account"];
            type: "pubkey";
          },
          {
            name: "resolution";
            docs: ["How the apology was resolved"];
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
      docs: ["Event emitted when new apology is created"];
      type: {
        kind: "struct";
        fields: [
          {
            name: "apologyId";
            docs: ["Public key of the apology account"];
            type: "pubkey";
          },
          {
            name: "offender";
            docs: ["Public key of the apologizing party"];
            type: "pubkey";
          },
          {
            name: "victim";
            docs: ["Public key of the party receiving apology"];
            type: "pubkey";
          },
          {
            name: "stakeAmount";
            docs: ["Amount of SOL staked in lamports"];
            type: "u64";
          },
          {
            name: "probationDays";
            docs: ["Length of probation in days"];
            type: "u64";
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
      name: "apologyResolution";
      docs: ["How an apology was resolved"];
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
      docs: ["Status of an apology"];
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
