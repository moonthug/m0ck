#!/usr/bin/env node
const yargs = require('yargs');

const { M0ck } = require('../lib');

// Args
const argv = yargs
  .option('srcDir', {
    description: 'Source Directory',
    requiresArg: true
  })
  .option('port', {
    description: 'HTTP Port',
    default: '8080',
    requiresArg: true
  })
  .demandOption(['srcDir']).argv;

/**
 *
 * @returns {Promise<void>}
 */
const main = async () => {
  const m0ck = new M0ck({ srcDir: argv.srcDir, port: argv.port });
  await m0ck.startup();
};

/**
 *
 */

main().catch(err => {
  console.error(err);
  process.exit(1);
});

