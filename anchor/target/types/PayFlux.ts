/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/PayFlux.json`.
 */
export type PayFlux = {
  "address": "coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF",
  "metadata": {
    "name": "payFlux",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createPayment",
      "discriminator": [
        28,
        81,
        85,
        253,
        7,
        223,
        154,
        42
      ],
      "accounts": [
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "paymentRequest",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  121,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "requestId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "requestId",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "recipientDetails",
          "type": {
            "defined": {
              "name": "recipientDetails"
            }
          }
        }
      ]
    },
    {
      "name": "fulfillPayment",
      "discriminator": [
        91,
        23,
        244,
        253,
        211,
        9,
        32,
        27
      ],
      "accounts": [
        {
          "name": "marketMaker",
          "writable": true,
          "signer": true
        },
        {
          "name": "paymentRequest",
          "writable": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "paymentRequest",
      "discriminator": [
        27,
        20,
        202,
        96,
        101,
        242,
        124,
        69
      ]
    }
  ],
  "events": [
    {
      "name": "paymentCreatedEvent",
      "discriminator": [
        220,
        70,
        132,
        18,
        89,
        46,
        231,
        215
      ]
    },
    {
      "name": "paymentFulfilledEvent",
      "discriminator": [
        14,
        103,
        118,
        121,
        72,
        121,
        245,
        49
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidPaymentStatus",
      "msg": "Invalid payment status for this operation"
    }
  ],
  "types": [
    {
      "name": "paymentCreatedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "requestId",
            "type": "string"
          },
          {
            "name": "sender",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "recipientDetails",
            "type": {
              "defined": {
                "name": "recipientDetails"
              }
            }
          }
        ]
      }
    },
    {
      "name": "paymentFulfilledEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "requestId",
            "type": "string"
          },
          {
            "name": "marketMaker",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "paymentRequest",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sender",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "paymentStatus"
              }
            }
          },
          {
            "name": "marketMaker",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "recipientDetails",
            "type": {
              "defined": {
                "name": "recipientDetails"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "requestId",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "paymentStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "completed"
          }
        ]
      }
    },
    {
      "name": "recipientDetails",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "accountNumber",
            "type": "string"
          },
          {
            "name": "accountName",
            "type": "string"
          },
          {
            "name": "phoneNumber",
            "type": "string"
          }
        ]
      }
    }
  ]
};
