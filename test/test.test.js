const fs = require("fs-extra");
const path = require("path");
const { compileCircuit } = require("../lib/compile"); 
const {testCircuit} = require("../lib/test");
const tempDir = path.join(__dirname, "temp_tests");

describe("zkArb test command", () => {
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

    await testCircuit(outDir, path.join(__dirname, "json", "simple.json"));

    expect(fs.existsSync(path.join(outDir, `proof.json`))).toBe(true);
    expect(fs.existsSync(path.join(outDir, `public.json`))).toBe(true);

    const wasmDir = path.join(outDir, `${baseName}_js`);
    if (await fs.pathExists(wasmDir)) await fs.remove(wasmDir);
    if (await fs.pathExists(outDir)) await fs.remove(outDir);
    expect(await fs.pathExists(outDir)).toBe(false);
    expect(await fs.pathExists(wasmDir)).toBe(false);
  });
});