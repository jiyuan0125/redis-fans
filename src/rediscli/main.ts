import program from 'commander';
import { RedisClient } from './redis';
import packageConfig from '../../package.json';

program
  .version(packageConfig.version)
  .usage('rdcli [OPTIONS] [cmd [arg [arg ...]]]')
  .option('-h, --host <hostname>', 'Server hostname (default: 127.0.0.1).')
  .option('-p, --port <port>', 'Server port (default: 6379).', parseInt)
  .option(
    '-s, --socket <socket>',
    'Server socket (overrides hostname and port).'
  )
  .option('-a, --auth <password>', 'Server password.')
  .option('-m, --mode <mode>', 'Server Type, only redis available now.')
  .option('--security-type <securityType>', 'Security Type.')
  .option('--ssl-public-key <sslPublicKey>', 'SSL Public key.')
  .option('--ssl-private-key <sslPrivateKey>', 'SSL Private key.')
  .option('--ssl-authority <sslAuthority>', 'SSL Authority.')
  .option(
    '--ssl-enable-strict-mode <sslEnableStrictMode>',
    'SSL Enabel Strict Mode.'
  )
  .option(
    '--adv-connection-timeout <adv-connection-timeout>',
    'Connection Timeout.',
    parseInt
  )
  .option(
    '--adv-total-retry-time <adv-total-retry-time>',
    'Total Retry Time.',
    parseInt
  )
  .option('--adv-max-attempts <adv-max-attempts>', 'Max Attempts.', parseInt)
  .parse(process.argv);

const host = program.host || '127.0.0.1';
const port = program.port || 6379;
const auth = program.auth || '';
const mode = program.mode || 'redis';
const securityType = program.securityType || '';
const sslPublicKey = program.sslPublicKey || '';
const sslPrivateKey = program.sslPrivateKey || '';
const sslAuthority = program.sslAuthority || '';
const advConnectionTimeout = program.advConnectionTimeout || 0;
const advTotalRetryTime = program.advTotalRetryTime || 0;
const advMaxAttempts = program.advMaxAttempts || 0;

if (mode.toLowerCase() == 'redis') {
  new RedisClient(
    host,
    port,
    auth,
    securityType,
    sslPublicKey,
    sslPrivateKey,
    sslAuthority,
    advConnectionTimeout,
    advTotalRetryTime,
    advMaxAttempts
  );
} else {
  console.log('Not Support %s Now!', mode);
}
