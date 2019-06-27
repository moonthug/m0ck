import { M0ck } from './M0ck';

const main = async () => {
  const mock: M0ck = new M0ck({ srcDir: './example/mocks', port: 9300 });
  await mock.startup();
};

main().catch(err => console.error(err.toString()));
