// artifacts/relayer.js

const Web3 = require("web3");

async function startRelayer() {
  console.log("🚀 Starting zkArb Relayer (HTTP Polling Mode)");

  const privateKey =
    "0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659";

  const l2VerifierAddress = "0xDB2D15a3EB70C347E0D2C2c7861cAFb946baAb48";
  const l1ReceiverAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  // RPCs
  const l2Web3 = new Web3("http://localhost:8547");
  const l1Web3 = new Web3("http://127.0.0.1:8545");

  // Add relayer wallet to L1
  const relayer = l1Web3.eth.accounts.wallet.add(privateKey);

  // ABIs
  const l2Abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"verifier","type":"address"},{"indexed":false,"internalType":"bool","name":"success","type":"bool"},{"indexed":true,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProofVerified","type":"event","signature":"0x1a3c3d9ea4bb433a209943b5a877ec79bb67f94676c75ccada8c47396e50179c"},{"inputs":[{"internalType":"uint256[2]","name":"_pA","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"_pB","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"_pC","type":"uint256[2]"},{"internalType":"uint256[1]","name":"_pubSignals","type":"uint256[1]"}],"name":"verifyAndEmit","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function","signature":"0x4babe26b"},{"inputs":[{"internalType":"uint256[2]","name":"_pA","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"_pB","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"_pC","type":"uint256[2]"},{"internalType":"uint256[1]","name":"_pubSignals","type":"uint256[1]"}],"name":"verifyProof","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x43753b4d"}];

  const l1Abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"fromVerifier","type":"address"},{"indexed":true,"internalType":"address","name":"relayer","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProofReceived","type":"event","signature":"0x2aecd64fdd0f7636b3ce22e7388361e45a7bb79d586aa68af992de467d53a41a"},{"inputs":[],"name":"lastRelayer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x18545605"},{"inputs":[],"name":"lastTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x19d8ac61"},{"inputs":[],"name":"lastVerifier","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x5f7d8e48"},{"inputs":[{"internalType":"address","name":"verifier","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"receiveProof","outputs":[],"stateMutability":"nonpayable","type":"function","signature":"0x44074179"},{"inputs":[],"name":"totalReceived","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true,"signature":"0xa3c2c462"}];

  const l2 = new l2Web3.eth.Contract(l2Abi, l2VerifierAddress);
  const l1 = new l1Web3.eth.Contract(l1Abi, l1ReceiverAddress);

  let lastCheckedBlock = await l2Web3.eth.getBlockNumber();

  async function poll() {
    try {
      const latest = await l2Web3.eth.getBlockNumber();

      if (latest > lastCheckedBlock) {
        console.log(`⏳ Checking blocks ${lastCheckedBlock + 1} → ${latest}`);

        const logs = await l2.getPastEvents("ProofVerified", {
          fromBlock: lastCheckedBlock + 1,
          toBlock: latest,
        });

        for (const ev of logs) {
          const { verifier, success, timestamp } = ev.returnValues;

          console.log("📢 ProofVerified detected:", ev.returnValues);

          if (!success) {
            console.log("⛔ Not relaying. success=false");
            continue;
          }

          // Relay to L1
          const gas = await l1.methods
            .receiveProof(verifier, timestamp)
            .estimateGas({ from: relayer.address });

          const tx = await l1.methods
            .receiveProof(verifier, timestamp)
            .send({ from: relayer.address, gas });

          console.log("✅ Relayed to L1:", tx.transactionHash);
        }

        lastCheckedBlock = latest;
      }
    } catch (err) {
      console.error("🔥 Polling error:", err);
    }

    setTimeout(poll, 2000);
  }

  poll();
}

startRelayer();
