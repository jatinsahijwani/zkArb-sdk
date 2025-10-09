// The test is currently unable to run due to missing circomlib dependency.
// Once circomlib is added, the test should function correctly.

const fs = require("fs-extra");
const path = require("path");
const { compileCircuit } = require("../lib/compile"); 
const tempDir = path.join(__dirname, "temp_tests");

describe("zkArb compile command", () => {
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

    expect(fs.existsSync(path.join(outDir, `${baseName}.r1cs`))).toBe(true);
    expect(fs.existsSync(path.join(outDir, "circuit_final.zkey"))).toBe(true);
    expect(fs.existsSync(path.join(outDir, "verifier.sol"))).toBe(true);
  });
});
