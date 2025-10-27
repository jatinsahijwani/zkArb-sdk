#!/usr/bin/env node
/**
 * zkArb CLI Entry Point
 * ---------------------
 * This script defines the Command Line Interface (CLI) for the zkArb SDK.
 * It uses the `commander` library to register CLI commands and their respective
 * actions, allowing developers to interact with zkArb SDK directly from the terminal.
 *
 * Example usage:
 *   $ zkArb compile path/to/circuit.circom
 *
 */

const { program } = require('commander');
const {compileCircuit} = require('../lib/compile');
const {testCircuit} = require('../lib/test'); 
const {deployVerifier} = require('../lib/deploy');
const {verifyProof} = require('../lib/verify');

/**
 * Define the `compile` command
 * ----------------------------
 * This command compiles a `.circom` file into its intermediate and final artifacts
 * used for generating zk-SNARK proofs.
 *
 * Arguments:
 *   <circomFilePath> - The path to the `.circom` circuit file to compile.
 *
 * Description:
 *   The `compile` command will invoke the compiler internally
 *   (once the compile function is implemented) and produce the
 *   necessary output files (e.g., R1CS, wasm, and zkey).
 *
 * Example:
 *   $ zkArb compile circuits/transfer.circom
 */
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
  .description('Deploy verifier.sol in folder to Avalanche using provided private key')
  .action((folder, privateKey) => {
    deployVerifier(folder, privateKey);
  });


/**
 * Parse CLI arguments and execute the corresponding command.
 * 
 * This line ensures that any arguments passed via the terminal
 * are recognized and routed to their corresponding command handlers.
 */
program.parse(process.argv);

module.exports = {
  verifyProof
};    