const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');
const Web3 = require('web3');
const { addBridgeSupport } = require('../scripts/addBridgeSupport');

async function deployWithBridge(folderPath, privateKey, options = {}) {
    addBridgeSupport(folderPath);
}

module.exports = { deployWithBridge };