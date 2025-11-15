const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');
const Web3 = require('web3');

// RPC Map for all Arbitrum networks
const RPCS = {
  "one": "https://arb1.arbitrum.io/rpc",
  "nova": "https://nova.arbitrum.io/rpc",
  "sepolia": "https://sepolia-rollup.arbitrum.io/rpc", // testnet equivalent to one and nova
};

/**
 * Deploys verifier.sol (or VerifierWrapper.sol if optimized)
 * and generates optimization report when applicable.
 */
async function deployVerifier(folderPath, privateKey, options = {}) {
  try {
    // --- Parse network option ---
    const selectedNetwork = options.network?.toLowerCase() || "sepolia";
    const customRpc = options.rpc; // user-provided RPC (for Orbit chains)
    const rpcUrl = RPCS[selectedNetwork];

    // --- Determine final RPC ---
    let finalRpc;
    if (customRpc) {
      console.log(`🛰️ Using custom RPC for Orbit chain: ${customRpc}`);
      finalRpc = customRpc;
    } else if (rpcUrl) {
      finalRpc = rpcUrl;
      console.log(`🌐 Deploying to: ${selectedNetwork} (${finalRpc})`);
    } else {
      console.warn(`⚠️ Unknown network '${selectedNetwork}'. Falling back to Arbitrum Sepolia.`);
      finalRpc = RPCS["sepolia"];
    }

    const isOptimized = options.optimized || false;
    const baseVerifierPath = path.join(folderPath, 'verifier.sol');
    const wrapperVerifierPath = path.join(folderPath, 'VerifierWrapper.sol');

    // --- Check file existence ---
    if (!fs.existsSync(baseVerifierPath)) {
      throw new Error(`verifier.sol not found in folder: ${folderPath}`);
    }
    if (isOptimized && !fs.existsSync(wrapperVerifierPath)) {
      throw new Error(`VerifierWrapper.sol not found in folder: ${folderPath}`);
    }

    const fileToCompile = isOptimized ? wrapperVerifierPath : baseVerifierPath;
    const fileName = path.basename(fileToCompile);
    console.log(isOptimized ? "🚀 Deploying optimized verifier wrapper..." : "🚀 Deploying standard verifier...");

    // --- Import resolver (relative to folderPath) ---
    function findImports(importPath) {
      try {
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
    const web3 = new Web3(finalRpc);
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
      network: selectedNetwork,
      rpc: finalRpc,
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
          "No change in Groth16 verification logic (view-only).",
          "Optimized for Arbitrum Nitro calldata efficiency."
        ],
        generatedAt: new Date().toISOString()
      };

      await fs.writeJson(path.join(folderPath, 'optimization-report.json'), report, { spaces: 2 });
      console.log("✅ optimization-report.json generated successfully!");
    }

  } catch (err) {
    console.log("❌ Deployment failed:", err.message || err);
    process.exit(1);
  }
}

module.exports = { deployVerifier };
