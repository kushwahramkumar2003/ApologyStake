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
      discriminator: [62, 145, 133, 242, 244, 59, 53, 139];
      accounts: [
        {
          name: "apology";
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
          writable: true;
          signer: true;
        },
        {
          name: "vault";
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
          address: "11111111111111111111111111111111";
        },
      ];
      args: [];
    },
    {
      name: "initializeApology";
      discriminator: [103, 23, 194, 31, 215, 134, 15, 230];
      accounts: [
        {
          name: "apology";
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
          writable: true;
          signer: true;
        },
        {
          name: "victim";
        },
        {
          name: "vault";
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
          address: "11111111111111111111111111111111";
        },
        {
          name: "rent";
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
      discriminator: [51, 5, 28, 250, 185, 168, 18, 53];
      accounts: [
        {
          name: "apology";
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
          writable: true;
        },
        {
          name: "victim";
          writable: true;
          signer: true;
        },
        {
          name: "vault";
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
  ];
  types: [
    {
      name: "apology";
      type: {
        kind: "struct";
        fields: [
          {
            name: "offender";
            type: "pubkey";
          },
          {
            name: "victim";
            type: "pubkey";
          },
          {
            name: "nonce";
            type: "i64";
          },
          {
            name: "stakeAmount";
            type: "u64";
          },
          {
            name: "probationEnd";
            type: "i64";
          },
          {
            name: "createdAt";
            type: "i64";
          },
          {
            name: "status";
            type: {
              defined: {
                name: "apologyStatus";
              };
            };
          },
          {
            name: "message";
            type: "string";
          },
          {
            name: "twitter";
            type: "string";
          },
        ];
      };
    },
    {
      name: "apologyCompleted";
      type: {
        kind: "struct";
        fields: [
          {
            name: "apologyId";
            type: "pubkey";
          },
          {
            name: "resolution";
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
      type: {
        kind: "struct";
        fields: [
          {
            name: "apologyId";
            type: "pubkey";
          },
          {
            name: "offender";
            type: "pubkey";
          },
          {
            name: "victim";
            type: "pubkey";
          },
          {
            name: "stakeAmount";
            type: "u64";
          },
          {
            name: "probationDays";
            type: "u64";
          },
          {
            name: "twitter";
            type: "string";
          },
        ];
      };
    },
    {
      name: "apologyResolution";
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
