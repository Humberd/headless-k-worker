import { Dispatcher } from './dispatcher';
import { getLogger } from 'log4js';
import Signals = NodeJS.Signals;

const logger = getLogger('Signal handler');

export function handleSignals(dispatcher: Dispatcher) {
  process.on('SIGTERM', stopProcessGracefully);
  process.on('SIGINT', stopProcessGracefully);

  function stopProcessGracefully(signal: Signals) {
    logger.info(`Received ${signal}`);
    dispatcher.shutdown();
    // process.exit(0);
  }
}
