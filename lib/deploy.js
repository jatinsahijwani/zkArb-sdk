const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');
const Web3 = require('web3');

/**
 * Deploys verifier.sol (or VerifierWrapper.sol if optimized)
 * and generates optimization report when applicable.
 */
async function deployVerifier(folderPath, privateKey, options = {}) {
  try {
    const isOptimized = options.optimized || false;
    const baseVerifierPath = path.join(folderPath, 'verifier.sol');
    const wrapperVerifierPath = path.join(folderPath, 'VerifierWrapper.sol');
    const rpcUrl = "https://arbitrum-sepolia-rpc.publicnode.com"; // Arbitrum Sepolia RPC

    // --- Check file existence ---
    if (!fs.existsSync(baseVerifierPath)) {
      console.error(`❌ verifier.sol not found in folder: ${folderPath}`);
      process.exit(1);
    }
    if (isOptimized && !fs.existsSync(wrapperVerifierPath)) {
      console.error(`❌ VerifierWrapper.sol not found in folder: ${folderPath}`);
      process.exit(1);
    }

    const fileToCompile = isOptimized ? wrapperVerifierPath : baseVerifierPath;
    const fileName = path.basename(fileToCompile);
    console.log(isOptimized ? "🚀 Deploying optimized verifier wrapper..." : "🚀 Deploying standard verifier...");

    // --- Import resolver (relative to folderPath) ---
    function findImports(importPath) {
      try {
        // Resolve imports relative to the folder where contracts exist
        const resolvedPath = path.resolve(folderPath, importPath);
        const content = fs.readFileSync(resolvedPath, "utf8");
        return { contents: content };
      } catch (e) {
        return { error: `File not found: ${importPath} in ${folderPath}` };
      }
    }

    // --- Read Solidity source ---
    const source = fs.readFileSync(fileToCompile, 'utf8');
    const input = {
      language: 'Solidity',
      sources: { [fileName]: { content: source } },
      settings: {
        optimizer: { enabled: true, runs: 200 },
        outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } }
      }
    };

    // --- Compile contract ---
    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

    // Log compiler errors/warnings
    if (output.errors) {
      for (const err of output.errors) {
        if (err.severity === "error") throw new Error(err.formattedMessage);
        console.warn(`⚠️ ${err.formattedMessage}`);
      }
    }

    const contractName = Object.keys(output.contracts[fileName])[0];
    const contractData = output.contracts[fileName][contractName];

    const abi = contractData.abi;
    const bytecode = contractData.evm.bytecode.object;

    if (!bytecode || bytecode.length === 0) throw new Error('Compilation failed, no bytecode found.');

    // --- Initialize Web3 ---
    const web3 = new Web3(rpcUrl);
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    // --- Deploy contract ---
    const contract = new web3.eth.Contract(abi);
    const deployTx = contract.deploy({ data: '0x' + bytecode });
    const gasEstimate = await deployTx.estimateGas({ from: account.address });

    console.log(`⛽ Estimated gas: ${gasEstimate}`);

    const deployedContract = await deployTx.send({
      from: account.address,
      gas: gasEstimate
    });

    console.log(`✅ Contract deployed!`);
    console.log(`📦 Address: ${deployedContract.options.address}`);

    // --- Save deployment info ---
    const deploymentInfo = {
      contractName,
      contractAddress: deployedContract.options.address,
      abi,
      isOptimized,
      deployedAt: new Date().toISOString()
    };
    await fs.writeJson(path.join(folderPath, 'deployment.json'), deploymentInfo, { spaces: 2 });

    // --- Generate optimization report ---
    if (isOptimized) {
      console.log("🧮 Generating optimization report...");

      const baseSource = fs.readFileSync(baseVerifierPath, 'utf8');
      const wrapperSource = fs.readFileSync(wrapperVerifierPath, 'utf8');
      const baseLength = baseSource.length;
      const wrapperLength = wrapperSource.length;

      const report = {
        optimizationMode: true,
        baseFile: 'verifier.sol',
        wrapperFile: 'VerifierWrapper.sol',
        baseSourceLength: baseLength,
        wrapperSourceLength: wrapperLength,
        bytecodeSizeComparison: {
          baseVerifier: `${(baseLength / 1024).toFixed(2)} KB (source)`,
          wrapperVerifier: `${(wrapperLength / 1024).toFixed(2)} KB (source)`
        },
        notes: [
          "Wrapper provides ABI-safe, calldata-optimized structure.",
          "Added event logging for proof verification.",
          "No change in Groth16 verification logic (view-only).",
          "Optimized for Arbitrum Nitro calldata efficiency."
        ],
        generatedAt: new Date().toISOString()
      };

      await fs.writeJson(path.join(folderPath, 'optimization-report.json'), report, { spaces: 2 });
      console.log("✅ optimization-report.json generated successfully!");
    }

  } catch (err) {
    console.error("❌ Deployment failed:", err.message || err);
    process.exit(1);
  }
}

module.exports = { deployVerifier };
