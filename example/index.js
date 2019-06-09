const { M0ck } = require('../lib');

const debug = require('debug')('m0ck');

/**
 *
 * @returns {Promise<void>}
 */
const main = async () => {
  const m0ck = new M0ck();
};

/**
 *
 */

main().catch(err => console.error(err));
