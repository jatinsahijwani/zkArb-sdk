# Developer Experience Gaps & Orbit SDK Enhancements

## Current Issues
1. RPC inconsistency when switching between Orbit + Ethereum
2. No default Orbit chain config in SDK
3. Gas pricing APIs differ across custom Orbit chains
4. Deployment errors when RPCs aren't replaced

## Proposed Orbit Abstractions
### 1. OrbitChainConfig

```ts
export const ORBIT_LOCAL = [
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


### 2. Auto RPC Resolver
SDK auto-detects Orbit RPC from .env.orbit.

### 3. Unified Gas Estimator
Orbit requires a custom gas estimator based on Nitro’s internal gas model : 

- Impact
- Simplified onboarding
- Zero manual configuration
- Fewer deployment errors