const Web3 = require("web3");
const fs = require("fs");
const { performance } = require("perf_hooks");

const path = "./simple";
const PRIVATE_KEY = "566d6a0f09b905746f0525805bf7f1ee92d5e4af9b9e58319123587e4564ce6b";

// Load proofs & deployment artifacts from your SDK output
const deploymentJson = JSON.parse(fs.readFileSync(`${path}/deployment.json`));
const verifierABI = deploymentJson.abi;
const proof = JSON.parse(fs.readFileSync(`${path}/proof.json`));
const publicSignals = JSON.parse(fs.readFileSync(`${path}/public.json`));
const CONTRACT_ADDRESS = deploymentJson.contractAddress;

const RPC = "https://sepolia-rollup.arbitrum.io/rpc";
const web3 = new Web3(RPC);

async function benchmarkOnce() {
  const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  web3.eth.accounts.wallet.add(account);

  const verifier = new web3.eth.Contract(verifierABI, CONTRACT_ADDRESS);

  // EIP-1559: Get baseFee from latest block
  const latestBlock = await web3.eth.getBlock("latest");
  const baseFee = BigInt(latestBlock.baseFeePerGas || 0);
  const maxPriorityFeePerGas = BigInt(1_000_000_000); // 1 Gwei
  const maxFeePerGas = baseFee + maxPriorityFeePerGas;

  // Reformat proof
  const pi_a = [proof.pi_a[0], proof.pi_a[1]];
  const pi_b = [
    [proof.pi_b[0][1], proof.pi_b[0][0]],
    [proof.pi_b[1][1], proof.pi_b[1][0]],
  ];
  const pi_c = [proof.pi_c[0], proof.pi_c[1]];

  const tx = verifier.methods.verifyAndEmit(pi_a, pi_b, pi_c, publicSignals);

  const gasEstimate = await tx.estimateGas({ from: account.address });

  const start = performance.now();

  const receipt = await tx.send({
    from: account.address,
    gas: gasEstimate,
    maxFeePerGas: maxFeePerGas.toString(),
    maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
  });

  const end = performance.now();

  return {
    gasUsed: receipt.gasUsed,
    maxFeePerGas: maxFeePerGas.toString(),
    executionTimeMs: Number((end - start).toFixed(3)),
    blockNumber: receipt.blockNumber,
    txHash: receipt.transactionHash
  };
}

function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted[mid];
}

(async () => {
  const RUNS = 20;
  const results = [];

  console.log(`\n🚀 Running ${RUNS} Arbitrum One Benchmark Iterations…\n`);

  for (let i = 0; i < RUNS; i++) {
    try {
      const r = await benchmarkOnce();
      results.push(r);
      console.log(
        `Run ${i + 1}/${RUNS} → Gas: ${r.gasUsed}, Time: ${r.executionTimeMs} ms`
      );
    } catch (err) {
      console.error(`Run ${i + 1} failed:`, err.message);
    }
  }

  // Extract arrays
  const gasArr = results.map(r => r.gasUsed);
  const timeArr = results.map(r => r.executionTimeMs);

  // Stats
  const summary = {
    runs: results.length,
    avgGasUsed: Math.round(avg(gasArr)),
    medianGasUsed: median(gasArr),
    avgExecutionTimeMs: avg(timeArr).toFixed(3),
    maxExecutionTimeMs: Math.max(...timeArr).toFixed(3),
    minExecutionTimeMs: Math.min(...timeArr).toFixed(3),
    maxFeePerGas: results[0]?.maxFeePerGas || null
  };

  // Save report
  fs.writeFileSync(
    `${path}/arbitrum-bench-report.json`,
    JSON.stringify({ summary, results }, null, 2)
  );

  console.log("\n=== 📊 Benchmark Summary ===");
  console.log(summary);

  console.log(
    `\n📁 Saved full benchmark report: ${path}/arbitrum-bench-report.json\n`
  );
})();