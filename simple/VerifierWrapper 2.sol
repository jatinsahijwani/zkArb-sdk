
    // SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import "./verifier.sol";

contract VerifierWrapper is Groth16Verifier {
    event ProofVerified(address indexed verifier, bool success);

    function verifyProofOptimized(
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[1] calldata input
    ) public returns (bool) {
        bool result = verifyProof(a, b, c, input);
        emit ProofVerified(msg.sender, result);
        return result;
    }
}

    