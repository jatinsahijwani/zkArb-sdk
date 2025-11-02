const path = require("path");
const fs = require("fs-extra");
const Web3 = require("web3");
const { execSync } = require("child_process");

async function verifyProof(input, folderPath) {
  try {
    const rpcUrl = "https://arbitrum-sepolia-rpc.publicnode.com"; //Arbitrum Sepolia RPC URL

    // Paths
    const inputJsonPath = path.join(folderPath, "input.json");
    const folderName = path.basename(folderPath);
    const wasmDir = path.join(folderPath, `${folderName}_js`);
    const wasmPath = path.join(wasmDir, `${folderName}.wasm`);
    const zkeyPath = path.join(folderPath, "circuit_final.zkey");
    const proofPath = path.join(folderPath, "proof.json");
    const publicPath = path.join(folderPath, "public.json");

    // Step 1: Write input.json
    await fs.writeJson(inputJsonPath, input, { spaces: 2 });

    // Step 2: Generate proof using fullprove
    console.log("📦 Generating proof using fullprove...");
    execSync(
      `snarkjs groth16 fullprove "${inputJsonPath}" "${wasmPath}" "${zkeyPath}" "${proofPath}" "${publicPath}"`,
      { stdio: "inherit" }
    );

    // Step 3: Read proof + public signals
    const proof = await fs.readJson(proofPath);
    const publicSignals = await fs.readJson(publicPath);

    // Step 4: Read deployment
    const deploymentPath = path.join(folderPath, "deployment.json");
    if (!fs.existsSync(deploymentPath)) {
      throw new Error(`deployment.json not found in ${folderPath}`);
    }

    const { contractAddress, abi } = await fs.readJson(deploymentPath);

    // Step 5: Call smart contract
    const web3 = new Web3(rpcUrl);
    const contract = new web3.eth.Contract(abi, contractAddress);

    const pi_a = [proof.pi_a[0], proof.pi_a[1]];

const pi_b = [
  [proof.pi_b[0][1], proof.pi_b[0][0]], // reverse inner arrays
  [proof.pi_b[1][1], proof.pi_b[1][0]],
];

const pi_c = [proof.pi_c[0], proof.pi_c[1]];


    console.log("🔍 Verifying proof on-chain...");
    const result = await contract.methods
      .verifyProof(pi_a, pi_b, pi_c, publicSignals)
      .call();

    return {result,publicSignals};
  } catch (err) {
    console.error("❌ ZK Proof verification failed:", err.message || err);
    throw err;
  }
}

module.exports = { verifyProof };