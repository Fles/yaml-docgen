#!/usr/bin/env node

const commander = require('commander')
const parse = require('../lib/parse/')

commander
  .command('parse')
  .action(parse)
  .option('-i <input yaml file>', 'Path to .yaml file')
  .option('-o <output md file>', 'Path to output file')
  .description('Parse .yaml comments to markdown.')

commander.parse(process.argv)
