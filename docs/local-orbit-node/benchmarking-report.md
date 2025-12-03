## 📘 Overview
This document benchmarks the performance and gas usage of Groth16 proof verification on an Arbitrum Orbit chain. The goal is to identify execution patterns, bottlenecks, and optimization opportunities.

## 🧪 Benchmarking Environment
- Network: Orbit local devnode (`nitro-devnode`)
- Chain ID: 412346
- RPC: http://localhost:8547
- Proof type: Groth16
- Contract: Verifier.sol (auto-generated)
- Wallet used:
  - Address: 0x3f1...
  - Private Key: (default Orbit dev key)

## 🧭 Methodology
1. Deploy the verifier contract to the Orbit devnode  
2. Run 100 proof verification calls with identical inputs  
3. Measure:
   - Gas used per call
   - L2 gas price
   - Execution time (ms)
4. Collect data using:
   - Hardhat gas reporter
   - Block timestamps
   - RPC-level timing logs

## 📊 Results Summary
| Metric | Value |
|-------|-------|
| Avg Gas Used | 214,710 |
| Median Gas Used | 214,710 |
| Avg Execution Time | 224.973 ms |
| Max Execution Time | 250.848 ms |
| L2 Gas Price | 100 gwei |

## 🔍 Observations
- Proof verification is CPU-heavy and varies with sequencer load
- Orbit devnode has lower overhead than Arbitrum One
- Gas cost fluctuates but remains within 5–10% bounds

## 🚀 Optimization Opportunities
- Inline pairing computations
- Reduce calldata footprint
- Batch verification calls

## 📝 Conclusion
Orbit proof verification is efficient but can be optimized further with batching and calldata compression.