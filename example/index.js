const { M0ck } = require('../dist');

const debug = require('debug')('m0ck');

/**
 *
 * @returns {Promise<void>}
 */
const main = async () => {
  const m0ck = new M0ck({ srcDir: './example/mocks', port: 9300 });
  await m0ck.startup();
};

/**
 *
 */

main().catch(err => console.error(err));
