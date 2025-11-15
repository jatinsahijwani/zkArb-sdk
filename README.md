# zkarb-sdk 

Write Circom. Compile. Deploy. Verify — all in just one click, Powered by Arbitrum

A zero-setup toolkit to build, deploy, and verify ZK circuits using Circom — with no Web3 knowledge required.

---

## ✨ Features

- 🧠 Write simple Circom circuits
- 🛠 Compile to .r1cs, .wasm, .zkey, and Solidity verifier
- 🚀 Deploy verifier to Arbitrum with one command
- ✅ Verify proofs using a single JavaScript function
- 🌉 Bridge zk-proofs to Ethereum L1 using built-in cross-chain messaging
- 🔗 Deploy to any custom Arbitrum Orbit chain via user-provided RPC
- ⚙️ Optimize Solidity verifier contracts for Arbitrum calldata encoding to reduce gas
- 🌐 Choose deployment network: Arbitrum One, Arbitrum Nova, or Sepolia
- 🧪 No Web3 scripting, no ABI handling — fully abstracted
---

## 📦 Installation

Install in your project:

```bash
npm install zkarb-sdk
```

⚡️ Usage

### ✅ Compile Circom circuit

```bash
npx zkarb-sdk compile <path-to-your-circom-file>
```

This command:

- Compiles your .circom file
- Runs Groth16 trusted setup
- Outputs .r1cs, .wasm, circuit_final.zkey, and verifier.sol
- All files are saved in a folder named after your circuit (e.g., ./yourCircuit/)

### ✅ Test Compiled Circom Circuit

```bash
npx zkarb-sdk test <path-to-generated-folder> <path-to-input.json>
```

This command:

- Tests the zk System produced by the compile command
- Uses inputs provided by the developer from input.json provided
- produces proof.json and public.json
- proof.json contains the smart contract parameters, which will be used to verify it onchain
- public.json contains human verifiable outputs and proofs

### ✅ Deploy Compiled Circom Circuit

```bash
npx zkarb-sdk deploy <path-to-generated-folder> <PRIVATE_KEY> \
  [--optimized] \
  [--network one|nova|sepolia|orbit] \
  [--rpc <custom-rpc-url>] \
  [--bridge-l1]
```

This command:

- Compiles verifier.sol generated during compilation using solc
- Deploys the compiled binary to Arbitrum, taking fees from the provided wallet's private key
- [--optimized] option is responsible for optimizing solidity contract, adds wrapper contract for reduced calldata size
- [--network one|nova|sepolia|orbit] option lets developer select the network
- [--rpc <custom-rpc-url>] option lets developer choose which Orbit chain rpc or custom Orbit devnet to deploy
- [--bridge-l1] option enables automatic cross-chain messenger, including deploying a L1 message receiver contract on L1

### ✅ Verify ZK Proof Programmatically

You can verify a proof directly using a single function call.

```js
 const { verifyProof } = require("zkarb-sdk");

const result = await verifyProof({
  input: {
    // Your circuit input goes here
  },
  "<relative-path-to-generated-folder>",
});

console.log(result ? "✅ Valid proof" : "❌ Invalid proof");
```
- You pass input (in the form of json) & Relative path to the generated folder, which was generated during compilation process
- Automatically generates the proof and public signals
- Formats the calldata for the Solidity verifier
- Calls the deployed verifier contract on Arbitrum and returns the result

### ✅ Verify ZK Proof Programmatically & Send the message to L1, that Proof is verified

You can verify a proof directly using a single function call, and send that proof to L1.
Note : For using VerifyAndEmit function, developer must use deploy command with the option "--bridge-l1"

```js
const { verifyAndEmit } = require("zkarb-sdk");

const result = await verifyAndEmit({
  input: {
    //your circuit input goes here
  },
  "<relative-path-to-generated-folder>", //folder containing artifacts generated during compile process
  "private-key>" //for bridging zk proof from l2 to l1
});

console.log(result ? "Valid proof" : "Invalid Proof");
```

# You don’t need to manually use snarkjs or interact with web3 directly — the SDK abstracts it all for you.

## 🛠 Commands Overview

| Command                                       | Description                                      |
|----------------------------------------------|--------------------------------------------------|
| npx zkarb-sdk compile <path-to-circuit> | Compiles the .circom file and runs Groth16 setup |
| npx zkarb-sdk test <output-folder> <path-to-input.json> | Tests the Circom logic locally using ZK Proofs        |
| npx zkarb-sdk deploy <path-to-generated-folder> <PRIVATE_KEY> [--optimized] [--network one,nova,sepolia,orbit] [--rpc <custom-rpc-url>] [--bridge-l1] | Deploys the verifier contract to Arbitrum, according to options choosed        |
| verifyProof(input,"<relative-path-to-output-folder>") *(programmatic only)* | Generates proof and verifies it on-chain using deployed contract |


