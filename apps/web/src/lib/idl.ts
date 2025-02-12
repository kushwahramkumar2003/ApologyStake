export const IDL = {
  address: "6W2YxRyMJoDEWWRsTmh8KdkAuz4AahY2WLMXh3ZEigBf",
  metadata: {
    name: "apologystake",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "claim_stake",
      discriminator: [62, 145, 133, 242, 244, 59, 53, 139],
      accounts: [
        {
          name: "apology",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [97, 112, 111, 108, 111, 103, 121],
              },
              {
                kind: "account",
                path: "apology.offender",
                account: "Apology",
              },
              {
                kind: "account",
                path: "apology.victim",
                account: "Apology",
              },
            ],
          },
        },
        {
          name: "victim",
          writable: true,
          signer: true,
        },
        {
          name: "vault",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [118, 97, 117, 108, 116],
              },
              {
                kind: "account",
                path: "apology",
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [],
    },
    {
      name: "initialize_apology",
      discriminator: [103, 23, 194, 31, 215, 134, 15, 230],
      accounts: [
        {
          name: "apology",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [97, 112, 111, 108, 111, 103, 121],
              },
              {
                kind: "account",
                path: "offender",
              },
              {
                kind: "account",
                path: "victim",
              },
              {
                kind: "arg",
                path: "nonce",
              },
            ],
          },
        },
        {
          name: "offender",
          writable: true,
          signer: true,
        },
        {
          name: "victim",
        },
        {
          name: "vault",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [118, 97, 117, 108, 116],
              },
              {
                kind: "account",
                path: "apology",
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
        {
          name: "rent",
          address: "SysvarRent111111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "probation_days",
          type: "u64",
        },
        {
          name: "stake_amount",
          type: "u64",
        },
        {
          name: "message",
          type: "string",
        },
        {
          name: "nonce",
          type: "i64",
        },
        {
          name: "twitter",
          type: "string",
        },
      ],
    },
    {
      name: "release_stake",
      discriminator: [51, 5, 28, 250, 185, 168, 18, 53],
      accounts: [
        {
          name: "apology",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [97, 112, 111, 108, 111, 103, 121],
              },
              {
                kind: "account",
                path: "apology.offender",
                account: "Apology",
              },
              {
                kind: "account",
                path: "apology.victim",
                account: "Apology",
              },
            ],
          },
        },
        {
          name: "offender",
          writable: true,
        },
        {
          name: "victim",
          writable: true,
          signer: true,
        },
        {
          name: "vault",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [118, 97, 117, 108, 116],
              },
              {
                kind: "account",
                path: "apology",
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "Apology",
      discriminator: [120, 59, 73, 25, 117, 226, 255, 185],
    },
  ],
  events: [
    {
      name: "ApologyCompleted",
      discriminator: [94, 127, 159, 191, 163, 133, 30, 133],
    },
    {
      name: "ApologyCreated",
      discriminator: [45, 133, 182, 125, 86, 88, 252, 100],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidStatus",
      msg: "Apology is not in the correct status",
    },
    {
      code: 6001,
      name: "ProbationNotEnded",
      msg: "Probation period has not ended",
    },
    {
      code: 6002,
      name: "UnauthorizedVictim",
      msg: "Only the victim can perform this action",
    },
    {
      code: 6003,
      name: "InvalidProbationDays",
      msg: "Probation days must be greater than zero",
    },
    {
      code: 6004,
      name: "EmptyMessage",
      msg: "Message cannot be empty",
    },
    {
      code: 6005,
      name: "InvalidVictim",
      msg: "Cannot apologize to self",
    },
  ],
  types: [
    {
      name: "Apology",
      type: {
        kind: "struct",
        fields: [
          {
            name: "offender",
            type: "pubkey",
          },
          {
            name: "victim",
            type: "pubkey",
          },
          {
            name: "nonce",
            type: "i64",
          },
          {
            name: "stake_amount",
            type: "u64",
          },
          {
            name: "probation_end",
            type: "i64",
          },
          {
            name: "created_at",
            type: "i64",
          },
          {
            name: "status",
            type: {
              defined: {
                name: "ApologyStatus",
              },
            },
          },
          {
            name: "message",
            type: "string",
          },
          {
            name: "twitter",
            type: "string",
          },
        ],
      },
    },
    {
      name: "ApologyCompleted",
      type: {
        kind: "struct",
        fields: [
          {
            name: "apology_id",
            type: "pubkey",
          },
          {
            name: "resolution",
            type: {
              defined: {
                name: "ApologyResolution",
              },
            },
          },
        ],
      },
    },
    {
      name: "ApologyCreated",
      type: {
        kind: "struct",
        fields: [
          {
            name: "apology_id",
            type: "pubkey",
          },
          {
            name: "offender",
            type: "pubkey",
          },
          {
            name: "victim",
            type: "pubkey",
          },
          {
            name: "stake_amount",
            type: "u64",
          },
          {
            name: "probation_days",
            type: "u64",
          },
          {
            name: "twitter",
            type: "string",
          },
        ],
      },
    },
    {
      name: "ApologyResolution",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Released",
          },
          {
            name: "Claimed",
          },
        ],
      },
    },
    {
      name: "ApologyStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Active",
          },
          {
            name: "Completed",
          },
        ],
      },
    },
  ],
} as const;
