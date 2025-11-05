const path = require("path");
const { verifyProof } = require("../../lib/verify");

async function main() {
    // Absolute path to this circuit’s folder
    const circuitPath = path.join(__dirname);

    // Test case 1: input that should pass
    let input = { "preimage": ["3", "5"] };
    let result = await verifyProof(input, circuitPath);
    console.log("Verification result for [3,5]:", result);

    // Test case 2: input that should fail
    input = { "preimage": ["4", "5"] };
    result = await verifyProof(input, circuitPath);
    console.log("Verification result for [4,5]:", result);
}

main().catch((err) => {
    console.error("Error during verification:", err);
});
