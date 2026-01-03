# Build Artifacts and Trusted Setup Files

This document provides an overview of the build artifacts and trusted setup files used in the **zkArb-sdk** for zero-knowledge proof generation and verification.

---

## 🧩 Overview

When working with zk-SNARKs (specifically Groth16) and Circom circuits, several build artifacts are generated during the compilation and setup process.  
These files are essential for creating proofs, verifying them, and deploying verifiers on-chain.

---

## 📁 Circom Build Files

The Circom compiler (`circom`) generates a set of build files when you compile a `.circom` circuit.  
These files represent the mathematical and executable forms of your circuit.

| File Type | Description |
|------------|--------------|
| **.r1cs** | *Rank-1 Constraint System* — Represents the compiled arithmetic constraints of your circuit. This is the core mathematical definition of the circuit. |
| **.wasm** | *WebAssembly Module* — Used to generate witnesses (inputs and outputs) for proof generation. |
| **.sym** | *Symbol File* — Maps constraint indices to variable names for easier debugging and analysis. |
| **.zkey** | *Proving Key* — Used by the prover to generate zero-knowledge proofs after the trusted setup is complete. |

---

## 🔑 PTAU Files (Powers of Tau)

The **Powers of Tau (PTAU)** file is part of the trusted setup ceremony required by zk-SNARKs (like Groth16).  
It contains public parameters derived from a multi-party computation process.

| File Type | Description |
|------------|--------------|
| **.ptau** | The "Powers of Tau" file provides the cryptographic base used in the setup phase for generating proving and verification keys. It ensures the randomness and security of the SNARK setup. |

---

---

## 📦 Current Repository Artifact Locations

The current `zkArb-sdk` repository contains the following build and setup files:

```
zkArb-sdk/
├── bin/
│ └── circom # Circom binary used for circuit compilation
├── ptau/
│ └── pot12_final.ptau # Final Powers of Tau file (used for Groth16 setup)
├── pot12_0000.ptau # Initial Powers of Tau file (phase 1)
├── pot12_0001.ptau # Intermediate Powers of Tau file (phase 1 contribution)
```


These files are essential for running the trusted setup and compiling circuits as part of the zkArb-sdk build process.


---

### 🔙 Back to Documentation Index

← **[Go back to Index](index.md)**

