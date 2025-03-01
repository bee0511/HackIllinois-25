/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/HackIllinois25.json`.
 */
export type HackIllinois25 = {
  "address": "Csf3YvCd81JfpXs42Zko153e99tCp8B2KYmRfYYbaMiP",
  "metadata": {
    "name": "hackIllinois25",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [],
      "args": []
    },
    {
      "name": "mintPet",
      "discriminator": [
        247,
        107,
        206,
        124,
        168,
        131,
        67,
        109
      ],
      "accounts": [
        {
          "name": "pet",
          "writable": true,
          "signer": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "species",
          "type": "string"
        }
      ]
    },
    {
      "name": "updatePet",
      "discriminator": [
        116,
        234,
        195,
        185,
        195,
        165,
        42,
        25
      ],
      "accounts": [
        {
          "name": "pet",
          "writable": true
        },
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "pet"
          ]
        }
      ],
      "args": [
        {
          "name": "experience",
          "type": "u64"
        },
        {
          "name": "hunger",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "pet",
      "discriminator": [
        180,
        195,
        178,
        241,
        61,
        123,
        238,
        32
      ]
    }
  ],
  "types": [
    {
      "name": "pet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "species",
            "type": "string"
          },
          {
            "name": "experience",
            "type": "u64"
          },
          {
            "name": "hunger",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
