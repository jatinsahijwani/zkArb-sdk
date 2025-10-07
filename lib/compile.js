const { execSync } = require("child_process");
const fs = require("fs-extra");
const path = require("path");

async function compileCircuit(circuitPath) {
    const baseName = path.basename(circuitPath, ".circom");
    const outDir = path.resolve(path.join(process.cwd(), baseName));

    await fs.ensureDir(outDir);
    await fs.emptyDir(outDir);

    console.log(`📦 Compiling ${baseName} into ${outDir}...`);

    const absCircuitPath = path.resolve(circuitPath);
    const circomlibPath = path.resolve(__dirname, "..", "circomlib", "circuits");
    const circomBin = path.resolve(__dirname, "..", "bin", "circom");

    if (!fs.existsSync(circomBin)) throw new Error("❌ circom binary not found.");
    if (!fs.existsSync(circomlibPath)) throw new Error("❌ circomlib not found.");

    execSync(
        `"${circomBin}" "${absCircuitPath}" --wasm --r1cs -l "${circomlibPath}" -o "${outDir}"`,
        { stdio: "inherit" }
    );

    console.log(`✅ Circuit compiled successfully.`);
}

module.exports = { compileCircuit };
