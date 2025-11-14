const fs = require("fs");
const path = require("path");

function generateL1Receiver(folderPath, options = {}) {
  const filePath = path.join(folderPath, "L1Receiver.sol");

  // prevent unwanted overwrite
  if (fs.existsSync(filePath) && !options.force) {
    console.log("ℹ️ L1Receiver.sol already exists — skipping generation.");
    return;
  }

  const code = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract L1Receiver {
    event ProofReceived(address indexed fromVerifier, address indexed relayer, uint256 timestamp);

    address public lastVerifier;
    address public lastRelayer;
    uint256 public lastTimestamp;
    uint256 public totalReceived;

    function receiveProof(address verifier, uint256 timestamp) external {
        lastVerifier = verifier;
        lastRelayer = msg.sender;
        lastTimestamp = timestamp;
        totalReceived += 1;

        emit ProofReceived(verifier, msg.sender, timestamp);
    }
}
`.trimStart();

  fs.writeFileSync(filePath, code, "utf8");
  console.log("✨ L1Receiver.sol generated successfully at:", filePath);
}

module.exports = { generateL1Receiver };
