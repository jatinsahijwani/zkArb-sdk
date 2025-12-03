## Required Modifications
1. Add /configs/orbit.ts to SDK
2. Replace default RPCs with Orbit devnode RPC
3. Implement Orbit gas pricing logic
4. Add support for Orbit L2 calldata pricing
5. Enhance contract deployment module to detect Orbit chain

## Example Config
```ts
export const ORBIT_CONFIG = {
  rpc: "http://localhost:8547",
  chainId: 412346,
  oracleUrl: null,
}
```


Deployment Flow

1. Load Orbit config
2. Compile verifier
3. Deploy using Orbit dev private key
4. Verify transaction via local sequencer logs
5. Notes
6. Orbit uses deterministic sequencer → lower latency.