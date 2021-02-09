#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const {ParserAPI, ConfigAPI} = require('./lib/index');

const {version} = require('./package.json');

const onCommand = (argv) => {
  const data = ParserAPI.parse(argv.directory, argv.task, argv.os, argv.config);

  if (!data) {
    return false;
  }

  if (data.process()) {
    if (data.compile()) {
      data.execute();
    }
  }
}

const args = yargs(hideBin(process.argv))
  .option('directory', {
    alias: 'd',
    type: 'string',
    default: './',
    description: 'Directory to process'
  })
  .option('task', {
    alias: 't',
    type: 'string',
    required: true,
    description: 'Task to execute'
  })
  .option('os', {
    type: 'string',
    default: null,
    description: 'Operation system to process'
  })
  .option('config', {
    alias: 'c',
    type: 'string',
    default: './config.json',
    description: 'Path to the config file'
  })
  .choices('os', ConfigAPI.OSValues)
  .version(version)
  .argv;

onCommand(args);
