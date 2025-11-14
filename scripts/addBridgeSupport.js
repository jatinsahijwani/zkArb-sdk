const fs = require("fs");
const path = require("path");

function addBridgeSupport(folderPath) {
  const filePath = path.join(folderPath, "verifier.sol");

  if (!fs.existsSync(filePath)) {
    console.error("❌ verifier.sol not found:", filePath);
    return;
  }

  let code = fs.readFileSync(filePath, "utf8");

  // ============================================================
  // 1. Insert Event Inside Contract
  // ============================================================

  const eventLine =
    "event ProofVerified(address indexed verifier, bool success, uint256 indexed timestamp);";

  if (!code.includes(eventLine)) {
    code = code.replace(
      /contract\s+[\w\d_]+\s*{/,
      (match) => `${match}\n    ${eventLine}\n`
    );

    console.log("✅ Added ProofVerified event");
  } else {
    console.log("ℹ️ Event already exists, skipping");
  }

  // ============================================================
  // 2. Insert verifyAndEmit() Function
  // ============================================================

  const functionBlock = `
    function verifyAndEmit(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[1] calldata _pubSignals
    ) external returns (bool) {
        bool success = this.verifyProof(_pA, _pB, _pC, _pubSignals);
        if (success) {
            emit ProofVerified(msg.sender, true, block.timestamp);
        }
        return success;
    }
`;

  if (!code.includes("verifyAndEmit(")) {
    // Insert before the last closing brace
    code = code.replace(/\}\s*$/s, `${functionBlock}\n}`);
    console.log("✅ Added verifyAndEmit function");
  } else {
    console.log("ℹ️ verifyAndEmit already exists, skipping");
  }

  // ============================================================
  // 3. Write final output
  // ============================================================

  fs.writeFileSync(filePath, code, "utf8");
  console.log("✨ verifier.sol updated successfully");
}

module.exports = { addBridgeSupport };
