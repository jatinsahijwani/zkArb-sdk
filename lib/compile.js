const { execSync } = require("child_process");
const fs = require("fs-extra");
const path = require("path");

async function compileCircuit(circuitPath) {
    const baseName = path.basename(circuitPath, ".circom");
    const outDir = path.resolve(path.join(process.cwd(), baseName));
    
    await fs.ensureDir(outDir);
    await fs.emptyDir(outDir);
    
    console.log(`📦 Compiling ${baseName} into ${outDir}...`);
    
    // Get absolute paths for better reliability
    const absCircuitPath = path.resolve(circuitPath);
    const circomlibPath = path.resolve(__dirname, "..", "circomlib", "circuits");
    
    // Verify circomlib exists
    if (!fs.existsSync(circomlibPath)) {
        throw new Error(`❌ Circomlib not found at: ${circomlibPath}`);
    }
    
    // Define output paths
    const r1csPath = path.join(outDir, `${baseName}.r1cs`);
    const zkeyPath = path.join(outDir, `circuit_final.zkey`);
    const verifierPath = path.join(outDir, `verifier.sol`);
    
    // Compile circuit with circomlib path
    execSync(
        `"${path.resolve(__dirname, "..", "bin", "circom")}" "${absCircuitPath}" --wasm --r1cs -l "${circomlibPath}" -o "${outDir}"`,
        { 
            stdio: "inherit",
            cwd: outDir
        }
    );
    
    // Verify R1CS file exists
    if (!fs.existsSync(r1csPath)) {
        throw new Error(`❌ Compilation failed: ${r1csPath} not found.`);
    }
    
    // Rest of your existing code...
    const ptauPath = path.resolve(__dirname, "..", "ptau", "pot12_final.ptau");
    if (!fs.existsSync(ptauPath)) {
        throw new Error(`❌ Missing PTAU file at: ${ptauPath}`);
    }
    
    // Run groth16 setup
    execSync(
        `snarkjs groth16 setup "${r1csPath}" "${ptauPath}" "${zkeyPath}"`,
        { stdio: "inherit" }
    );
    
    // Export verifier (using correct command)
     execSync(
    `snarkjs zkey export solidityverifier "${outDir}/circuit_final.zkey" "${outDir}/verifier.sol"`,
    { stdio: "inherit" }
  );
    
    console.log(`✅ All files successfully generated in: ${outDir}`);
}

module.exports = { compileCircuit };