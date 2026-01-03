## 📁 Examples Directory

The `examples` folder located in the root of this repository contains a collection of fully deployed verifier examples.

Each example includes:
- Generated circuit artifacts (`.wasm`, `.zkey`, `verifier.sol`)
- Deployment outputs and metadata
- Configuration files used during deployment
- Reference implementations demonstrating how the SDK is used end-to-end

You can explore these examples to understand:
- How circuits are structured
- How deployments are performed using the SDK
- How contract artifacts, proof generation, and verification come together

This directory serves as a practical guide for developers integrating the **zkarb-sdk** into real projects.


### 📁 Examples Overview

The following example folders are present at the root-level `examples/` directory:

#### 1. `ageCheck`
This example demonstrates a simple age verification circuit where a prover can prove that they satisfy an age condition without revealing the actual age.

**Contents include:**
- Circuit artifacts (`.r1cs`, `.wasm`)
- Solidity verifier contract (`verifier.sol`)
- Proving and verification keys
- Auxiliary files generated during compilation
- **`deployment.json`** containing addresses of all deployed contracts related to this example

📄 **Deployment Details:**  
➡️ [View ageCheck deployments](../examples/ageCheck/deployment.json)

---

#### 2. `hash`
This example showcases hashing inside a zero-knowledge circuit and demonstrates how hash-based constraints can be verified on-chain using the generated verifier.

**Contents include:**
- Circuit definition and compiled artifacts
- `.wasm` and `.r1cs` files
- Solidity verifier contract
- Supporting proving system files
- **`deployment.json`** containing deployed contract addresses for this example

📄 **Deployment Details:**  
➡️ [View hash deployments](../examples/hash/deployment.json)

---

#### 3. `multiplier`
This example focuses on arithmetic constraints by proving correct multiplication within a zero-knowledge circuit and verifying it on-chain.

**Contents include:**
- Compiled circuit artifacts
- `.wasm`, `.r1cs`, and proving keys
- Solidity verifier contract
- Supporting build outputs
- **`deployment.json`** containing contract deployment information

📄 **Deployment Details:**  
➡️ [View multiplier deployments](../examples/multiplier/deployment.json)

---

### 📌 Common Structure Across Examples

All example directories follow a consistent structure and include:

- Compiled circuit artifacts (`.r1cs`, `.wasm`)
- Solidity verifier contract (`verifier.sol`)
- Supporting proving system files
- A **`deployment.json`** file that records:
  - Deployed verifier contract addresses
  - Network information (if applicable)
  - Any auxiliary deployment metadata

These deployment files act as the **single source of truth** for verifying on-chain deployments corresponding to each example.

---

### 🔙 Back to Documentation Index

← **[Go back to Index](index.md)**

