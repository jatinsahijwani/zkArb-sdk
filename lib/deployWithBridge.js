const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');
const Web3 = require('web3');
const { addBridgeSupport } = require('../scripts/addBridgeSupport');
const { generateL1Receiver } = require("../scripts/generateL1Receiver");
const { generateRelayer } = require("../scripts/relayerGenerator");

let l2RPC = "https://sepolia-rollup.arbitrum.io/rpc";
const l1RPC = "http://127.0.0.1:8547";

async function deployWithBridge(folderPath, privateKey, options = {}) {
    addBridgeSupport(folderPath);
    generateL1Receiver(folderPath);
    
    //deploying verifier on L2
    const customRpc = options.rpc; // user-provided RPC (for Orbit chains)
    console.log("customRpc:", customRpc);
    if (customRpc) {
      console.log(`🛰️ Using custom RPC for Orbit chain: ${customRpc}`)
      l2RPC = customRpc;
    }
    else {
      console.log(`🌐 Deploying to: sepolia (${l2RPC})`);
    }

    const baseVerifierPath = path.join(folderPath, 'verifier.sol');
    const fileToCompile = baseVerifierPath;
    const fileName = path.basename(fileToCompile);
    const source = fs.readFileSync(fileToCompile, 'utf8');
    const input = {
      language: 'Solidity',
      sources: { [fileName]: { content: source } },
      settings: {
        optimizer: { enabled: true, runs: 200 },
        outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } }
      }
    };
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    const contractName = Object.keys(output.contracts[fileName])[0];
    const contractData = output.contracts[fileName][contractName];
    const abi = contractData.abi;
    const bytecode = contractData.evm.bytecode.object;
    const l2web3 = new Web3(l2RPC);
    const account = l2web3.eth.accounts.privateKeyToAccount(privateKey);
    l2web3.eth.accounts.wallet.add(account);
    l2web3.eth.defaultAccount = account.address;
    const l2contract = new l2web3.eth.Contract(abi);
    const l2deploytx = l2contract.deploy({ data: '0x' + bytecode });
    const l2gasEstimate = await l2deploytx.estimateGas({ from: account.address });
    const l2deployedContract = await l2deploytx.send({from: account.address, gas: l2gasEstimate});
    console.log(`✅ Verifier Contract deployed on Arbitrum Sepolia!`);
    console.log(`📦 Address: ${l2deployedContract.options.address}`);

    //deploying L1 receiver contract on L1
    const l1ReceiverPath = path.join(folderPath, 'L1Receiver.sol');
    const l1fileToCompile = l1ReceiverPath;
    const l1fileName = path.basename(l1fileToCompile);
    const l1source = fs.readFileSync(l1fileToCompile, 'utf8');
    const l1input = {
      language: 'Solidity',
      sources: { [l1fileName]: { content: l1source } },
      settings: {
        optimizer: { enabled: true, runs: 200 },
        outputSelection: { '*': { '*': ['abi', 'evm.bytecode.object'] } }
      }
    };
    const l1output = JSON.parse(solc.compile(JSON.stringify(l1input)));
    const l1contractName = Object.keys(l1output.contracts[l1fileName])[0];
    const l1contractData = l1output.contracts[l1fileName][l1contractName];
    const l1abi = l1contractData.abi;
    const l1bytecode = l1contractData.evm.bytecode.object;
    const l1web3 = new Web3(l1RPC);
    const account2 = l2web3.eth.accounts.privateKeyToAccount("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
    l1web3.eth.accounts.wallet.add(account2);
    l1web3.eth.defaultAccount = account2.address;
    const l1contract = new l1web3.eth.Contract(l1abi);
    const l1deploytx = l1contract.deploy({ data: '0x' + l1bytecode });
    const l1gasEstimate = await l1deploytx.estimateGas({ from: account2.address });
    const l1deployedContract = await l1deploytx.send({from: account2.address, gas: l1gasEstimate});
    console.log(`✅ L1 Receiver Contract deployed on Sepolia!`);
    console.log(`📦 Address: ${l1deployedContract.options.address}`);

    // save deployment info
    const deploymentInfo = {
        network: "sepolia",
        rpc: l2RPC,
        contractName,
        contractAddress: l2deployedContract.options.address,
        abi,
        isOptimized: false,
        deployedAt: new Date().toISOString()
    }
    await fs.writeJson(path.join(folderPath, 'deployment.json'), deploymentInfo, { spaces: 2 });



    //make completed relayer after deployment
    generateRelayer(folderPath, l2deployedContract.options.address, l1deployedContract.options.address, abi, l1abi, privateKey, l2RPC);
}

module.exports = { deployWithBridge };