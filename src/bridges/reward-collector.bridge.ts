import { NetworkProxy } from '../network-proxy';
import { handleErrorMessage, phase } from '../utils';
import { getLogger } from 'log4js';

const logger = getLogger('RewardCollectorBridge');

export class RewardCollectorBridge {
  constructor(private networkProxy: NetworkProxy) {

  }

  @phase('Daily task reward collect')
  async collectDailyTaskReward() {
    try {
      return await this.networkProxy.collectDailyTaskReward();
    } catch (e) {
      handleErrorMessage(e, 'You have already collected the reward', () => {
        logger.info('Already collected');
      });
    }

  }
}
