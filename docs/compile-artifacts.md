# Compile Artifacts Documentation

This document provides an overview of all the files and folders generated when running the **zkArb SDK compile command**.

---

## 🧩 Command Overview

To compile a Circom circuit and generate Groth16 proof artifacts, run:

```bash
npx zkarb-sdk compile <path-to-your-circom-file>
```

Example:
```bash
npx zkarb-sdk compile test/circom/simple.circom
```

This command compiles the given `.circom` file and generates a folder with the **same base name** as the circuit file.  
All output artifacts are placed inside this folder.

---

## 📁 Output Directory Structure

After running the above command, the following structure will be generated:

```
zkArb-sdk/
├── simple/                          # Generated output folder (base name = circuit name)
│   ├── circuit_final.zkey           # Groth16 proving key
│   ├── simple.r1cs                  # Rank-1 Constraint System (circuit constraints)
│   ├── verifier.sol                 # Solidity verifier contract
│   └── simple_js/                   # Folder containing witness generation files
│       ├── simple.wasm              # WebAssembly file for witness computation
│       ├── generate_witness.js      # Node.js script to generate witness from input
│       └── witness_calculator.js    # Utility module for witness calculation
```

---

## ⚙️ File Descriptions

| File / Folder | Description |
|----------------|--------------|
| **circuit_final.zkey** | Proving key generated using Groth16 setup; used to produce zero-knowledge proofs. |
| **simple.r1cs** | Binary representation of circuit constraints; defines arithmetic logic of the circuit. |
| **verifier.sol** | Solidity smart contract that allows on-chain verification of proofs. |
| **simple_js/** | Contains all files required to generate the witness in JavaScript/Node.js environments. |
| **simple.wasm** | WebAssembly binary compiled from the Circom circuit to compute witness efficiently. |
| **generate_witness.js** | Node script used to generate the witness file (`witness.wtns`) given circuit inputs. |
| **witness_calculator.js** | Core JavaScript module that defines witness computation logic. |

---

## 🧠 Example Workflow

1. **Compile the Circuit**
   ```bash
   npx zkarb-sdk compile test/circom/simple.circom
   ```

2. **Generated Output**
   The SDK creates a new folder named `simple/` in the project root, containing all build artifacts.

3. **Verify Files**
   ```bash
   ls simple/
   # circuit_final.zkey  simple.r1cs  verifier.sol  simple_js/
   ```

---

## 🧱 Location of Source Circuit

The source circuit used for compilation is located at:

```
zkArb-sdk/
└── test/
    └── circom/
        └── simple.circom
```

This file is compiled during the `npm test` command or when directly invoked via the SDK CLI.

---

## ✅ Notes

- The `simple/` folder in the root directory is auto-generated and can be deleted or replaced as needed.
- All file names correspond to the **base name** of the `.circom` file.
- Future versions of zkArb SDK will include automatic input handling and proof generation.
- The test suite uses this output to verify that compilation and artifact creation are successful.

---

## 📜 Summary

| Command | Output Folder | Main Files Generated |
|----------|----------------|----------------------|
| `npx zkarb-sdk compile test/circom/simple.circom` | `simple/` | `.zkey`, `.r1cs`, `.wasm`, `.sol` |
