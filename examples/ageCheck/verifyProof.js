const path = require("path");
const { verifyProof } = require("../../lib/verify");

async function main() {
    const circuitPath = path.join(__dirname); // absolute path of current folder (ageCheck)

    let input = { "age": "20" };
    let result = await verifyProof(input, circuitPath);
    console.log("Verification result for age 20:", result);

    input = { "age": "14" };
    result = await verifyProof(input, circuitPath);
    console.log("Verification result for age 14:", result);
}

main();
