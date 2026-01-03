# 📘 zkArb SDK – CLI Outline

The zkArb CLI provides a set of commands to compile Circom circuits, test them locally, and deploy verifier contracts on-chain.
Each command is designed to abstract away low-level tooling while keeping workflows explicit and developer-friendly.

---

## Command: `compile`

### Usage
```bash
npx zkarb-sdk compile <circomFilePath>
```

### Arguments
- <circomFilePath> — Path to the .circom file you want to compile.

### Description
Compiles a Circom circuit into the necessary intermediate artifacts used for proof generation.

The compilation process generates:
- .r1cs — Constraint system representation of the circuit
- .wasm — WebAssembly file used for witness generation
- .zkey — Proving key required for proof generation

These artifacts are later consumed by the test and deploy commands.

### Example
```bash
npx zkarb-sdk compile circuits/transfer.circom
```
---

## Command: `test`

### Usage
```bash
npx zkarb-sdk test <folder> <inputJson>
```

### Arguments
- <folder> — Path to the compiled circuit folder containing .wasm, .r1cs, and .zkey files
- <inputJson> — Path to an input.json file containing circuit inputs

### Description
Tests a compiled circuit by generating a witness, producing a proof, and deriving the corresponding public inputs.

This command performs the full local proof pipeline and generates:
- proof.json — Generated zk-SNARK proof
- public.json — Public inputs associated with the proof

This step is essential for validating circuit correctness before deployment.

### Example
```bash
npx zkarb-sdk test build/transfer input.json
```

---

## Command: `deploy`

### Usage
```bash
npx zkarb-sdk deploy <folder> <privateKey> [options]
```

### Arguments
- <folder> — Path to the folder containing the compiled circuit and verifier.sol
- <privateKey> — Private key of the deploying account

### Options
- --optimized
  Enables verifier optimization and deploys an optimized wrapper contract.

- --network <network>
  Supported values: one (default), nova, sepolia, orbit

- --rpc <rpcUrl>
  Custom RPC endpoint, primarily used for Orbit chains or local networks.

- --bridge-l1
  Enables cross-chain deployment with L1 ↔ L2 relayer configuration.

### Description
Deploys the generated verifier.sol contract to the specified Arbitrum or Orbit network.

Depending on the flags provided, the command can perform standard, optimized, or cross-chain deployments.
Deployment metadata and contract addresses are recorded for later reference.

### Examples
```bash
npx zkarb-sdk deploy build/transfer 0xPRIVATE_KEY
```

```bash
npx zkarb-sdk deploy build/transfer 0xPRIVATE_KEY --network orbit --rpc http://localhost:8545
```

```bash
npx zkarb-sdk deploy build/transfer 0xPRIVATE_KEY --bridge-l1
```

---

## Command Flow Summary

1. Compile the circuit
```bash
npx zkarb-sdk compile circuit.circom
```

2. Test the circuit locally
```bash
npx zkarb-sdk test build/circuit input.json
```

3. Deploy the verifier on-chain
```bash
npx zkarb-sdk deploy build/circuit 0xPRIVATE_KEY
```

---

← Back to Index (index.md)
