const {verifyProof} = require("./lib/verify");

async function main() {
    const path = "./simple";
    const input = {"a" : "1", "b" : "34"};

    const result = await verifyProof(input, path);
    console.log("Result:", result);
}

main();