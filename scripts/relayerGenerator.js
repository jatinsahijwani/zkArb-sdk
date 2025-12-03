// relayerGenerator.js

const fs = require("fs");
const path = require("path");

function generateRelayer(outputDir, l2VerifierAddress, l1ReceiverAddress, l2abi, l1abi, privateKey, l2Rpc) {
  const relayerPath = path.join(outputDir, "relayer.js");
  const l1Rpc = "https://0xrpc.io/sep";
  

  const content = `
// artifacts/relayer.js

const Web3 = require("web3");
const fs = require("fs");
const path = require("path");

async function startRelayer() {

  const privateKey = "${privateKey}";
  const l2VerifierAddress = "${l2VerifierAddress}";
  const l1ReceiverAddress = "${l1ReceiverAddress}";
  const l1Rpc = "${l1Rpc}";
  const l2Rpc = "${l2Rpc}";

  console.log("🚀 Starting zkArb Relayer...");
  console.log("Listening on L2:", l2VerifierAddress);
  console.log("Forwarding to L1:", l1ReceiverAddress);

  const l2Web3 = new Web3("wss://arbitrum-sepolia-rpc.publicnode.com");
  const l1Web3 = new Web3(new Web3.providers.HttpProvider(l1Rpc));

  // Load verifier ABI from artifacts
  const l2Abi = ${JSON.stringify(l2abi)};

  // Load L1 receiver ABI
  const l1Abi = ${JSON.stringify(l1abi)};


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

`;

  fs.writeFileSync(relayerPath, content);
  console.log("✅ relayer.js generated at:", relayerPath);
}

module.exports = { generateRelayer };
