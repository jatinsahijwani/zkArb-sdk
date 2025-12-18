## Required Modifications
1. Add /configs/orbit.ts to SDK
2. Replace default RPCs with Orbit devnode RPC
3. Implement Orbit gas pricing logic
4. Add support for Orbit L2 calldata pricing
5. Enhance contract deployment module to detect Orbit chain

## Example Config
```ts
export const ORBIT_CONFIG = [
  {
    "chain-name": "orbit-dev-test",
    "parent-chain-id": 412346,
    "parent-chain-is-arbitrum": true,
    "sequencer-url": "",
    "secondary-forwarding-target": "",
    "feed-url": "",
    "secondary-feed-url": "",
    "das-index-url": "",
    "has-genesis-state": false,
    "chain-config": {
      "chainId": 333333,
      "homesteadBlock": 0,
      "daoForkSupport": true,
      "eip150Block": 0,
      "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "eip155Block": 0,
      "eip158Block": 0,
      "byzantiumBlock": 0,
      "constantinopleBlock": 0,
      "petersburgBlock": 0,
      "istanbulBlock": 0,
      "muirGlacierBlock": 0,
      "berlinBlock": 0,
      "londonBlock": 0,
      "clique": {
        "period": 0,
        "epoch": 0
      },
      "arbitrum": {
        "EnableArbOS": true,
        "AllowDebugPrecompiles": true,
        "DataAvailabilityCommittee": false,
        "InitialArbOSVersion": 40,
        "InitialChainOwner": "0x863c904166E801527125D8672442D736194A3362",
        "GenesisBlockNum": 0
      }
    },
    "rollup": {
      "bridge": "0x5e15041D6A3bD1f40C36C19491238E71C5e66036",
      "inbox": "0xcc91DdB73509D5ceFc98C239baAA52dc80453896",
      "sequencer-inbox": "0x2a8ed8a36B6B29c024a29Cd1640E4398e62407c5",
      "deployed-at": 76,
      "rollup": "0x1C4e97B99e18F4d64D2Aa42E212cE270000f40C5",
      "native-token": "0x0000000000000000000000000000000000000000",
      "upgrade-executor": "0xCEAfaf2E637ed66632e5a6A7b8Af89291417c5F8",
      "validator-wallet-creator": "0xA84618C3f9d5A924E8CDCEb74bf408ddDfa736a2",
      "stake-token": "0xF5fE98ee962e3E077A75FBe6fE8aBaeF80F3c12d"
    }
  }
]
```


Deployment Flow

1. Load Orbit config
2. Compile verifier
3. Deploy using Orbit dev private key
4. Verify transaction via local sequencer logs
5. Notes
6. Orbit uses deterministic sequencer → lower latency.