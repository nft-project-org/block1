import { Idl } from "@coral-xyz/anchor"

const idl: Idl = {
  "version": "0.1.0",
  "name": "counter",
  "instructions": [
      {
      "name": "create",
      "accounts": [
          {
          "name": "counter",
          "isMut": true,
          "isSigner": true
          },
          {
          "name": "user",
          "isMut": true,
          "isSigner": true
          },
          {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
          }
      ],
      "args": [
          {
          "name": "authority",
          "type": "publicKey"
          }
      ]
      },
      {
      "name": "increment",
      "accounts": [
          {
          "name": "counter",
          "isMut": true,
          "isSigner": false
          },
          {
          "name": "authority",
          "isMut": false,
          "isSigner": true
          }
      ],
      "args": []
      }
  ],
  "accounts": [
      {
      "name": "Counter",
      "type": {
          "kind": "struct",
          "fields": [
          {
              "name": "authority",
              "type": "publicKey"
          },
          {
              "name": "count",
              "type": "u64"
          }
          ]
      }
      }
  ],
  "metadata": {
      "address": "14D3oAzGJej6TYfmiR6mSJ28vSSxAsNQ2RT8BBnh3XQS"
  }
}

export default idl