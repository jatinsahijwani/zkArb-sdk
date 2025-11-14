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
