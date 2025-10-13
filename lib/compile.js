const { execSync } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const { getCircomPath } = require("./getCircomPath");

/**
 * Compiles a Circom circuit and prepares all necessary artifacts for Groth16 zk-SNARKs.
 * 
 * Steps performed:
 * 1. Ensures output directory exists and is empty.
 * 2. Compiles the `.circom` circuit into `.wasm` and `.r1cs` files.
 * 3. Performs Groth16 trusted setup using the PTAU file.
 * 4. Generates a `.zkey` proving key and exports the Solidity verifier contract.
 * 
 * @param {string} circuitPath - Relative or absolute path to the `.circom` circuit file
 * @throws Will throw an error if required files (circomlib, PTAU, R1CS) are missing
 */

async function compileCircuit(circuitPath) {


    // Resolve the circuit path (relative to current working directory)
    const circomBinary = getCircomPath();


    // Extract the base file name without extension (used for output folder and artifacts)
    const baseName = path.basename(circuitPath, ".circom");
    
     // Resolve output directory path for generated artifacts
    const outDir = path.resolve(path.join(process.cwd(), baseName));
    
    // Ensure the output directory exists and is empty
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
    
    // Define output paths for generated artifacts
    const r1csPath = path.join(outDir, `${baseName}.r1cs`);
    const zkeyPath = path.join(outDir, `circuit_final.zkey`);
    const verifierPath = path.join(outDir, `verifier.sol`);
    
    // Compile circuit with circomlib path (circom lib yet to be added)
    execSync(
        `"${circomBinary}" "${absCircuitPath}" --wasm --r1cs -l "${circomlibPath}" -o "${outDir}"`,
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
    
    // Export verifier.sol solidity contract
     execSync(
    `snarkjs zkey export solidityverifier "${outDir}/circuit_final.zkey" "${outDir}/verifier.sol"`,
    { stdio: "inherit" }
  );
    
  // Log completion message
    console.log(`✅ All files successfully generated in: ${outDir}`);
}

// Export the compileCircuit function for external usage by developer
module.exports = { compileCircuit };