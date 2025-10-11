const fs = require("fs-extra");
const path = require("path");
const { compileCircuit } = require("../lib/compile");
const tempDir = path.join(__dirname, "temp_tests");

describe("zkArb compile command", () => {
  const circuitPath = path.join(__dirname, "circom", "simple.circom");

  beforeAll(async () => {
    await fs.ensureDir(tempDir);
  });

  afterAll(async () => {
    await fs.remove(tempDir);
  });

  test("compiles circuit successfully and cleans up completely", async () => {
    await compileCircuit(circuitPath);

    const baseName = path.basename(circuitPath, ".circom");
    const outDir = path.join(process.cwd(), baseName);
    const wasmDir = path.join(outDir, `${baseName}_js`);

    const expectedFiles = [
      path.join(outDir, `${baseName}.r1cs`),
      path.join(outDir, "circuit_final.zkey"),
      path.join(outDir, "verifier.sol"),
    ];

    // ✅ Verify all important files exist
    for (const file of expectedFiles) {
      expect(fs.existsSync(file)).toBe(true);
    }

    // ✅ Clean up: remove both output and wasm directories recursively
    try {
      if (await fs.pathExists(wasmDir)) {
        await fs.remove(wasmDir);
      }

      if (await fs.pathExists(outDir)) {
        await fs.remove(outDir);
      }
    } catch (err) {
      console.error(`⚠️ Cleanup failed for ${baseName}:`, err);
    }

    // Double-check that everything was deleted
    expect(await fs.pathExists(outDir)).toBe(false);
    expect(await fs.pathExists(wasmDir)).toBe(false);
  });
});
