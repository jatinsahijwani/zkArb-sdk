#!/usr/bin/env node

const { program } = require('commander');
const { compileCircuit } = require('../lib/compile');
const { testCircuit } = require('../lib/test');
const { deployVerifier } = require('../lib/deploy');
const { verifyProof } = require('../lib/verify');

program
  .command('compile <circomFilePath>')
  .description('Compile a circom circuit')
  .action((circomFilePath) => {
    compileCircuit(circomFilePath);
  });

program
  .command('test <folder> <inputJson>')
  .description('Test the circuit with input.json and generate proof/public.json')
  .action((folder, inputJson) => {
    testCircuit(folder, inputJson);
  });

  program
  .command('deploy <folder> <privateKey>')
  .description('Deploy verifier.sol in folder to Arbitrum using provided private key')
  .action((folder, privateKey) => {
    deployVerifier(folder, privateKey);
  });

program.parse(process.argv);

   module.exports = {
  verifyProof
};    