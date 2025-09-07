const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');
const Web3 = require('web3');

async function deployVerifier(folderPath, privateKey) {
  try {
    const verifierPath = path.join(folderPath, 'verifier.sol');
    const rpcUrl = "https://arbitrum-sepolia-rpc.publicnode.com";
    if (!fs.existsSync(verifierPath)) {
      console.error(`❌ verifier.sol not found in folder: ${folderPath}`);
      process.exit(1);
    }

    // 🔍 Read Solidity source
    const source = fs.readFileSync(verifierPath, 'utf8');
    const input = {
      language: 'Solidity',
      sources: { 'verifier.sol': { content: source } },
      settings: {
        outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } }
      }
    };

    // ✅ Compile contract
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    const contractName = Object.keys(output.contracts['verifier.sol'])[0];
    const contractData = output.contracts['verifier.sol'][contractName];

    const abi = contractData.abi;
    const bytecode = contractData.evm.bytecode.object;

    if (!bytecode || bytecode.length === 0) throw new Error('Compilation failed, no bytecode found.');

    // 🟢 Connect to Arbitrum RPC
    const web3 = new Web3(rpcUrl);
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    // 📦 Deploy contract
    const contract = new web3.eth.Contract(abi);
    const deployTx = contract.deploy({ data: '0x' + bytecode });
    const gasEstimate = await deployTx.estimateGas({ from: account.address });

    const deployedContract = await deployTx.send({
      from: account.address,
      gas: gasEstimate
    });

    const deploymentInfo = {
      contractAddress: deployedContract.options.address,
      abi
    };

    // 📝 Save deployment info
    await fs.writeJson(path.join(folderPath, 'deployment.json'), deploymentInfo, { spaces: 2 });

    console.log(`✅ Contract deployed on Arbitrum!`);
    console.log(`📦 Contract Address: ${deployedContract.options.address}`);
  } catch (err) {
    console.error("❌ Deployment failed:", err.message || err);
    process.exit(1);
  }
}

module.exports = { deployVerifier };
