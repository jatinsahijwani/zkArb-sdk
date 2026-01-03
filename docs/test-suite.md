# Test Suite Documentation

This document provides an overview of the testing framework and structure used in the **zkArb SDK** to validate compilation, proof generation, and overall CLI functionality.

---

## 🧪 Overview

The **test suite** ensures that each module of the SDK (especially the `compile` command and future proof-generation features) behaves as expected.  

It uses automated scripts to verify the correctness of generated build artifacts such as `.r1cs`, `.zkey`, and `.wasm` files.

---

## ⚙️ Structure


```

zkArb-sdk/
├── test/
│   ├── circom/
│   │   └── ageCheck.circom
│   │   └── hash.circom
│   │   └── multiplier.circom
│   │   └── simple.circom
│   ├── json/
│   │   └── simple.json
│   └── compile.test.js
│   └── deployAndVerify.test.js
│   └── test.test.js


```

---

## 🧩 Test Framework

The project uses **Jest** (or your testing framework, adjust accordingly) for automated testing.

| Command | Description |
|----------|-------------|
| `npm test` | Runs all test files in the `tests/` directory |



---

### 🔙 Back to Documentation Index

← **[Go back to Index](index.md)**

