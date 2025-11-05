const path = require("path");
const { verifyProof } = require("../../lib/verify");

async function main() {
    // Absolute folder path
    const circuitPath = path.join(__dirname);

    // ✅ Test case 1: Correct multiplication
    let input = { "x": "3", "y": "4" };
    let result = await verifyProof(input, circuitPath);
    console.log("Verification result for 3 * 4:", result);

    // ❌ Test case 2: Incorrect input that should fail
    input = { "x": "2", "y": "4" };
    result = await verifyProof(input, circuitPath);
    console.log("Verification result for 2 * 4:", result);
}

main().catch((err) => {
    console.error("Error during verification:", err);
});
