
// artifacts/relayer.js

const Web3 = require("web3");
const fs = require("fs");
const path = require("path");

async function startRelayer() {

  const privateKey = "566d6a0f09b905746f0525805bf7f1ee92d5e4af9b9e58319123587e4564ce6b";
  const l2VerifierAddress = "0x77c93Ab66D6506a2061d8d3d13347602ca9049d3";
  const l1ReceiverAddress = "0x103D3bd182bD25FfEF1DE816878da0bE7B6c5738";
  const l1Rpc = "https://0xrpc.io/sep";
  const l2Rpc = "https://sepolia-rollup.arbitrum.io/rpc";

  console.log("🚀 Starting zkArb Relayer...");
  console.log("Listening on L2:", l2VerifierAddress);
  console.log("Forwarding to L1:", l1ReceiverAddress);

  const l2Web3 = new Web3("wss://arbitrum-sepolia-rpc.publicnode.com");
  const l1Web3 = new Web3(new Web3.providers.HttpProvider(l1Rpc));

  // Load verifier ABI from artifacts
  const l2Abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"verifier","type":"address"},{"indexed":false,"internalType":"bool","name":"success","type":"bool"},{"indexed":true,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProofVerified","type":"event","signature":"0x1a3c3d9ea4bb433a209943b5a877ec79bb67f94676c75ccada8c47396e50179c"},{"inputs":[{"internalType":"uint256[2]","name":"_pA","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"_pB","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"_pC","type":"uint256[2]"},{"internalType":"uint256[1]","name":"_pubSignals","type":"uint256[1]"}],"name":"verifyAndEmit","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function","signature":"0x4babe26b"},{"inputs":[{"internalType":"uint256[2]","name":"_pA","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"_pB","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"_pC","type":"uint256[2]"},{"internalType":"uint256[1]","name":"_pubSignals","type":"uint256[1]"}],"name":"verifyProof","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x43753b4d"}];

  // Load L1 receiver ABI
  const l1Abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"fromVerifier","type":"address"},{"indexed":true,"internalType":"address","name":"relayer","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProofReceived","type":"event","signature":"0x2aecd64fdd0f7636b3ce22e7388361e45a7bb79d586aa68af992de467d53a41a"},{"inputs":[],"name":"lastRelayer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x18545605"},{"inputs":[],"name":"lastTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x19d8ac61"},{"inputs":[],"name":"lastVerifier","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x5f7d8e48"},{"inputs":[{"internalType":"address","name":"verifier","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"receiveProof","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x44074179"},{"inputs":[],"name":"totalReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true,"signature":"0xa3c2c462"}];


  const l2 = new l2Web3.eth.Contract(l2Abi, l2VerifierAddress);
  const l1 = new l1Web3.eth.Contract(l1Abi, l1ReceiverAddress);


  const relayer = l1Web3.eth.accounts.wallet.add(privateKey);


  l2.events
  .ProofVerified({ fromBlock: "latest" })
  .on("data", async (event) => {
    try {
      const { verifier, success, timestamp } = event.returnValues;

      console.log("📢 L2 Event Detected!");
      console.log("Verifier:", verifier);
      console.log("Success:", success);
      console.log("Timestamp:", timestamp);

      // Only relay if proof is valid
      if (!success) {
        console.log("⚠️ Not forwarding because success = false");
        return;
      }

      
      const gas = await l1.methods.receiveProof(verifier, timestamp).estimateGas({ from: relayer.address });
      console.log("Estimated gas for L1 tx:", gas);

      const tx = await l1.methods.receiveProof(verifier, timestamp).send({ from: relayer.address, gas });

      console.log("✅ Relayed to L1 successfully!");
      console.log("🔗 Tx hash:", tx.transactionHash);
      console.log("📬 Event Logs:", tx.events);

    } catch (err) {
      console.error("❌ Relay failed:", err);
    }
  })
  .on("error", (err) => {
    console.error("💥 Relayer error:", err);
  });
}

startRelayer();

