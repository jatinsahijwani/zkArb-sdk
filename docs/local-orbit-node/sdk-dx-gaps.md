# Developer Experience Gaps & Orbit SDK Enhancements

## Current Issues
1. RPC inconsistency when switching between Orbit + Ethereum
2. No default Orbit chain config in SDK
3. Gas pricing APIs differ across custom Orbit chains
4. Deployment errors when RPCs aren't replaced

## Proposed Orbit Abstractions
### 1. OrbitChainConfig

```ts
export const ORBIT_LOCAL = {
  chainId: 412346,
  rpcUrl: "http://localhost:8547",
  gasPrice: "auto",
}
```


### 2. Auto RPC Resolver
SDK auto-detects Orbit RPC from .env.orbit.

### 3. Unified Gas Estimator
Orbit requires a custom gas estimator based on Nitro’s internal gas model : 

- Impact
- Simplified onboarding
- Zero manual configuration
- Fewer deployment errors