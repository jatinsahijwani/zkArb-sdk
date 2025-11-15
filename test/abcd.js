const fs = require("fs-extra");
const path = require("path");
const { compileCircuit } = require("../lib/compile"); 
const {deployVerifier} = require('../lib/deploy');
const {verifyProof} = require('../lib/verify');

const tempDir = path.join(__dirname, "temp_tests");
const circuitPath = path.join(__dirname,"circom", "simple.circom");

async function main () {
    
await compileCircuit(circuitPath);
const baseName = path.basename(circuitPath, ".circom");
const outDir = path.join(process.cwd(), baseName);
const verifierPath = path.join(outDir, "verifier.sol");
console.log("Verifier.sol path:", verifierPath);
await deployVerifier(outDir, "0x566d6a0f09b905746f0525805bf7f1ee92d5e4af9b9e58319123587e4564ce6b");
const deploymentInfoPath = path.join(outDir, "deployment.json");
console.log("Deployment info path:", deploymentInfoPath);
const input = fs.readFileSync(path.join(__dirname, "json", "simple.json"), "utf8");
const result = await verifyProof(JSON.parse(input), outDir);
console.log("Verification result:", result);
}

main();