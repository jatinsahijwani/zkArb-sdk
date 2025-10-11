const fs = require("fs-extra");
const path = require("path");
const { compileCircuit } = require("../lib/compile");

describe("zkArb compile command", () => {
  const circuitsDir = path.join(__dirname, "circom");

  // Dynamically list all .circom files in the test/circom directory
  const circuitFiles = fs.readdirSync(circuitsDir).filter(f => f.endsWith(".circom"));

  beforeAll(async () => {
    console.log(`🧪 Found ${circuitFiles.length} circuits to test:`, circuitFiles);
  });

  for (const circuitFile of circuitFiles) {
    const circuitPath = path.join(circuitsDir, circuitFile);
    const baseName = path.basename(circuitFile, ".circom");
    const outDir = path.join(process.cwd(), baseName);
    const wasmDir = path.join(outDir, `${baseName}_js`);

    test(`compiles ${circuitFile} successfully`, async () => {
      await compileCircuit(circuitPath);

      // Check essential files exist
      expect(fs.existsSync(path.join(outDir, `${baseName}.r1cs`))).toBe(true);
      expect(fs.existsSync(path.join(outDir, "circuit_final.zkey"))).toBe(true);
      expect(fs.existsSync(path.join(outDir, "verifier.sol"))).toBe(true);

      // ✅ Cleanup after each test
      if (await fs.pathExists(wasmDir)) await fs.remove(wasmDir);
      if (await fs.pathExists(outDir)) await fs.remove(outDir);

      // Confirm deletion
      expect(await fs.pathExists(outDir)).toBe(false);
      expect(await fs.pathExists(wasmDir)).toBe(false);
    });
  }
});
