#!/usr/bin/env node

const { program } = require('commander');

program
  .command('compile <circomFilePath>')
  .description('Compile a circom circuit')
  .action((circomFilePath) => {
    // Call compile function here
  });


program.parse(process.argv);