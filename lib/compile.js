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

    const ptauPath = path.resolve(__dirname, "..", "ptau", "pot12_final.ptau");
    if (!fs.existsSync(ptauPath)) throw new Error("❌ Missing PTAU file.");

    console.log(`⚙️ Running Groth16 setup...`);
    const r1csPath = path.join(outDir, `${baseName}.r1cs`);
    const zkeyPath = path.join(outDir, `circuit_final.zkey`);

    execSync(`snarkjs groth16 setup "${r1csPath}" "${ptauPath}" "${zkeyPath}"`, { stdio: "inherit" });

    console.log(`🧩 Exporting Solidity verifier...`);
    execSync(`snarkjs zkey export solidityverifier "${zkeyPath}" "${outDir}/verifier.sol"`, {
        stdio: "inherit",
    });

    console.log(`✅ Compilation completed for ${baseName}`);
}

module.exports = { compileCircuit };
