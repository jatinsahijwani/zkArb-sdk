const { verifyAndEmit } = require("./lib/verifyAndEmit");

async function main() {
    const input = {
        "a" : "3", 
        "b" : "11"
    };

    const path = "./simple";

    const result = await verifyAndEmit(input,path, "0x566d6a0f09b905746f0525805bf7f1ee92d5e4af9b9e58319123587e4564ce6b");
    console.log(result);
}

main();