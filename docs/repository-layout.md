# zkArb SDK – Repository Layout

This document provides an overview of the **zkArb SDK** repository structure and explains the purpose of each directory and file.  

It is intended to help new contributors and maintainers understand how the project is organized and where to add new features, documentation, or commands.

---

## 📂 Root Directory Overview

```
zkArb-sdk/
├── .github/
│   ├── workflows/
│   │   └── test.yml
│   │   └── publish.yml
├── bin/
│   └── circom-linux-amd64
│   └── circom-macos-amd64
│   └── circom-windows-amd64
│   ├── cli.js
│   ├── index.js
├── circomlib/
├── docs/
│   ├── build-artifacts.md
│   ├── cli-outline.md
│   ├── compile-artifacts.md
│   ├── cross-platform-compatibility.md
│   ├── examples-verifiers.md
│   ├── index.md
│   └── repository-layout.md
│   ├── test-suite.md
├── examples/
│   ├── ageCheck
│   ├── hash
│   ├── multiplier
├── lib/
│   └── compile.js
│   └── deploy.js
│   └── deployWithBridge.js
│   └── getCircomPath.js
│   └── test.js
│   └── verify.js
│   └── verifyAndEmit.js
├── orbit-example/
├── ptau/
│   └── pot12_final.ptau
├── scripts/
│   │   └── addBridgeSupport.js
│   │   └── generateL1Receiver.js
├── test/
│   ├── circom/
│   │   └── hash.circom
│   │   └── multiplier.circom
│   │   └── simple.circom
│   │   └── voter.circom
│   ├── json/
│   │   └── simple.json
│   └── compile.test.js
│   └── deployAndVerify.test.js
│   └── test.test.js
├── .gitignore
├── LICENSE
├── package-lock.json
├── package.json
├── pot12_0000.ptau
├── pot12_0001.ptau
└── README.md
```

---

### 🔙 Back to Documentation Index

← **[Go back to Index](index.md)**

