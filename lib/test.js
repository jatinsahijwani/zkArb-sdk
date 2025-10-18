 const path = require('path');
  const { execSync } = require('child_process');
  const fs = require('fs');

  function testCircuit(folderPath, inputPath) {
    try {
      if (!fs.existsSync(folderPath)) {
        console.error(`❌ Folder not found: ${folderPath}`);
        process.exit(1);
      }

      if (!fs.existsSync(inputPath)) {
        console.error(`❌ input.json not found: ${inputPath}`);
        process.exit(1);
      }

      const folderName = path.basename(folderPath); // e.g. "example"
      const wasmDir = path.join(folderPath, `${folderName}_js`);
      const wasmPath = path.join(wasmDir, `${folderName}.wasm`);
      const zkeyPath = path.join(folderPath, 'circuit_final.zkey');
      const proofPath = path.join(folderPath, 'proof.json');
      const publicPath = path.join(folderPath, 'public.json');

      if (!fs.existsSync(wasmPath)) {
        console.error(`❌ .wasm file not found: ${wasmPath}`);
        process.exit(1);
      }

      if (!fs.existsSync(zkeyPath)) {
        console.error('❌ circuit_final.zkey not found. Make sure to compile first.');
        process.exit(1);
      }

      console.log(`✅ Running groth16 fullprove...`);
      execSync(`snarkjs groth16 fullprove ${inputPath} ${wasmPath} ${zkeyPath} ${proofPath} ${publicPath}`, {
        stdio: 'inherit'
      });

      console.log(`✅ Proof generated at: ${proofPath}`);
      console.log(`✅ Public inputs at: ${publicPath}`);
    } catch (err) {
      console.error('❌ Error generating proof:', err.message);
      process.exit(1);
    }
  }

  module.exports = { testCircuit };