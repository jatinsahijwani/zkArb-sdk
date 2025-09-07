const { compileCircuit } = require('../lib/compile');
const { testCircuit } = require('../lib/test');
const { deployVerifier } = require('../lib/deploy');
const { verifyProof } = require('../lib/verify');



module.exports = {
    verifyProof,
    compileCircuit,
    testCircuit,
    deployVerifier
};