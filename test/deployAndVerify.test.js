const fs = require("fs-extra");
const path = require("path");
const { compileCircuit } = require("../lib/compile"); 
const {deployVerifier} = require('../lib/deploy');
const {verifyProof} = require('../lib/verify');

const tempDir = path.join(__dirname, "temp_tests");

describe("zkArb deploy command", () => {
  const circuitPath = path.join(__dirname,"circom", "simple.circom");
  beforeAll(async () => {
    await fs.ensureDir(tempDir);
  });

  afterAll(async () => {
    await fs.remove(tempDir);
  });

  test("compiles circuit successfully", async () => {
    await compileCircuit(circuitPath);
    const baseName = path.basename(circuitPath, ".circom");
    const outDir = path.join(process.cwd(), baseName);

    expect(fs.existsSync(path.join(outDir, "verifier.sol"))).toBe(true);
    const verifierPath = path.join(outDir, "verifier.sol");
    console.log("Verifier.sol path:", verifierPath);
    await deployVerifier(outDir, "5fa81c25925d4bb6654e10772da9d9ab495e3bc0f6a29b78d5c4165e385e82ab");
    const deploymentInfoPath = path.join(outDir, "deployment.json");
    expect(fs.existsSync(deploymentInfoPath)).toBe(true);
    console.log("Deployment info path:", deploymentInfoPath);

    const input = fs.readFileSync(path.join(__dirname, "json", "simple.json"), "utf8");
    const result = await verifyProof(JSON.parse(input), outDir);
    console.log("Verification result:", result);
    expect(result.result).toBe(true);
    // cleanup act
    const wasmDir = path.join(outDir, `${baseName}_js`);
    if (await fs.pathExists(wasmDir)) await fs.remove(wasmDir);
    if (await fs.pathExists(outDir)) await fs.remove(outDir);
    
    //confirm deletion
    expect(await fs.pathExists(outDir)).toBe(false);
    expect(await fs.pathExists(wasmDir)).toBe(false);
  });
});